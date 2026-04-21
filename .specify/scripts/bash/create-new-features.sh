#!/usr/bin/env bash

set -e

JSON_MODE=false
DRY_RUN=false
ALLOW_EXISTING=false
BRANCH_ONLY=false
SHORT_NAME=""
BRANCH_NUMBER=""
REQUIREMENT_KIND=""
EXPLICIT_BRANCH_NAME="${GIT_BRANCH_NAME:-}"
ARGS=()

i=1
while [ $i -le $# ]; do
    arg="${!i}"
    case "$arg" in
        --json)
            JSON_MODE=true
            ;;
        --dry-run)
            DRY_RUN=true
            ;;
        --allow-existing-branch)
            ALLOW_EXISTING=true
            ;;
        --branch-only)
            BRANCH_ONLY=true
            ;;
        --short-name|--name)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --short-name requires a value' >&2
                exit 1
            fi
            SHORT_NAME="$next_arg"
            ;;
        --number)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --number requires a value' >&2
                exit 1
            fi
            BRANCH_NUMBER="$next_arg"
            if [[ ! "$BRANCH_NUMBER" =~ ^[0-9]+$ ]]; then
                echo 'Error: --number must be a non-negative integer' >&2
                exit 1
            fi
            ;;
        --kind|--type)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --kind requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --kind requires a value' >&2
                exit 1
            fi
            REQUIREMENT_KIND="$next_arg"
            ;;
        --branch-name)
            if [ $((i + 1)) -gt $# ]; then
                echo 'Error: --branch-name requires a value' >&2
                exit 1
            fi
            i=$((i + 1))
            next_arg="${!i}"
            if [[ "$next_arg" == --* ]]; then
                echo 'Error: --branch-name requires a value' >&2
                exit 1
            fi
            EXPLICIT_BRANCH_NAME="$next_arg"
            ;;
        --help|-h)
            echo "Usage: $0 [--json] [--dry-run] [--allow-existing-branch] [--branch-only] [--short-name <name>] [--number N] [--kind feature|bugfix] [--branch-name <name>] <requirement_description>"
            echo ""
            echo "Options:"
            echo "  --json                   Output in JSON format"
            echo "  --dry-run                Compute branch name and artifact paths without writing files"
            echo "  --allow-existing-branch  Switch to an existing branch instead of failing"
            echo "  --branch-only            Create or resolve the branch without generating artifacts"
            echo "  --short-name <name>      Provide a custom short name (2-4 words)"
            echo "  --number N               Specify feature number manually for feat branches"
            echo "  --kind <feature|bugfix>  Force branch kind instead of using auto-detection"
            echo "  --branch-name <name>     Use this exact branch name"
            echo ""
            echo "Environment variables:"
            echo "  GIT_BRANCH_NAME          Same as --branch-name"
            echo ""
            echo "Examples:"
            echo "  $0 'Add user authentication system' --short-name 'user-auth'"
            echo "  $0 --kind bugfix 'Fix payment timeout bug'"
            echo "  GIT_BRANCH_NAME=feat/004-user-auth $0 'Add user authentication system'"
            exit 0
            ;;
        *)
            ARGS+=("$arg")
            ;;
    esac
    i=$((i + 1))
done

FEATURE_DESCRIPTION="${ARGS[*]}"
if [ -z "$FEATURE_DESCRIPTION" ]; then
    echo "Usage: $0 [--json] [--dry-run] [--allow-existing-branch] [--branch-only] [--short-name <name>] [--number N] [--kind feature|bugfix] [--branch-name <name>] <requirement_description>" >&2
    exit 1
fi

FEATURE_DESCRIPTION=$(echo "$FEATURE_DESCRIPTION" | xargs)
if [ -z "$FEATURE_DESCRIPTION" ]; then
    echo "Error: Requirement description cannot be empty or contain only whitespace" >&2
    exit 1
fi

if [[ -n "$REQUIREMENT_KIND" ]] && [[ "$REQUIREMENT_KIND" != "feature" ]] && [[ "$REQUIREMENT_KIND" != "bugfix" ]]; then
    echo "Error: --kind must be either 'feature' or 'bugfix'" >&2
    exit 1
fi

get_highest_from_specs() {
    local specs_dir="$1"
    local highest=0

    if [ -d "$specs_dir" ]; then
        for dir in "$specs_dir"/*; do
            [ -d "$dir" ] || continue
            dirname=$(basename "$dir")
            if echo "$dirname" | grep -Eq '^[0-9]{3,}-'; then
                number=$(echo "$dirname" | grep -Eo '^[0-9]+')
                number=$((10#$number))
                if [ "$number" -gt "$highest" ]; then
                    highest=$number
                fi
            fi
        done
    fi

    echo "$highest"
}

_extract_highest_number() {
    local highest=0
    while IFS= read -r name; do
        [ -z "$name" ] && continue
        local effective_name
        effective_name=$(spec_kit_effective_branch_name "$name")
        if echo "$effective_name" | grep -Eq '^[0-9]{3,}-'; then
            number=$(echo "$effective_name" | grep -Eo '^[0-9]+' || echo "0")
            number=$((10#$number))
            if [ "$number" -gt "$highest" ]; then
                highest=$number
            fi
        fi
    done
    echo "$highest"
}

get_highest_from_branches() {
    git branch -a 2>/dev/null | sed 's/^[* ]*//; s|^remotes/[^/]*/||' | _extract_highest_number
}

get_highest_from_remote_refs() {
    local highest=0

    for remote in $(git remote 2>/dev/null); do
        local remote_highest
        remote_highest=$(GIT_TERMINAL_PROMPT=0 git ls-remote --heads "$remote" 2>/dev/null | sed 's|.*refs/heads/||' | _extract_highest_number)
        if [ "$remote_highest" -gt "$highest" ]; then
            highest=$remote_highest
        fi
    done

    echo "$highest"
}

check_existing_feature_branches() {
    local specs_dir="$1"
    local skip_fetch="${2:-false}"

    if [ "$skip_fetch" = true ]; then
        local highest_remote
        highest_remote=$(get_highest_from_remote_refs)
        local highest_branch
        highest_branch=$(get_highest_from_branches)
        if [ "$highest_remote" -gt "$highest_branch" ]; then
            highest_branch=$highest_remote
        fi
    else
        git fetch --all --prune >/dev/null 2>&1 || true
        local highest_branch
        highest_branch=$(get_highest_from_branches)
    fi

    local highest_spec
    highest_spec=$(get_highest_from_specs "$specs_dir")

    local max_num=$highest_branch
    if [ "$highest_spec" -gt "$max_num" ]; then
        max_num=$highest_spec
    fi

    echo $((max_num + 1))
}

clean_branch_name() {
    local name="$1"
    echo "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/-\+/-/g' | sed 's/^-//' | sed 's/-$//'
}

generate_branch_suffix() {
    local description="$1"
    local stop_words="^(i|a|an|the|to|for|of|in|on|at|by|with|from|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|should|could|can|may|might|must|shall|this|that|these|those|my|your|our|their|want|need|add|get|set)$"
    local clean_name
    clean_name=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/ /g')

    local meaningful_words=()
    for word in $clean_name; do
        [ -z "$word" ] && continue
        if ! echo "$word" | grep -qiE "$stop_words"; then
            if [ ${#word} -ge 3 ]; then
                meaningful_words+=("$word")
            elif echo "$description" | grep -q "\b${word^^}\b"; then
                meaningful_words+=("$word")
            fi
        fi
    done

    if [ ${#meaningful_words[@]} -gt 0 ]; then
        local max_words=3
        if [ ${#meaningful_words[@]} -eq 4 ]; then
            max_words=4
        fi

        local result=""
        local count=0
        for word in "${meaningful_words[@]}"; do
            if [ $count -ge $max_words ]; then
                break
            fi
            if [ -n "$result" ]; then
                result="$result-"
            fi
            result="$result$word"
            count=$((count + 1))
        done
        echo "$result"
    else
        local cleaned
        cleaned=$(clean_branch_name "$description")
        echo "$cleaned" | tr '-' '\n' | grep -v '^$' | head -3 | tr '\n' '-' | sed 's/-$//'
    fi
}

infer_requirement_kind() {
    local description_lc="$1"

    if [[ -n "$REQUIREMENT_KIND" ]]; then
        echo "$REQUIREMENT_KIND"
        return
    fi

    if [[ -n "$EXPLICIT_BRANCH_NAME" ]]; then
        if [[ "$EXPLICIT_BRANCH_NAME" == bugfix/* ]]; then
            echo "bugfix"
            return
        fi
        echo "feature"
        return
    fi

    if echo "$description_lc" | grep -Eq '(^|[[:space:]])(fix|bug|bugfix|hotfix|patch|regression)([[:space:]]|$)'; then
        echo "bugfix"
    else
        echo "feature"
    fi
}

artifact_file_name_for_branch() {
    local branch_name="$1"
    local effective_name
    effective_name=$(spec_kit_effective_branch_name "$branch_name")
    printf '%s\n' "$(echo "$effective_name" | tr '/' '-')"
}

write_feature_json() {
    local json_path="$1"
    local branch_name="$2"
    local base_branch="$3"
    local feature_type="$4"
    local feature_dir="$5"
    local requirements_file="$6"
    local plan_file="$7"
    local tasklist_file="$8"

    mkdir -p "$(dirname "$json_path")"

    local rel_feature_dir rel_requirements rel_plan rel_tasklist
    rel_feature_dir=$(realpath --relative-to="$REPO_ROOT" "$feature_dir")
    rel_requirements=$(realpath --relative-to="$REPO_ROOT" "$requirements_file")
    rel_plan=$(realpath --relative-to="$REPO_ROOT" "$plan_file")
    rel_tasklist=$(realpath --relative-to="$REPO_ROOT" "$tasklist_file")

    if command -v jq >/dev/null 2>&1; then
        jq -cn \
            --arg branch_name "$branch_name" \
            --arg base_branch "$base_branch" \
            --arg feature_type "$feature_type" \
            --arg feature_directory "$rel_feature_dir" \
            --arg feature_spec "$rel_requirements" \
            --arg requirements_file "$rel_requirements" \
            --arg impl_plan "$rel_plan" \
            --arg tasklist_file "$rel_tasklist" \
            --arg tasks_file "$rel_tasklist" \
            '{branch_name:$branch_name,base_branch:$base_branch,feature_type:$feature_type,feature_directory:$feature_directory,feature_spec:$feature_spec,requirements_file:$requirements_file,impl_plan:$impl_plan,tasklist_file:$tasklist_file,tasks_file:$tasks_file}' > "$json_path"
    else
        printf '{"branch_name":"%s","base_branch":"%s","feature_type":"%s","feature_directory":"%s","feature_spec":"%s","requirements_file":"%s","impl_plan":"%s","tasklist_file":"%s","tasks_file":"%s"}\n' \
            "$(json_escape "$branch_name")" \
            "$(json_escape "$base_branch")" \
            "$(json_escape "$feature_type")" \
            "$(json_escape "$rel_feature_dir")" \
            "$(json_escape "$rel_requirements")" \
            "$(json_escape "$rel_requirements")" \
            "$(json_escape "$rel_plan")" \
            "$(json_escape "$rel_tasklist")" \
            "$(json_escape "$rel_tasklist")" > "$json_path"
    fi
}

SCRIPT_DIR="$(CDPATH="" cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

REPO_ROOT=$(get_repo_root)
if has_git; then
    HAS_GIT=true
    BASE_BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD)
else
    HAS_GIT=false
    BASE_BRANCH="main"
fi

cd "$REPO_ROOT"

SPECS_DIR="$REPO_ROOT/specs"
BUGFIX_DIR="$SPECS_DIR/bugfix"
if [ "$DRY_RUN" != true ] && [ "$BRANCH_ONLY" != true ]; then
    mkdir -p "$SPECS_DIR"
fi

DESCRIPTION_LC=$(echo "$FEATURE_DESCRIPTION" | tr '[:upper:]' '[:lower:]')
REQUIREMENT_TYPE=$(infer_requirement_kind "$DESCRIPTION_LC")

if [ -n "$SHORT_NAME" ]; then
    BRANCH_SUFFIX=$(clean_branch_name "$SHORT_NAME")
else
    BRANCH_SUFFIX=$(generate_branch_suffix "$FEATURE_DESCRIPTION")
fi

if [ -z "$BRANCH_SUFFIX" ]; then
    echo "Error: Failed to generate a valid short name for the requirement" >&2
    exit 1
fi

FEATURE_NUM=""

if [ -n "$EXPLICIT_BRANCH_NAME" ]; then
    BRANCH_NAME="$EXPLICIT_BRANCH_NAME"
    if [[ "$BRANCH_NAME" == feat/* ]]; then
        REQUIREMENT_TYPE="feature"
        EFFECTIVE_BRANCH=$(spec_kit_effective_branch_name "$BRANCH_NAME")
        if [[ "$EFFECTIVE_BRANCH" =~ ^([0-9]{3,})-(.+)$ ]]; then
            FEATURE_NUM="${BASH_REMATCH[1]}"
            BRANCH_SUFFIX="${BASH_REMATCH[2]}"
        else
            echo "Error: Explicit feature branch names must match feat/NNN-short-name" >&2
            exit 1
        fi
    elif [[ "$BRANCH_NAME" == bugfix/* ]]; then
        REQUIREMENT_TYPE="bugfix"
        BRANCH_SUFFIX="$(spec_kit_effective_branch_name "$BRANCH_NAME")"
    else
        echo "Error: Explicit branch names must start with feat/ or bugfix/" >&2
        exit 1
    fi
else
    if [ "$REQUIREMENT_TYPE" = "feature" ]; then
        if [ -z "$BRANCH_NUMBER" ]; then
            if [ "$DRY_RUN" = true ] && [ "$HAS_GIT" = true ]; then
                BRANCH_NUMBER=$(check_existing_feature_branches "$SPECS_DIR" true)
            elif [ "$DRY_RUN" = true ]; then
                HIGHEST=$(get_highest_from_specs "$SPECS_DIR")
                BRANCH_NUMBER=$((HIGHEST + 1))
            elif [ "$HAS_GIT" = true ]; then
                BRANCH_NUMBER=$(check_existing_feature_branches "$SPECS_DIR")
            else
                HIGHEST=$(get_highest_from_specs "$SPECS_DIR")
                BRANCH_NUMBER=$((HIGHEST + 1))
            fi
        fi

        FEATURE_NUM=$(printf "%03d" "$((10#$BRANCH_NUMBER))")
        BRANCH_NAME="feat/${FEATURE_NUM}-${BRANCH_SUFFIX}"
    else
        BRANCH_NAME="bugfix/${BRANCH_SUFFIX}"
    fi
fi

if [ "$REQUIREMENT_TYPE" = "feature" ]; then
    MAX_BRANCH_LENGTH=244
    if [ ${#BRANCH_NAME} -gt $MAX_BRANCH_LENGTH ]; then
        PREFIX_LENGTH=$(( ${#BRANCH_NAME} - ${#BRANCH_SUFFIX} ))
        MAX_SUFFIX_LENGTH=$((MAX_BRANCH_LENGTH - PREFIX_LENGTH))
        TRUNCATED_SUFFIX=$(echo "$BRANCH_SUFFIX" | cut -c1-"$MAX_SUFFIX_LENGTH")
        TRUNCATED_SUFFIX=$(echo "$TRUNCATED_SUFFIX" | sed 's/-$//')
        ORIGINAL_BRANCH_NAME="$BRANCH_NAME"
        BRANCH_SUFFIX="$TRUNCATED_SUFFIX"
        BRANCH_NAME="feat/${FEATURE_NUM}-${BRANCH_SUFFIX}"
        >&2 echo "[specify] Warning: Branch name exceeded GitHub's 244-byte limit"
        >&2 echo "[specify] Original: $ORIGINAL_BRANCH_NAME (${#ORIGINAL_BRANCH_NAME} bytes)"
        >&2 echo "[specify] Truncated to: $BRANCH_NAME (${#BRANCH_NAME} bytes)"
    fi
fi

if [ "$REQUIREMENT_TYPE" = "feature" ]; then
    FEATURE_DIR="$SPECS_DIR/${FEATURE_NUM}-${BRANCH_SUFFIX}"
    REQUIREMENTS_FILE="$FEATURE_DIR/requirements.md"
    TASKLIST_FILE="$FEATURE_DIR/tasklist.md"
    PLAN_FILE="$FEATURE_DIR/plan.md"
else
    FEATURE_DIR="$BUGFIX_DIR"
    BUGFIX_FILE_KEY=$(artifact_file_name_for_branch "$BRANCH_NAME")
    REQUIREMENTS_FILE="$FEATURE_DIR/${BUGFIX_FILE_KEY}.md"
    TASKLIST_FILE="$FEATURE_DIR/${BUGFIX_FILE_KEY}.tasklist.md"
    PLAN_FILE="$FEATURE_DIR/${BUGFIX_FILE_KEY}.plan.md"
fi

if [ "$DRY_RUN" != true ] && [ "$HAS_GIT" = true ]; then
    CURRENT_BRANCH=$(git -C "$REPO_ROOT" rev-parse --abbrev-ref HEAD 2>/dev/null || true)
    if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
        branch_create_error=""
        if ! branch_create_error=$(git -C "$REPO_ROOT" checkout -q -b "$BRANCH_NAME" 2>&1); then
            if git -C "$REPO_ROOT" branch --list "$BRANCH_NAME" | grep -q .; then
                if [ "$ALLOW_EXISTING" = true ]; then
                    if ! switch_branch_error=$(git -C "$REPO_ROOT" checkout -q "$BRANCH_NAME" 2>&1); then
                        >&2 echo "Error: Failed to switch to existing branch '$BRANCH_NAME'. Please resolve any local changes or conflicts and try again."
                        if [ -n "$switch_branch_error" ]; then
                            >&2 printf '%s\n' "$switch_branch_error"
                        fi
                        exit 1
                    fi
                else
                    >&2 echo "Error: Branch '$BRANCH_NAME' already exists. Please use a different short name or provide a different number with --number."
                    exit 1
                fi
            else
                >&2 echo "Error: Failed to create git branch '$BRANCH_NAME'."
                if [ -n "$branch_create_error" ]; then
                    >&2 printf '%s\n' "$branch_create_error"
                fi
                exit 1
            fi
        fi
    fi
elif [ "$DRY_RUN" != true ]; then
    >&2 echo "[specify] Warning: Git repository not detected; skipped branch creation for $BRANCH_NAME"
fi

if [ "$DRY_RUN" != true ] && [ "$BRANCH_ONLY" != true ]; then
    mkdir -p "$(dirname "$REQUIREMENTS_FILE")"

    if [ ! -f "$REQUIREMENTS_FILE" ]; then
        REQUIREMENTS_TEMPLATE=$(resolve_template "requirements-template" "$REPO_ROOT") || true
        if [ -z "$REQUIREMENTS_TEMPLATE" ] || [ ! -f "$REQUIREMENTS_TEMPLATE" ]; then
            REQUIREMENTS_TEMPLATE=$(resolve_template "spec-template" "$REPO_ROOT") || true
        fi

        if [ -n "$REQUIREMENTS_TEMPLATE" ] && [ -f "$REQUIREMENTS_TEMPLATE" ]; then
            cp "$REQUIREMENTS_TEMPLATE" "$REQUIREMENTS_FILE"
        else
            echo "Warning: Requirements template not found; created empty requirements file" >&2
            touch "$REQUIREMENTS_FILE"
        fi
    fi

    if [ ! -f "$TASKLIST_FILE" ]; then
        TASKLIST_TEMPLATE=$(resolve_template "tasks-template" "$REPO_ROOT") || true
        if [ -n "$TASKLIST_TEMPLATE" ] && [ -f "$TASKLIST_TEMPLATE" ]; then
            cp "$TASKLIST_TEMPLATE" "$TASKLIST_FILE"
        else
            echo "Warning: Tasklist template not found; created empty tasklist file" >&2
            touch "$TASKLIST_FILE"
        fi
    fi

    write_feature_json "$REPO_ROOT/.specify/feature.json" "$BRANCH_NAME" "$BASE_BRANCH" "$REQUIREMENT_TYPE" "$FEATURE_DIR" "$REQUIREMENTS_FILE" "$PLAN_FILE" "$TASKLIST_FILE"

    printf '# To persist: export SPECIFY_FEATURE=%q\n' "$BRANCH_NAME" >&2
fi

if $JSON_MODE; then
    if command -v jq >/dev/null 2>&1; then
        jq -cn \
            --arg branch_name "$BRANCH_NAME" \
            --arg base_branch "$BASE_BRANCH" \
            --arg feature_type "$REQUIREMENT_TYPE" \
            --arg feature_dir "$FEATURE_DIR" \
            --arg requirements_file "$REQUIREMENTS_FILE" \
            --arg spec_file "$REQUIREMENTS_FILE" \
            --arg tasklist_file "$TASKLIST_FILE" \
            --arg tasks_file "$TASKLIST_FILE" \
            --arg plan_file "$PLAN_FILE" \
            --arg feature_num "$FEATURE_NUM" \
            --argjson dry_run "$([ "$DRY_RUN" = true ] && echo true || echo false)" \
            --argjson branch_only "$([ "$BRANCH_ONLY" = true ] && echo true || echo false)" \
            '{BRANCH_NAME:$branch_name,BASE_BRANCH:$base_branch,FEATURE_TYPE:$feature_type,FEATURE_DIR:$feature_dir,REQUIREMENTS_FILE:$requirements_file,SPEC_FILE:$spec_file,TASKLIST_FILE:$tasklist_file,TASKS_FILE:$tasks_file,PLAN_FILE:$plan_file,FEATURE_NUM:$feature_num,DRY_RUN:$dry_run,BRANCH_ONLY:$branch_only}'
    else
        printf '{"BRANCH_NAME":"%s","BASE_BRANCH":"%s","FEATURE_TYPE":"%s","FEATURE_DIR":"%s","REQUIREMENTS_FILE":"%s","SPEC_FILE":"%s","TASKLIST_FILE":"%s","TASKS_FILE":"%s","PLAN_FILE":"%s","FEATURE_NUM":"%s","DRY_RUN":%s,"BRANCH_ONLY":%s}\n' \
            "$(json_escape "$BRANCH_NAME")" \
            "$(json_escape "$BASE_BRANCH")" \
            "$(json_escape "$REQUIREMENT_TYPE")" \
            "$(json_escape "$FEATURE_DIR")" \
            "$(json_escape "$REQUIREMENTS_FILE")" \
            "$(json_escape "$REQUIREMENTS_FILE")" \
            "$(json_escape "$TASKLIST_FILE")" \
            "$(json_escape "$TASKLIST_FILE")" \
            "$(json_escape "$PLAN_FILE")" \
            "$(json_escape "$FEATURE_NUM")" \
            "$([ "$DRY_RUN" = true ] && echo true || echo false)" \
            "$([ "$BRANCH_ONLY" = true ] && echo true || echo false)"
    fi
else
    echo "BRANCH_NAME: $BRANCH_NAME"
    echo "BASE_BRANCH: $BASE_BRANCH"
    echo "FEATURE_TYPE: $REQUIREMENT_TYPE"
    echo "FEATURE_DIR: $FEATURE_DIR"
    echo "REQUIREMENTS_FILE: $REQUIREMENTS_FILE"
    echo "TASKLIST_FILE: $TASKLIST_FILE"
    echo "PLAN_FILE: $PLAN_FILE"
    if [ -n "$FEATURE_NUM" ]; then
        echo "FEATURE_NUM: $FEATURE_NUM"
    fi
fi