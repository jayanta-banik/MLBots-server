import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Button, Chip, Container, Stack, Typography } from '@mui/material';

import SurfaceCard from '../components/surface_card.jsx';
import apiClient from '../utils/apiClient.js';
import LoreKraftRaceForm from './lorekraft_race_form.jsx';
import LoreKraftRaceRoster from './lorekraft_race_roster.jsx';
import {
  buildExpandedRaceIds,
  createEvolutionCondition,
  createEvolutionEntry,
  createInitialFormState,
  createResistanceRow,
  createRowId,
  isElementalResistanceKind,
  normalizeRaceRecord,
} from './lorekraft_races_helpers.js';

function LoreKraftRacesPage() {
  const navigate = useNavigate();
  const [races, setRaces] = useState([]);
  const [skills, setSkills] = useState([]);
  const [options, setOptions] = useState({
    attributeTypes: [],
    characterTypes: [],
    evolutionConditionTypes: [],
    magicElements: [],
    resistanceKinds: [],
  });
  const [formState, setFormState] = useState(() => createInitialFormState({ attributeTypes: [], magicElements: [] }));
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isElementalResistanceOpen, setIsElementalResistanceOpen] = useState(false);
  const [isAddRaceOpen, setIsAddRaceOpen] = useState(false);
  const [isRaceRosterOpen, setIsRaceRosterOpen] = useState(true);
  const [expandedRaceIds, setExpandedRaceIds] = useState([]);

  useEffect(() => {
    let isActive = true;

    async function loadPageData() {
      try {
        const [racesResponse, skillsResponse, characterTypesResponse, attributeTypesResponse, magicElementsResponse, resistanceKindsResponse, evolutionConditionTypesResponse] = await Promise.all([
          apiClient().get('/lorekraft/races'),
          apiClient().get('/lorekraft/skills'),
          apiClient().get('/enums/CharacterType'),
          apiClient().get('/enums/AttributeType'),
          apiClient().get('/enums/MagicElement'),
          apiClient().get('/enums/ResistanceType'),
          apiClient().get('/enums/EvolutionConditionType'),
        ]);

        if (!isActive) return;

        const nextOptions = {
          attributeTypes: attributeTypesResponse.data.AttributeType ?? [],
          characterTypes: characterTypesResponse.data.CharacterType ?? [],
          evolutionConditionTypes: evolutionConditionTypesResponse.data.EvolutionConditionType ?? [],
          magicElements: magicElementsResponse.data.MagicElement ?? [],
          resistanceKinds: resistanceKindsResponse.data.ResistanceType ?? [],
        };

        const nextRaces = (racesResponse.data.races ?? []).map(normalizeRaceRecord);

        setOptions(nextOptions);
        setRaces(nextRaces);
        setExpandedRaceIds(buildExpandedRaceIds(nextRaces));
        setSkills(skillsResponse.data.skills ?? []);
        setFormState(createInitialFormState(nextOptions));
      } catch (error) {
        if (!isActive) return;

        setLoadError(error.response?.data?.message || 'Race admin data could not be loaded.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadPageData();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!formState.imageFile || !imagePreviewUrl) return undefined;

    const currentPreviewUrl = imagePreviewUrl;

    return () => {
      URL.revokeObjectURL(currentPreviewUrl);
    };
  }, [formState.imageFile, imagePreviewUrl]);

  function setField(fieldName, value) {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  }

  function updateTextField(fieldName) {
    return (event) => {
      setField(fieldName, event.target.value);
    };
  }

  function setCharacterTypes(characterTypes) {
    setField('characterTypes', characterTypes);
  }

  function handleImageUpload(event) {
    const nextFile = event.target.files?.[0] ?? null;
    const nextPreviewUrl = nextFile ? URL.createObjectURL(nextFile) : '';

    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setFormState((currentState) => ({
      ...currentState,
      imageFile: nextFile,
      imageFileName: nextFile?.name ?? '',
      imageUrl: '',
    }));
    setImagePreviewUrl(nextPreviewUrl);

    event.target.value = '';
  }

  function clearImageUpload() {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setFormState((currentState) => ({
      ...currentState,
      imageFile: null,
      imageFileName: '',
      imageUrl: '',
    }));
    setImagePreviewUrl('');
  }

  function updateAttribute(attributeType, value) {
    setFormState((currentState) => ({
      ...currentState,
      attributes: {
        ...currentState.attributes,
        [attributeType]: value,
      },
    }));
  }

  function updateElementalAffinity(element, value) {
    setFormState((currentState) => ({
      ...currentState,
      affinities: {
        ...currentState.affinities,
        elemental: {
          ...currentState.affinities.elemental,
          [element]: value,
        },
      },
    }));
  }

  function updateWeaponAffinity(value) {
    setFormState((currentState) => ({
      ...currentState,
      affinities: {
        ...currentState.affinities,
        weapon: value,
      },
    }));
  }

  function addEvolution() {
    setFormState((currentState) => ({
      ...currentState,
      evolutions: [...currentState.evolutions, createEvolutionEntry()],
    }));
  }

  function removeEvolution(evolutionId) {
    setFormState((currentState) => ({
      ...currentState,
      evolutions: currentState.evolutions.filter((evolution) => evolution.id !== evolutionId),
    }));
  }

  function updateEvolution(evolutionId, fieldName, value) {
    setFormState((currentState) => ({
      ...currentState,
      evolutions: currentState.evolutions.map((evolution) => (evolution.id === evolutionId ? { ...evolution, [fieldName]: value } : evolution)),
    }));
  }

  function addEvolutionCondition(evolutionId) {
    setFormState((currentState) => ({
      ...currentState,
      evolutions: currentState.evolutions.map((evolution) => (evolution.id === evolutionId ? { ...evolution, conditions: [...evolution.conditions, createEvolutionCondition()] } : evolution)),
    }));
  }

  function removeEvolutionCondition(evolutionId, conditionId) {
    setFormState((currentState) => ({
      ...currentState,
      evolutions: currentState.evolutions.map((evolution) => {
        if (evolution.id !== evolutionId) return evolution;

        const remainingConditions = evolution.conditions.filter((condition) => condition.id !== conditionId);

        return {
          ...evolution,
          conditions: remainingConditions.length ? remainingConditions : [createEvolutionCondition()],
        };
      }),
    }));
  }

  function updateEvolutionCondition(evolutionId, conditionId, fieldName, value) {
    setFormState((currentState) => ({
      ...currentState,
      evolutions: currentState.evolutions.map((evolution) => {
        if (evolution.id !== evolutionId) return evolution;

        return {
          ...evolution,
          conditions: evolution.conditions.map((condition) => (condition.id === conditionId ? { ...condition, [fieldName]: value } : condition)),
        };
      }),
    }));
  }

  function addSkillRow() {
    setFormState((currentState) => ({
      ...currentState,
      skills: [...currentState.skills, { id: createRowId('skill'), skillId: '', cooldownTime: '', cooldownTurns: '' }],
    }));
  }

  function removeSkillRow(skillRowId) {
    setFormState((currentState) => {
      const nextSkills = currentState.skills.filter((skill) => skill.id !== skillRowId);

      return {
        ...currentState,
        skills: nextSkills.length ? nextSkills : [{ id: createRowId('skill'), skillId: '', cooldownTime: '', cooldownTurns: '' }],
      };
    });
  }

  function updateSkillRow(skillRowId, fieldName, value) {
    setFormState((currentState) => ({
      ...currentState,
      skills: currentState.skills.map((skillRow) => {
        if (skillRow.id !== skillRowId) return skillRow;

        if (fieldName !== 'skillId') {
          return { ...skillRow, [fieldName]: value };
        }

        const selectedSkill = skills.find((skill) => String(skill.id) === String(value));

        return {
          ...skillRow,
          skillId: value,
          cooldownTime: selectedSkill ? String(selectedSkill.cooldownTime ?? '') : '',
          cooldownTurns: selectedSkill ? String(selectedSkill.cooldownTurns ?? '') : '',
        };
      }),
    }));
  }

  function addResistanceRow() {
    setFormState((currentState) => ({
      ...currentState,
      resistances: [...currentState.resistances, createResistanceRow()],
    }));
  }

  function removeResistanceRow(resistanceId) {
    setFormState((currentState) => {
      const nextResistances = currentState.resistances.filter((resistance) => resistance.id !== resistanceId);

      return {
        ...currentState,
        resistances: nextResistances.length ? nextResistances : [createResistanceRow()],
      };
    });
  }

  function updateResistanceRow(resistanceId, fieldName, value) {
    setFormState((currentState) => ({
      ...currentState,
      resistances: currentState.resistances.map((resistance) => (resistance.id === resistanceId ? { ...resistance, [fieldName]: value } : resistance)),
    }));
  }

  function updateElementalResistance(kind, fieldName, value) {
    setFormState((currentState) => {
      const resistanceIndex = currentState.resistances.findIndex((resistance) => resistance.kind === kind);

      if (resistanceIndex === -1) {
        const nextResistance = createResistanceRow({ kind, amount: '', [fieldName]: value });
        const hasValues = Boolean(nextResistance.detail.trim() || String(nextResistance.amount ?? '').trim());

        if (!hasValues) {
          return currentState;
        }

        return {
          ...currentState,
          resistances: [...currentState.resistances, nextResistance],
        };
      }

      const nextResistances = [...currentState.resistances];
      const nextResistance = {
        ...nextResistances[resistanceIndex],
        [fieldName]: value,
      };
      const hasValues = Boolean(nextResistance.detail.trim() || String(nextResistance.amount ?? '').trim());

      if (!hasValues) {
        nextResistances.splice(resistanceIndex, 1);

        return {
          ...currentState,
          resistances: nextResistances.length ? nextResistances : [createResistanceRow()],
        };
      }

      nextResistances[resistanceIndex] = nextResistance;

      return {
        ...currentState,
        resistances: nextResistances,
      };
    });
  }

  function buildSubmitPayload() {
    return {
      name: formState.name,
      imageUrl: '',
      description: formState.description,
      characterTypes: formState.characterTypes,
      attributes: formState.attributes,
      affinities: formState.affinities,
      evolutions: formState.evolutions.map((evolution) => ({
        fromRaceId: evolution.fromRaceId,
        conditions: evolution.conditions.map((condition) => ({
          conditionType: condition.conditionType,
          conditionValue: condition.conditionValue,
        })),
      })),
      skills: formState.skills.map((skill) => ({
        skillId: skill.skillId,
        cooldownTime: skill.cooldownTime,
        cooldownTurns: skill.cooldownTurns,
      })),
      resistances: formState.resistances.map((resistance) => ({
        kind: resistance.kind,
        detail: resistance.detail,
        amount: resistance.amount,
      })),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    if (!formState.name.trim()) {
      setSubmitError('Race name is required.');
      return;
    }

    if (!formState.characterTypes.length) {
      setSubmitError('Select at least one character type.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient().post('/lorekraft/admin/races', buildSubmitPayload());
      const nextRace = normalizeRaceRecord(response.data.race);

      setRaces((currentRaces) => [nextRace, ...currentRaces]);
      setExpandedRaceIds((currentIds) => [nextRace.id, ...currentIds.filter((raceId) => raceId !== nextRace.id)]);
      setIsAddRaceOpen(false);
      setIsRaceRosterOpen(true);
      setFormState(createInitialFormState(options));
      setSuccessMessage(`Race ${nextRace.name} added.`);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Race could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const elementalResistanceKinds = options.resistanceKinds.filter(isElementalResistanceKind);
  const standardResistanceKinds = options.resistanceKinds.filter((kind) => !isElementalResistanceKind(kind));
  const standardResistances = formState.resistances.filter((resistance) => !isElementalResistanceKind(resistance.kind));
  const elementalResistanceCount = formState.resistances.filter((resistance) => isElementalResistanceKind(resistance.kind)).length;

  function toggleRaceCard(raceId) {
    setExpandedRaceIds((currentIds) => (currentIds.includes(raceId) ? currentIds.filter((currentId) => currentId !== raceId) : [...currentIds, raceId]));
  }

  function expandAllRaceCards() {
    setExpandedRaceIds(buildExpandedRaceIds(races));
  }

  function collapseAllRaceCards() {
    setExpandedRaceIds([]);
  }

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Chip label="Races" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
              <Button variant="text" color="secondary" onClick={() => navigate('/lorekraft/admin')}>
                Back to admin
              </Button>
            </Stack>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '4rem' }, overflowWrap: 'anywhere' }}>
              LoreKraft Race Forge
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '68ch', lineHeight: 1.8 }}>
              Create race records with their image, evolution rules, attribute profile, affinities, skills, and resistances from one admin surface.
            </Typography>
            {loadError ? <Alert severity="error">{loadError}</Alert> : null}
            {submitError ? <Alert severity="error">{submitError}</Alert> : null}
            {successMessage ? <Alert severity="success">{successMessage}</Alert> : null}
          </Stack>
        </SurfaceCard>

        <SurfaceCard tone="primary" delay={0.08}>
          <LoreKraftRaceForm
            addEvolution={addEvolution}
            addEvolutionCondition={addEvolutionCondition}
            addResistanceRow={addResistanceRow}
            addSkillRow={addSkillRow}
            clearImageUpload={clearImageUpload}
            elementalResistanceCount={elementalResistanceCount}
            elementalResistanceKinds={elementalResistanceKinds}
            formState={formState}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            imagePreviewUrl={imagePreviewUrl}
            isAddRaceOpen={isAddRaceOpen}
            isElementalResistanceOpen={isElementalResistanceOpen}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            loadError={loadError}
            options={options}
            races={races}
            removeEvolution={removeEvolution}
            removeEvolutionCondition={removeEvolutionCondition}
            removeResistanceRow={removeResistanceRow}
            removeSkillRow={removeSkillRow}
            setCharacterTypes={setCharacterTypes}
            setIsAddRaceOpen={setIsAddRaceOpen}
            setIsElementalResistanceOpen={setIsElementalResistanceOpen}
            standardResistanceKinds={standardResistanceKinds}
            standardResistances={standardResistances}
            updateAttribute={updateAttribute}
            updateElementalAffinity={updateElementalAffinity}
            updateElementalResistance={updateElementalResistance}
            updateEvolution={updateEvolution}
            updateEvolutionCondition={updateEvolutionCondition}
            updateResistanceRow={updateResistanceRow}
            updateSkillRow={updateSkillRow}
            updateTextField={updateTextField}
            updateWeaponAffinity={updateWeaponAffinity}
            skills={skills}
          />
        </SurfaceCard>

        <SurfaceCard tone="secondary" delay={0.14}>
          <LoreKraftRaceRoster
            expandedRaceIds={expandedRaceIds}
            isLoading={isLoading}
            isRaceRosterOpen={isRaceRosterOpen}
            onCollapseAllRaceCards={collapseAllRaceCards}
            onExpandAllRaceCards={expandAllRaceCards}
            onSetIsRaceRosterOpen={setIsRaceRosterOpen}
            onToggleRaceCard={toggleRaceCard}
            races={races}
          />
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default LoreKraftRacesPage;
