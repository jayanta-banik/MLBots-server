import { Alert, Box, Button, Chip, Collapse, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { formatEnumLabel } from './lorekraft_races_helpers.js';
import { ChevronToggleButton, SectionBlock } from './lorekraft_races_ui.jsx';

export default function LoreKraftRaceForm({
  addEvolution,
  addEvolutionCondition,
  addResistanceRow,
  addSkillRow,
  clearImageUpload,
  elementalResistanceCount,
  elementalResistanceKinds,
  formState,
  handleImageUpload,
  handleSubmit,
  imagePreviewUrl,
  isAddRaceOpen,
  isElementalResistanceOpen,
  isLoading,
  isSubmitting,
  loadError,
  options,
  removeEvolution,
  removeEvolutionCondition,
  removeResistanceRow,
  removeSkillRow,
  races,
  setCharacterTypes,
  setIsAddRaceOpen,
  setIsElementalResistanceOpen,
  standardResistanceKinds,
  standardResistances,
  updateAttribute,
  updateElementalAffinity,
  updateElementalResistance,
  updateEvolution,
  updateEvolutionCondition,
  updateResistanceRow,
  updateSkillRow,
  updateTextField,
  updateWeaponAffinity,
  skills,
}) {
  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <ChevronToggleButton isOpen={isAddRaceOpen} label="Toggle add race section" onClick={() => setIsAddRaceOpen((currentValue) => !currentValue)} />
          <Typography variant="h2" sx={{ fontSize: { xs: '1.6rem', md: '2rem' } }}>
            Add race
          </Typography>
        </Stack>
      </Stack>

      <Collapse in={isAddRaceOpen}>
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit} sx={{ pt: 0.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="flex-end">
            <Button type="submit" variant="contained" disabled={isSubmitting || isLoading || Boolean(loadError)} sx={{ borderRadius: 1.5 }}>
              {isSubmitting ? 'Saving race...' : 'Save race'}
            </Button>
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

                  setCharacterTypes(nextValue);
                }}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {selected.map((characterType) => (
                      <Chip key={characterType} label={formatEnumLabel(characterType)} size="small" color="secondary" variant="filled" />
                    ))}
                  </Box>
                )}
              >
                {options.characterTypes.map((characterType) => (
                  <MenuItem key={characterType} value={characterType} selected={formState.characterTypes.includes(characterType)}>
                    {formatEnumLabel(characterType)}
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
            description="Keep special-case resistances in the main list, and manage elemental resistances from a grouped sub-list."
            action={
              <Button variant="outlined" color="secondary" onClick={addResistanceRow}>
                Add resistance
              </Button>
            }
          >
            <Stack spacing={2}>
              <Stack spacing={1.25} sx={{ p: 2, borderRadius: 3, backgroundColor: (theme) => alpha(theme.palette.common.white, 0.45) }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
                  <Stack spacing={0.5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Elemental resistances
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      Group the elemental entries here instead of mixing them with the rest of the resistance list.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`${elementalResistanceCount} configured`} color="secondary" variant="outlined" size="small" />
                    <Button variant="text" color="secondary" onClick={() => setIsElementalResistanceOpen((currentValue) => !currentValue)}>
                      {isElementalResistanceOpen ? 'Hide elementals' : 'Show elementals'}
                    </Button>
                  </Stack>
                </Stack>
                <Collapse in={isElementalResistanceOpen}>
                  <Stack spacing={1.5} sx={{ pt: 1 }}>
                    {elementalResistanceKinds.map((kind) => {
                      const currentResistance = formState.resistances.find((resistance) => resistance.kind === kind);

                      return (
                        <Box key={kind} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '0.95fr 1fr 0.55fr' } }}>
                          <TextField label="Element" value={formatEnumLabel(kind.replace('ELEMENTAL_', ''))} InputProps={{ readOnly: true }} />
                          <TextField
                            label="Detail"
                            value={currentResistance?.detail ?? ''}
                            onChange={(event) => updateElementalResistance(kind, 'detail', event.target.value)}
                            placeholder="Optional note for this element"
                          />
                          <TextField
                            label="Amount"
                            type="number"
                            inputProps={{ step: '0.01' }}
                            value={currentResistance?.amount ?? ''}
                            onChange={(event) => updateElementalResistance(kind, 'amount', event.target.value)}
                            placeholder="0.50"
                          />
                        </Box>
                      );
                    })}
                  </Stack>
                </Collapse>
              </Stack>
              <Stack spacing={1.5}>
                {standardResistances.map((resistance) => (
                  <Box key={resistance.id} sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '0.8fr 1fr 0.55fr auto' } }}>
                    <TextField select label="Resistance type" value={resistance.kind} onChange={(event) => updateResistanceRow(resistance.id, 'kind', event.target.value)}>
                      {standardResistanceKinds.map((kind) => (
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
            </Stack>
          </SectionBlock>
        </Stack>
      </Collapse>
    </Stack>
  );
}
