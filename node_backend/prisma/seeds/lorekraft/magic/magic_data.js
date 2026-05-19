import Prisma from '@prisma/client';

const { FIRE, WATER, AIR, EARTH, AETHER, LIGHT, DARK } = Prisma.MagicElement;
// const spellAttributesTypes = ['OFFENSIVE', 'DEFENSIVE', 'UTILITY'];

console.log('Magic attributes data prepared for seeding.', FIRE, WATER, AIR, EARTH, AETHER, LIGHT, DARK);

export const MagicAttributes = [
  // Basic 7
  { name: 'Fire', is_base_element: true, base_element: FIRE, components: [] },
  { name: 'Water', is_base_element: true, base_element: WATER, components: [] },
  { name: 'Air', is_base_element: true, base_element: AIR, components: [] },
  { name: 'Earth', is_base_element: true, base_element: EARTH, components: [] },
  { name: 'Aether', is_base_element: true, base_element: AETHER, components: [] },
  { name: 'Light', is_base_element: true, base_element: LIGHT, components: [] },
  { name: 'Dark', is_base_element: true, base_element: DARK, components: [] },

  // 1 element combinations
  { name: 'Arcane', base_element: AETHER, components: [AETHER] },

  // 2 element combinations
  { name: 'Crystal', base_element: AETHER, components: [EARTH, AETHER] },
  { name: 'Ice', base_element: WATER, components: [WATER, AIR] },
  { name: 'Lightning', base_element: FIRE, components: [FIRE, AIR] },
  { name: 'Metal', base_element: EARTH, components: [FIRE, EARTH] },
  { name: 'Gravity', base_element: AETHER, components: [EARTH, AETHER] },

  // 2 element combinations with light or dark
  { name: 'Healing', base_element: AETHER, components: [AETHER, LIGHT] },
  { name: 'Holy', base_element: LIGHT, components: [AETHER, LIGHT] },
  { name: 'Chaos', base_element: AIR, components: [AIR, DARK] },
  { name: 'Curse', base_element: AETHER, components: [AETHER, DARK] },
  { name: 'Poison', base_element: AETHER, components: [AETHER, DARK] },
  { name: 'Shadow', base_element: DARK, components: [AETHER, DARK] },
  { name: 'Spirit', base_element: AETHER, components: [AETHER, LIGHT, DARK] },
  { name: 'Illusion', base_element: AETHER, components: [LIGHT, DARK] },

  // 3 element combinations
  { name: 'Nature', base_element: AETHER, components: [WATER, EARTH, AETHER] },
  // 3 element combinations with light or dark
  { name: 'Mirror', base_element: AETHER, components: [WATER, AETHER, LIGHT] },
  { name: 'Blood', base_element: AETHER, components: [WATER, AETHER, DARK] },
  { name: 'Force', base_element: AETHER, components: [EARTH, AETHER, DARK] },
  { name: 'Necrotic', base_element: AETHER, components: [EARTH, AETHER, DARK] },
  { name: 'Time', base_element: AETHER, components: [AETHER, LIGHT, DARK] },
  { name: 'Space', base_element: AETHER, components: [AIR, AETHER, LIGHT, DARK] },
  { name: 'Creation', base_element: AETHER, components: [AETHER, LIGHT] },
  { name: 'Destruction', base_element: AETHER, components: [AIR, FIRE, DARK] },
  { name: 'Reconstruction', base_element: AETHER, components: [EARTH, WATER, LIGHT] },

  // complex combinations
  { name: 'Alchemy', base_element: AETHER, components: ['Destruction', 'Reconstruction'] },
  { name: 'Transmutation', base_element: AETHER, components: [AETHER, LIGHT] },
  { name: 'Teleportation', base_element: AETHER, components: ['Space', AETHER] },
  { name: 'Soul', base_element: AETHER, components: ['Spirit', AETHER] },
  { name: 'Life', base_element: AETHER, components: ['Nature', 'Soul'] },
  { name: 'Celestial', base_element: AETHER, components: ['Nature', 'Space'] },
  { name: 'Fate', base_element: AETHER, components: ['Time', 'Nature', AETHER, LIGHT, DARK] },
  { name: 'Death', base_element: AETHER, components: ['Life', DARK] },
];

export const spellAttributes = {
  //   { name: 'Mana Matter', base_element: null, components: [] }, // special magic that is pure magical energy, not derived from any element
  // these are base spells, with intensity and duration determined by the caster's attributes and spell level
  //  name :{ baseElement: '', components: [], category: '', proficiency: 0.0,  description: '', effects: [], manaCost: 0, cooldown: 0, range: 0, areaOfEffect: 0, duration: 0, attributes: [] }
  // Fireball: { elements: ['Fire'], description: 'A ball of fire that explodes on impact, dealing area damage.' },
  // 'Ice Shard': { elements: ['Ice'], description: 'A shard of ice that pierces enemies, with a chance to freeze them.' },
  // not magic but rather spells or effects that can be created with magic
  // { name: 'Bloom', components: ['Water', 'Earth', 'Light'] },
  // { name: 'Blue Flame', components: ['Fire', 'Aether', 'Light'] },
  // { name: 'Dragon Flame', components: [FIRE, AETHER, 'Chaos'] },
  // { name: 'Eclipse', components: [LIGHT, DARK, 'Moonlight'] },
  // { name: 'Entropy', components: ['Time', 'Chaos'] },
  // { name: 'Soul Transmutation', components: [AETHER, LIGHT, 'Soul'] },
  // { name: 'Explosion', components: [FIRE, AIR, AETHER] },
  // { name: 'Fungal', components: [WATER, EARTH, DARK] },
  // { name: 'Grave Dust', components: [AIR, EARTH, DARK] },
  // { name: 'Hellfire', components: [FIRE, AETHER, DARK] },
  // { name: 'Venom', components: ['Poison', 'Dark'] },
  // { name: 'Wildfire', components: ['Fire', 'Nature'] },
  // { name: 'Wood', components: ['Water', 'Earth'] },
  // { name: 'Abyssal Water', components: ['Water', 'Aether', 'Dark'] },
  // { name: 'Ash', components: ['Fire', 'Earth', 'Dark'] },
  // { name: 'Astral', components: ['Air', 'Aether', 'Light'] },
  // { name: 'Nightmare', components: ['Air', 'Aether', 'Dark'] },
  // { name: 'Order', components: ['Earth', 'Aether', 'Light'] },
  // { name: 'Petrification', components: ['curse', 'Aether', 'Dark'] },
  // { name: 'Phoenix Flame', components: ['Fire', 'Light', 'Life'] },
  // { name: 'Plasma', components: ['Fire', 'Lightning', 'Aether'] },
  // { name: 'Solar', components: ['Fire', 'Aether', 'Light'] },
  // { name: 'Soul Drain', components: ['Water', 'Aether', 'Dark'] },
  // { name: 'Vine', components: ['Water', 'Air', 'Earth'] },
  // { name: 'Void', components: ['Air', 'Aether', 'Dark'] },
  // { name: 'World Root', components: ['Earth', 'Nature', 'Aether'] },
  // { name: 'Dream', components: ['Spirit', AETHER] },
  // { name: 'physical reflection', components: ['Mirror', EARTH] },
  // { name: 'magic reflection', components: ['Mirror', WATER] },
  // { name: 'Decay', components: ['Curse', 'Poison'] },
  // { name: 'Dark Flame', components: [FIRE, DARK] },
  // { name: 'Lava', components: [FIRE, EARTH] },
  // { name: 'Magma', components: ['Lava', AETHER] },
  // { name: 'Obsidian', components: ['Force', 'Metal'] },
  // { name: 'Prism', components: ['Light', 'Crystal'] },
  // { name: 'Regrowth', components: ['Nature', 'Light'] },
  // { name: 'Thorn', components: ['Wood', 'Dark'] },
  // { name: 'Steam', is_base_element: false, base_element: null, components: ['Fire', 'Water'] },
  // { name: 'Smoke', is_base_element: false, base_element: null, components: ['Fire', 'Air', 'Dark'] },
  // { name: 'Dust', is_base_element: false, base_element: null, components: ['Earth', 'Air'] },
  // { name: 'Mud', is_base_element: false, base_element: null, components: ['Water', 'Earth'] },
  // { name: 'Sand', is_base_element: false, base_element: null, components: ['Earth', 'Air', 'Fire'] },
  // { name: 'Mist', is_base_element: false, base_element: null, components: ['Water', 'Air', 'Aether'] }, // if you have water and air, you can create mist, which is a basic form of aether magic that can be used for illusions, concealment, and minor healing.
  // { name: 'Frost', is_base_element: false, base_element: null, components: ['Ice', 'Dark'] }, // if you have water and air but havent learned ice magic yet, you cannot create frost
  // { name: 'Snow', is_base_element: false, base_element: null, components: ['Ice', 'Air'] },
  // { name: 'Rain', is_base_element: false, base_element: null, components: ['Water', 'Air', 'Aether'] },
  // { name: 'Storm', is_base_element: false, base_element: null, components: ['Water', 'Air', 'Fire'] },
  // { name: 'Tide', is_base_element: false, base_element: null, components: ['Water'] },
  // { name: 'Acid', is_base_element: false, base_element: null, components: ['Water', 'Poison'] },
  // { name: 'Holy Fire', is_base_element: false, base_element: null, components: ['Fire', 'Holy'] },
  // { name: 'Sunlight', is_base_element: false, base_element: null, components: ['Fire', 'Light', 'Aether'] },
  // { name: 'Moonlight', is_base_element: false, base_element: null, components: ['Water', 'Light', 'Aether'] },
  // { name: 'Starlight', is_base_element: false, base_element: null, components: ['Air', 'Light', 'Aether'] },
  // { name: 'Purification', is_base_element: false, base_element: null, components: ['Holy', 'Light'] },
  // { name: 'Blessing', is_base_element: false, base_element: null, components: ['Holy'] },
  // { name: 'Sanctuary', is_base_element: false, base_element: null, components: ['Earth', 'Holy', 'Aether'] },
  // { name: 'Judgment', is_base_element: false, base_element: null, components: ['Fire', 'Holy', 'Air'] },
  // { name: 'Divine Flame', is_base_element: false, base_element: null, components: ['Fire', 'Holy', 'Aether'] },
  // { name: 'Wind', is_base_element: false, base_element: null, components: ['Air'] },
  // { name: 'Gale', is_base_element: false, base_element: null, components: ['Air', 'Aether'] },
  // { name: 'Tornado', is_base_element: false, base_element: null, components: ['Air', 'Earth'] },
  // { name: 'Pressure', is_base_element: false, base_element: null, components: ['Air', 'Earth', 'Aether'] },
  // { name: 'Sound', is_base_element: false, base_element: null, components: ['Air', 'Aether'] },
  // { name: 'Silence', is_base_element: false, base_element: null, components: ['Air', 'Dark', 'Aether'] },
  // { name: 'Sonic', is_base_element: false, base_element: null, components: ['Air', 'Lightning'] },
  // { name: 'Feather', is_base_element: false, base_element: null, components: ['Air', 'Light'] },
  // { name: 'Vacuum', is_base_element: false, base_element: null, components: ['Air', 'Dark'] },
  // { name: 'Sky', is_base_element: false, base_element: null, components: ['Air', 'Light', 'Aether'] },
};
