import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, Box, Button, Checkbox, Chip, Container, Divider, FormControl, InputLabel, ListItemText, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import SurfaceCard from '../components/surface_card.jsx';
import apiClient from '../utils/apiClient.js';

function createRowId(prefix) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatEnumLabel(value) {
  return value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function createInitialFormState({ attributeTypes, magicElements }) {
  return {
    name: '',
    imageUrl: '',
    imageFile: null,
    imageFileName: '',
    description: '',
    characterTypes: [],
    attributes: Object.fromEntries(attributeTypes.map((attributeType) => [attributeType, '0'])),
    affinities: {
      elemental: Object.fromEntries(magicElements.map((element) => [element, '0'])),
      weapon: '',
    },
    evolutions: [],
    skills: [{ id: createRowId('skill'), skillId: '', cooldownTime: '', cooldownTurns: '' }],
    resistances: [{ id: createRowId('resistance'), kind: '', detail: '', amount: '0.5' }],
  };
}

function createEvolutionCondition() {
  return {
    id: createRowId('condition'),
    conditionType: '',
    conditionValue: '',
  };
}

function createEvolutionEntry() {
  return {
    id: createRowId('evolution'),
    fromRaceId: '',
    conditions: [createEvolutionCondition()],
  };
}

function SectionBlock({ action, children, description, title }) {
  return (
    <Stack
      spacing={2}
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 4,
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.66),
      }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Stack spacing={0.75}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.2rem', md: '1.35rem' } }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {description}
            </Typography>
          ) : null}
        </Stack>
        {action}
      </Stack>
      {children}
    </Stack>
  );
}

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
          apiClient().get('/enums/ResistanceKind'),
          apiClient().get('/enums/evolution_condition_type'),
        ]);

        if (!isActive) return;

        const nextOptions = {
          attributeTypes: attributeTypesResponse.data.AttributeType ?? [],
          characterTypes: characterTypesResponse.data.CharacterType ?? [],
          evolutionConditionTypes: evolutionConditionTypesResponse.data.evolution_condition_type ?? [],
          magicElements: magicElementsResponse.data.MagicElement ?? [],
          resistanceKinds: resistanceKindsResponse.data.ResistanceKind ?? [],
        };

        setOptions(nextOptions);
        setRaces(racesResponse.data.races ?? []);
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
    if (!formState.imageFile) {
      setImagePreviewUrl('');
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(formState.imageFile);

    setImagePreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [formState.imageFile]);

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

  function handleImageUpload(event) {
    const nextFile = event.target.files?.[0] ?? null;

    setFormState((currentState) => ({
      ...currentState,
      imageFile: nextFile,
      imageFileName: nextFile?.name ?? '',
      imageUrl: '',
    }));

    event.target.value = '';
  }

  function clearImageUpload() {
    setFormState((currentState) => ({
      ...currentState,
      imageFile: null,
      imageFileName: '',
      imageUrl: '',
    }));
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
      resistances: [...currentState.resistances, { id: createRowId('resistance'), kind: '', detail: '', amount: '0.5' }],
    }));
  }

  function removeResistanceRow(resistanceId) {
    setFormState((currentState) => {
      const nextResistances = currentState.resistances.filter((resistance) => resistance.id !== resistanceId);

      return {
        ...currentState,
        resistances: nextResistances.length ? nextResistances : [{ id: createRowId('resistance'), kind: '', detail: '', amount: '0.5' }],
      };
    });
  }

  function updateResistanceRow(resistanceId, fieldName, value) {
    setFormState((currentState) => ({
      ...currentState,
      resistances: currentState.resistances.map((resistance) => (resistance.id === resistanceId ? { ...resistance, [fieldName]: value } : resistance)),
    }));
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

      setRaces((currentRaces) => [response.data.race, ...currentRaces]);
      setFormState(createInitialFormState(options));
      setSuccessMessage(`Race ${response.data.race.name} added.`);
    } catch (error) {
      setSubmitError(error.response?.data?.message || 'Race could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Container component={motion.div} layout maxWidth={false} disableGutters sx={{ width: '100%', px: { xs: 2, md: 3 }, py: { xs: 3, md: 5 }, overflowX: 'clip' }}>
      <Stack component={motion.div} layout spacing={3}>
        <SurfaceCard tone="secondary" delay={0.02}>
          <Stack spacing={2}>
            <Chip label="Races" color="secondary" variant="outlined" sx={{ alignSelf: 'flex-start' }} />
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
          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Stack spacing={0.75}>
                <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
                  Add race
                </Typography>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                <Button variant="text" color="secondary" onClick={() => navigate('/lorekraft/admin')}>
                  Back to admin
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting || isLoading || Boolean(loadError)} sx={{ borderRadius: 1.5 }}>
                  {isSubmitting ? 'Saving race...' : 'Save race'}
                </Button>
              </Stack>
            </Stack>

            <SectionBlock title="Identity" description="">
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1.1fr 0.9fr' } }}>
                <Stack spacing={2}>
                  <TextField label="Name" value={formState.name} onChange={updateTextField('name')} required />
                  <Stack
                    spacing={1.25}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      border: (theme) => `1px dashed ${alpha(theme.palette.secondary.main, 0.28)}`,
                      backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.54),
                    }}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">Image upload</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                          Choose an image file for local preview. This stays frontend-only for now and is not uploaded when you save.
                        </Typography>
                      </Stack>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Button component="label" variant="outlined" color="secondary" sx={{ borderRadius: 1.5 }}>
                          Choose file
                          <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                        </Button>
                        {formState.imageFile ? (
                          <Button variant="text" color="secondary" onClick={clearImageUpload} sx={{ borderRadius: 1.5 }}>
                            Remove
                          </Button>
                        ) : null}
                      </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {formState.imageFileName || 'No file selected.'}
                    </Typography>
                  </Stack>
                  <TextField label="Description" value={formState.description} onChange={updateTextField('description')} multiline minRows={4} />
                </Stack>
                <Box
                  sx={{
                    minHeight: 220,
                    borderRadius: 4,
                    overflow: 'hidden',
                    border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.14)}`,
                    background: imagePreviewUrl
                      ? `linear-gradient(180deg, rgba(23,37,61,0.04), rgba(23,37,61,0.22)), url(${imagePreviewUrl}) center/cover`
                      : 'linear-gradient(135deg, rgba(30,58,47,0.12), rgba(23,37,61,0.18))',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 2,
                  }}
                >
                  <Stack spacing={0.5} sx={{ color: imagePreviewUrl ? '#f7f4ec' : 'text.primary' }}>
                    <Typography variant="overline">Preview</Typography>
                    <Typography variant="h3">{formState.name || 'New race'}</Typography>
                    <Typography variant="body2" sx={{ maxWidth: '30ch', opacity: 0.88 }}>
                      {formState.description || 'Choose an image file to preview the current race artwork here.'}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </SectionBlock>

            <SectionBlock title="Character Type" description="A race can be exposed to more than one character type.">
              <FormControl required disabled={!options.characterTypes.length}>
                <InputLabel id="race-character-types-label">Character types</InputLabel>
                <Select
                  labelId="race-character-types-label"
                  multiple
                  label="Character types"
                  value={formState.characterTypes}
                  onChange={(event) => {
                    const nextValue = typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value;

                    setField('characterTypes', nextValue);
                  }}
                  renderValue={(selected) => selected.map(formatEnumLabel).join(', ')}
                >
                  {options.characterTypes.map((characterType) => (
                    <MenuItem key={characterType} value={characterType}>
                      <Checkbox checked={formState.characterTypes.includes(characterType)} />
                      <ListItemText primary={formatEnumLabel(characterType)} />
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, px: 1.75, lineHeight: 1.7 }}>
                  Select the character categories that can use this race.
                </Typography>
              </FormControl>
            </SectionBlock>

            <SectionBlock
              title="Evolution"
              description="Link the new race to any source race and record the required conditions for that evolution path."
              action={
                <Button variant="outlined" color="secondary" onClick={addEvolution} disabled={!races.length}>
                  Add evolution
                </Button>
              }
            >
              {!races.length ? <Alert severity="warning">Add at least one base race before defining an evolution path.</Alert> : null}
              {!formState.evolutions.length ? <Typography color="text.secondary">No evolution rules yet.</Typography> : null}
              <Stack spacing={2}>
                {formState.evolutions.map((evolution) => (
                  <Stack key={evolution.id} spacing={2} sx={{ p: 2, borderRadius: 3, backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45) }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Evolution path
                      </Typography>
                      <Button variant="text" color="secondary" onClick={() => removeEvolution(evolution.id)}>
                        Remove
                      </Button>
                    </Stack>
                    <TextField select label="From" value={evolution.fromRaceId} onChange={(event) => updateEvolution(evolution.id, 'fromRaceId', event.target.value)}>
                      {races.map((race) => (
                        <MenuItem key={race.id} value={String(race.id)}>
                          {race.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Divider flexItem />
                    <Stack spacing={1.5}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Required conditions
                        </Typography>
                        <Button variant="outlined" color="secondary" onClick={() => addEvolutionCondition(evolution.id)}>
                          Add condition
                        </Button>
                      </Stack>
                      {evolution.conditions.map((condition) => (
                        <Box key={condition.id} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '0.75fr 1fr auto' } }}>
                          <TextField
                            select
                            label="Condition type"
                            value={condition.conditionType}
                            onChange={(event) => updateEvolutionCondition(evolution.id, condition.id, 'conditionType', event.target.value)}
                          >
                            {options.evolutionConditionTypes.map((conditionType) => (
                              <MenuItem key={conditionType} value={conditionType}>
                                {formatEnumLabel(conditionType)}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            label="Condition value"
                            value={condition.conditionValue}
                            onChange={(event) => updateEvolutionCondition(evolution.id, condition.id, 'conditionValue', event.target.value)}
                            placeholder="Level 20, quest complete, artifact name..."
                          />
                          <Button variant="text" color="secondary" onClick={() => removeEvolutionCondition(evolution.id, condition.id)}>
                            Remove
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </SectionBlock>

            <SectionBlock title="Attributes" description="Set the race baseline using the current AttributeType enum list.">
              <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}>
                {options.attributeTypes.map((attributeType) => (
                  <TextField
                    key={attributeType}
                    label={formatEnumLabel(attributeType)}
                    type="number"
                    inputProps={{ step: '1' }}
                    value={formState.attributes[attributeType] ?? '0'}
                    onChange={(event) => updateAttribute(attributeType, event.target.value)}
                  />
                ))}
              </Box>
            </SectionBlock>

            <SectionBlock title="Affinity" description="Elemental affinities default to zero, and weapon affinity remains a free-form target.">
              <Stack spacing={2}>
                <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(5, minmax(0, 1fr))' } }}>
                  {options.magicElements.map((element) => (
                    <TextField
                      key={element}
                      label={formatEnumLabel(element)}
                      type="number"
                      inputProps={{ step: '0.01' }}
                      value={formState.affinities.elemental[element] ?? '0'}
                      onChange={(event) => updateElementalAffinity(element, event.target.value)}
                    />
                  ))}
                </Box>
                <TextField label="Weapon affinity" value={formState.affinities.weapon} onChange={(event) => updateWeaponAffinity(event.target.value)} placeholder="Blade, bow, gauntlet, staff..." />
              </Stack>
            </SectionBlock>

            <SectionBlock
              title="Skills"
              description="Attach skills from the skills table and override cooldown values when needed."
              action={
                <Button variant="outlined" color="secondary" onClick={addSkillRow} disabled={!skills.length}>
                  Add skill
                </Button>
              }
            >
              {!skills.length ? <Alert severity="warning">No skills are available yet in the skill catalog.</Alert> : null}
              <Stack spacing={1.5}>
                {formState.skills.map((skillRow) => (
                  <Box key={skillRow.id} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1.25fr 0.6fr 0.6fr auto' } }}>
                    <TextField select label="Skill" value={skillRow.skillId} onChange={(event) => updateSkillRow(skillRow.id, 'skillId', event.target.value)} disabled={!skills.length}>
                      {skills.map((skill) => (
                        <MenuItem key={skill.id} value={String(skill.id)}>
                          {skill.name} · {formatEnumLabel(skill.abilityType)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Cooldown time"
                      type="number"
                      inputProps={{ step: '1' }}
                      value={skillRow.cooldownTime}
                      onChange={(event) => updateSkillRow(skillRow.id, 'cooldownTime', event.target.value)}
                    />
                    <TextField
                      label="Cooldown turns"
                      type="number"
                      inputProps={{ step: '1' }}
                      value={skillRow.cooldownTurns}
                      onChange={(event) => updateSkillRow(skillRow.id, 'cooldownTurns', event.target.value)}
                    />
                    <Button variant="text" color="secondary" onClick={() => removeSkillRow(skillRow.id)}>
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            </SectionBlock>

            <SectionBlock
              title="Resistance"
              description="Add one or more resistance rows with the current enum type, an optional detail, and the amount."
              action={
                <Button variant="outlined" color="secondary" onClick={addResistanceRow}>
                  Add resistance
                </Button>
              }
            >
              <Stack spacing={1.5}>
                {formState.resistances.map((resistance) => (
                  <Box key={resistance.id} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '0.8fr 1fr 0.55fr auto' } }}>
                    <TextField select label="Resistance type" value={resistance.kind} onChange={(event) => updateResistanceRow(resistance.id, 'kind', event.target.value)}>
                      {options.resistanceKinds.map((kind) => (
                        <MenuItem key={kind} value={kind}>
                          {formatEnumLabel(kind)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Detail"
                      value={resistance.detail}
                      onChange={(event) => updateResistanceRow(resistance.id, 'detail', event.target.value)}
                      placeholder="Fire, holy, blunt, poison..."
                    />
                    <TextField
                      label="Amount"
                      type="number"
                      inputProps={{ step: '0.01' }}
                      value={resistance.amount}
                      onChange={(event) => updateResistanceRow(resistance.id, 'amount', event.target.value)}
                    />
                    <Button variant="text" color="secondary" onClick={() => removeResistanceRow(resistance.id)}>
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            </SectionBlock>
          </Stack>
        </SurfaceCard>

        <SurfaceCard tone="secondary" delay={0.14}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
                Race roster
              </Typography>
              <Chip label={`${races.length} ${races.length === 1 ? 'race' : 'races'}`} color="secondary" variant="outlined" />
            </Stack>
            {isLoading ? <Typography color="text.secondary">Loading races...</Typography> : null}
            {!isLoading && !races.length ? <Typography color="text.secondary">No races yet. Add the first one above.</Typography> : null}
            <Stack spacing={1.5}>
              {races.map((race, index) => (
                <SurfaceCard key={race.id} tone={index % 2 === 0 ? 'primary' : 'secondary'} delay={0.18 + index * 0.03}>
                  <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '180px minmax(0, 1fr)' } }}>
                    <Box
                      sx={{
                        minHeight: 160,
                        borderRadius: 3,
                        border: (theme) => `1px solid ${alpha(theme.palette.secondary.main, 0.12)}`,
                        background: race.imageUrl
                          ? `linear-gradient(180deg, rgba(23,37,61,0.06), rgba(23,37,61,0.18)), url(${race.imageUrl}) center/cover`
                          : 'linear-gradient(145deg, rgba(30,58,47,0.12), rgba(23,37,61,0.16))',
                      }}
                    />
                    <Stack spacing={1.25}>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {race.characterTypes.map((characterType) => (
                          <Chip key={`${race.id}-${characterType}`} label={formatEnumLabel(characterType)} color={index % 2 === 0 ? 'primary' : 'secondary'} variant="outlined" />
                        ))}
                      </Stack>
                      <Typography variant="h3" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                        {race.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {race.description || 'No description yet.'}
                      </Typography>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}>
                        <Typography variant="body2" color="text.secondary">
                          Linked players: {race.playerCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Skills: {race.skills.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Resistances: {race.resistances.length}
                        </Typography>
                      </Stack>
                      {race.evolutions.length ? (
                        <Stack spacing={0.75}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Evolution from
                          </Typography>
                          {race.evolutions.map((evolution) => (
                            <Typography key={evolution.id} variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                              {evolution.fromRaceName || 'Unknown race'}:{' '}
                              {evolution.conditions.map((condition) => `${formatEnumLabel(condition.conditionType)} ${condition.conditionValue}`).join(', ')}
                            </Typography>
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </Box>
                </SurfaceCard>
              ))}
            </Stack>
          </Stack>
        </SurfaceCard>
      </Stack>
    </Container>
  );
}

export default LoreKraftRacesPage;
