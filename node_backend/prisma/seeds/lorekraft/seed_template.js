const templateJson = {
  name: '',
  description: '',
  characterType: [],
  attributes: {
    strength: 0.0, // between 0 - 100
    agility: 0.0, // between 0 - 100
    physicalDefense: 0.0, // between 0 - 100
    magicalDefense: 0.0, // between 0 - 100
    mana: 0.0, // between 0 - 100
    intelligence: 0.0, // between 0 - 100
    courage: 0.0, // between 0 - 100
    patience: 0.0, // between 0 - 100
    ego: 0.0, // between 0 - 100
    pride: 0.0, // between 0 - 100
  },
  evolution: null,
  affinity: [
    {
      affinityType: '', // AffinityType enum
      affinityTarget: '', // MagicElement if AffinityType = ELEMENTAL else name of WEAPON, SPELL, or SKILL
      detail: '', // why affinity, mostly 1-3 lines of lore
      value: 0.0, // between 0 - 100
    },
  ],
  skills: [
    {
      name: '',
      description: '',
      abilityType: '', // AbilityType enum
      cooldownTime: 0,
      cooldownTurns: 0,
    },
  ],
  resistance: [
    {
      resistanceKind: '', // ResistanceKind enum
      detail: '', // why resistance, mostly 1-3 lines of lore
      amount: 0.0, // between 0 - 100
    },
  ],
  weaknesses: [
    {
      type: '',
      description: '',
      amount: 0.0,
    },
  ],
};

const CharacterType = ['PLAYER', 'ENEMY', 'BOSS', 'NPC', 'FAMILIAR', 'SUPPORT_CHARACTER'];
const EvolutionConditionType = ['LEVEL', 'ITEM', 'AFFINITY', 'ATTRIBUTE', 'TIME_OF_DAY'];
const AbilityType = ['REGULAR', 'HEAVY', 'UNIQUE', 'PASSIVE'];
const AttributeType = ['STRENGTH', 'AGILITY', 'PHYSICAL_DEFENSE', 'MAGICAL_DEFENSE', 'MANA', 'INTELLIGENCE', 'COURAGE'];
const AffinityType = [
  'ELEMENTAL', // player or race has an affinity for a specific magic element, e.g. "Fire" or "Water"
  'WEAPON', // player or race has an affinity for a specific weapon type, e.g. "Swords" or "Bows"
  'SPELL', // player has an affinity for a specific spell or spell type, e.g. "Fireball" or "Healing Spells"
  'SKILL', // player has an affinity for a specific skill or skill type, e.g. "Stealth" or "Swordsmanship"
];
const MagicElement = ['FIRE', 'WATER', 'AIR', 'EARTH', 'AETHER', 'LIGHT', 'DARK'];
const ResistanceType = [
  'POISON',
  'STATUS_EFFECT', // charm, fear, sleep, etc. any debff
  'ELEMENTAL_FIRE',
  'ELEMENTAL_WATER',
  'ELEMENTAL_AIR',
  'ELEMENTAL_EARTH',
  'ELEMENTAL_AETHER',
  'ELEMENTAL_LIGHT',
  'ELEMENTAL_DARK',
  'PHYSICAL', // bludgeoning, slashing, piercing
  'NECROTIC',
  'RADIANT', // mind control
  'LEVEL_NULL', // immunity to level-drain / nullification effects
];

(CharacterType, EvolutionConditionType, AbilityType, AttributeType, AffinityType, MagicElement, ResistanceType);

// clone template
const template = JSON.parse(JSON.stringify(templateJson));

template['name'] = ''; // TODO: name
template['description'] = ''; // TODO: description
template['characterType'] = []; // TODO: [CharacterType[0], CharacterType[1]];
template['attributes'] = {
  strength: 0, // TODO
  agility: 0, // TODO
  physicalDefense: 0, // TODO
  magicalDefense: 0, // TODO
  mana: 0, // TODO
  intelligence: 0, // TODO
  courage: 0, // TODO
  patience: 0, // TODO
  ego: 0, // TODO
  pride: 0, // TODO
};
template['affinity'] = [
  // Affinity is either for our type of weapon or one of the MagicElements.
  {
    affinityType: null, // TODO AffinityType[0]
    affinityTarget: '', // TODO
    detail: '', // TODO
    value: 0, // TODO
  },
  {
    affinityType: null, // TODO AffinityType[0]
    affinityTarget: '', // TODO
    detail: '', // TODO
    value: 0, // TODO
  },
  {
    affinityType: null, // TODO AffinityType[0]
    affinityTarget: '', // TODO
    detail: '', // TODO
    value: 0, // TODO
  },
];

template['skills'] = [
  {
    name: '', // TODO
    description: '', // TODO
    cooldownTime: 0, // TODO
    cooldownTurns: 0, // TODO
    abilityType: null, // TODO abilityType: AbilityType[0]
  },
  {
    name: '', // TODO
    description: '', // TODO
    cooldownTime: 0, // TODO
    cooldownTurns: 0, // TODO
    abilityType: null, // TODO abilityType: AbilityType[0]
  },
  {
    name: '', // TODO
    description: '', // TODO
    cooldownTime: 0, // TODO
    cooldownTurns: 0, // TODO
    abilityType: null, // TODO abilityType: AbilityType[0]
  },
  {
    name: '', // TODO
    description: '', // TODO
    cooldownTime: 0, // TODO
    cooldownTurns: 0, // TODO
    abilityType: null, // TODO abilityType: AbilityType[0]
  },
];
template['resistance'] = [
  {
    resistanceKind: ResistanceType[1],
    detail: 'Noble upbringing and ancestral willpower provide resistance to charm, fear, and similar status effects.',
    amount: 50.0,
  },
];
template['weaknesses'] = [
  {
    type: '', // TODO
    description: '', // TODO Folklore about why this is a weakness.
    amount: 0.0, // TODO
  },
  {
    type: '', // TODO
    description: '', // TODO Folklore about why this is a weakness.
    amount: 0.0, // TODO
  },
  {
    type: '', // TODO
    description: '', // TODO Folklore about why this is a weakness.
    amount: 0.0, // TODO
  },
];
