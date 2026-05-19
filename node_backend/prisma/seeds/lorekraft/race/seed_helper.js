import { TinyVectorDB } from '#utils/tiny_vector_db';

const abilityType = [
  ['REGULAR', 'Regular abilities are standard actions a character can perform.'],
  ['HEAVY', 'Heavy abilities are powerful actions with a longer cooldown.'],
  ['UNIQUE', 'Unique abilities are special actions unique to a character.'],
  ['PASSIVE', 'Passive abilities provide ongoing effects without active use.'],
];
const affinityType = [
  ['ELEMENTAL', 'Players have an affinity for a specific magic element, e.g. "Fire" or "Water"'],
  ['WEAPON', 'Players have an affinity for a specific weapon type, e.g. "Swords" or "Bows"'],
  ['SPELL', 'Players have an affinity for a specific spell or spell type, e.g. "Fireball" or "Healing Spells"'],
  ['SKILL', 'Players have an affinity for a specific skill or skill type, e.g. "Stealth" or "Swordsmanship"'],
];
const attributeType = [
  ['STRENGTH', 'Strength attribute represents physical power.'],
  ['AGILITY', 'Agility attribute represents speed and dexterity.'],
  ['PHYSICAL_DEFENSE', 'Physical defense attribute reduces physical damage taken.'],
  ['MAGICAL_DEFENSE', 'Magical defense attribute reduces magical damage taken.'],
  ['MANA', 'Mana attribute represents magical energy available for casting spells.'],
  ['INTELLIGENCE', 'Intelligence attribute represents mental acuity and magical power.'],
  ['COURAGE', 'Courage attribute represents bravery and resistance to fear effects.'],
  ['PATIENCE', 'Patience attribute represents the ability to wait calmly and endure difficult situations.'],
  ['EGO', 'Ego attribute represents self-esteem and confidence.'],
  ['PRIDE', "Pride attribute represents a character's sense of self-worth and dignity."],
];
const characterType = [
  ['PLAYER', 'Players are the main characters controlled by users.'],
  ['ENEMY', 'Enemies are characters that oppose players.'],
  ['BOSS', 'Bosses are powerful enemies with unique abilities.'],
  ['NPC', 'Non-player characters that populate the game world.'],
  ['MINION', 'Minions are weaker enemies that serve bosses or other powerful characters.'],
  ['SLAVE', 'Slaves are oppressed characters that may have unique storylines or abilities.'],
  ['FAMILIAR', 'Familiars are companion creatures that assist players.'],
  ['SUPPORT_CHARACTER', 'Support characters provide assistance to players in various ways.'],
];
const evolutionConditionType = [
  ['LEVEL', 'Evolution occurs when a character reaches a certain level.'],
  ['ITEM', 'Evolution occurs when a specific item is used.'],
  ['AFFINITY', "Evolution occurs based on a character's affinity."],
  ['ATTRIBUTE', "Evolution occurs based on a character's attributes."],
  ['TIME_OF_DAY', 'Evolution occurs at a specific time of day.'],
];
const magicElementType = [
  ['FIRE', 'Fire element is associated with heat and flames.'],
  ['WATER', 'Water element is associated with rivers, lakes, and oceans. ICE is a sub-element of water associated with cold and freezing.'],
  ['AIR', 'Air element is associated with wind and sky.'],
  ['EARTH', 'Earth element is associated with soil, rocks, and mountains.'],
  ['AETHER', 'Aether element is associated with mystical energy.'],
  ['LIGHT', 'Light element is associated with illumination and purity.'],
  ['DARK', 'Dark element is associated with shadows and corruption.'],
];
const raceType = [
  [
    'CELESTIAL',
    'Celestials are divine beings formed from sacred power, heavenly authority, and cosmic order. Their purpose centers on judgment, protection, blessing, purification, and enforcement of divine law. They often appear as angels, holy guardians, radiant warriors, or emissaries of higher realms. Their abilities commonly include healing light, sacred barriers, purification magic, spiritual authority, and radiant attacks.',
  ],

  [
    'BEAST',
    'Beasts are non-humanoid creatures shaped by instinct, territory, hunger, and survival. They include wild animals, magical predators, giant monsters, and naturally evolved creatures. Their strengths come from physical adaptation such as claws, fangs, venom, camouflage, speed, armor, heightened senses, or brute force. Their behavior is usually driven by environment, pack hierarchy, threat response, and natural predation.',
  ],

  [
    'BEASTFOLK',
    'Beastfolk are humanoid peoples with animal-derived traits such as fur, tails, ears, claws, horns, scales, feathers, or enhanced senses. They possess language, culture, tools, settlements, and organized communities. Their societies are often shaped by animal lineage, tribal customs, hunting traditions, migration patterns, or nature-based spirituality. Their strengths combine humanoid reasoning with animal instincts and physical adaptations.',
  ],

  [
    'DEMON',
    'Demons are supernatural beings born from infernal realms, abyssal domains, corruption, temptation, and destructive chaos. Their nature is tied to domination, fear, curses, sin, violent desire, and forbidden power. They often possess dark flames, horns, wings, claws, regeneration, soul corruption, possession, or contract-based magic. Demon societies commonly follow brutal hierarchies ruled by strength, cunning, and infernal authority.',
  ],

  [
    'DRAGON',
    'Dragons are ancient apex creatures with immense size, intelligence, elemental power, and long lifespans. Their defining traits include scaled bodies, breath attacks, wings, claws, territorial dominance, treasure hoarding, and ancient memory. Dragons often command fire, frost, lightning, poison, storm, or arcane energy through natural draconic power. They are usually solitary rulers, ancient guardians, tyrants, or legendary beings.',
  ],

  [
    'DWARF',
    'Dwarves are sturdy humanoids known for underground kingdoms, clan loyalty, mining, metallurgy, engineering, and master craftsmanship. Their culture values ancestral legacy, durable construction, forged weapons, stonework, discipline, and oath-bound honor. Dwarves excel in defensive warfare, heavy armor, siege engineering, smithing, gem cutting, and fortress design. Their settlements are commonly built inside mountains, caverns, and mineral-rich strongholds.',
  ],

  [
    'ELEMENTAL',
    'Elementals are entities composed from raw natural forces or magical substances such as fire, water, air, earth, lightning, ice, magma, storm, or aether. Their bodies behave like living manifestations of energy, matter, weather, or terrain. Elementals often arise from primal zones, magical disasters, ancient rituals, or concentrated environmental power. Their abilities directly reflect their substance, including burning, freezing, flowing, crushing, shocking, or reshaping terrain.',
  ],

  [
    'ELF',
    'Elves are long-lived humanoids associated with refined culture, ancient knowledge, graceful movement, and deep magical sensitivity. Their societies often emphasize beauty, precision, scholarship, nature stewardship, archery, music, ritual, and arcane mastery. Elves are known for heightened senses, agility, patience, elegant craftsmanship, and strong connection to forests, moonlit realms, or enchanted cities. Their worldview often spans centuries of memory and tradition.',
  ],

  [
    'GIANT',
    'Giants are enormous humanoid beings defined by massive bodies, overwhelming strength, heavy endurance, and ancient tribal or clan-based societies. They inhabit mountains, tundras, volcanic fields, storm peaks, deep forests, or ruined primordial lands. Giants fight with boulders, tree-sized weapons, crushing blows, and battlefield-scale force. Their culture often values strength contests, elder rule, oral history, territorial ownership, and monumental construction.',
  ],

  [
    'GOBLIN',
    'Goblins are small humanoids known for scavenging, opportunism, traps, ambushes, crude inventions, and survival through numbers. They thrive in caves, ruins, tunnels, junkyards, forests, sewers, and abandoned settlements. Goblins often use stolen tools, unstable explosives, improvised weapons, dirty tactics, and chaotic teamwork. Their communities are fast-growing, noisy, resourceful, and highly reactive to danger or opportunity.',
  ],

  [
    'HUMAN',
    'Humans are adaptable humanoids with broad potential across combat, magic, politics, trade, invention, exploration, and leadership. Their societies range from villages and kingdoms to empires, guild states, republics, and nomadic cultures. Humans expand quickly, learn diverse skills, form alliances, wage organized wars, and create changing institutions. Their greatest strength is versatility across many disciplines rather than extreme specialization in one trait.',
  ],

  [
    'MACHINE',
    'Machines are artificial entities created through engineering, magical construction, alchemy, clockwork, runes, or advanced technology. They include constructs, automatons, golems, androids, drones, engines, war machines, and self-operating weapons. Machines often possess metal bodies, programmed behavior, tireless operation, modular parts, precise movement, and resistance to biological needs. Their abilities come from mechanisms, circuits, cores, gears, enchantments, or command protocols.',
  ],

  [
    'ORC',
    'Orcs are warrior humanoids shaped by clan culture, physical dominance, battlefield honor, and survival through strength. Their societies often revolve around warbands, chieftains, raids, contests of power, hunting, weapon mastery, and loyalty to tribe. Orcs excel in direct combat, intimidation, endurance, berserker rage, heavy weapons, and aggressive tactics. Their culture rewards courage, toughness, conquest, and visible proof of strength.',
  ],

  [
    'SPIRIT',
    'Spirits are incorporeal entities formed from souls, memories, emotions, dreams, beliefs, curses, or lingering consciousness. They may appear as ghosts, ancestral guardians, dream figures, haunting presences, shrine keepers, or manifestations of unresolved will. Spirits commonly influence minds, emotions, places, omens, dreams, and spiritual perception. Their abilities include possession, phasing, invisibility, whispers, illusions, memory echoes, and supernatural communication.',
  ],

  [
    'PLANT',
    'Plant beings are organic lifeforms derived from trees, flowers, vines, fungi, roots, spores, seeds, moss, or parasitic growths. Their biology centers on growth, regeneration, photosynthesis, toxins, pollen, bark, thorns, sap, and environmental adaptation. Plant creatures can bind enemies with vines, release spores, spread roots, harden bark, drain nutrients, or bloom into specialized forms. Their habitats include forests, swamps, jungles, gardens, ruins, and ancient groves.',
  ],

  [
    'UNDEAD',
    'Undead are beings sustained after death through necromancy, curses, soul binding, blood rites, or forbidden resurrection. They include skeletons, zombies, revenants, vampires, liches, mummies, ghouls, and corpse-bound horrors. Their existence is tied to death energy, decay, preserved bodies, graves, tombs, hunger for life force, and resistance to mortality. Their abilities often include life drain, rot, fear aura, immortality, bone manipulation, and necrotic magic.',
  ],
];
const resistanceType = [
  [
    'PHYSICAL',
    'Resistance to direct physical force, weapon strikes, bodily impact, kinetic attacks, environmental collision, and non-magical damage. This includes slashing, piercing, bludgeoning, crushing, projectiles, grappling, explosions, knockback, and other forms of material combat.',
  ],

  [
    'MAGIC',
    'Resistance to raw magical energy, supernatural force, mana pressure, arcane phenomena, dimensional distortion, spiritual power, and reality-altering effects that originate from magical or supernatural sources.',
  ],

  [
    'SPELLS',
    'Resistance to structured casted abilities activated through incantations, rituals, magical formulas, enchantments, seals, summoning techniques, curse casting, magical contracts, or intentionally executed supernatural abilities.',
  ],

  [
    'DEBUFF',
    'Resistance to disabling or weakening effects that negatively alter combat effectiveness, movement, reactions, perception, accuracy, defense, casting ability, or temporary combat performance. This includes stun, slow, silence, restriction, suppression, interruption, and stat reduction effects.',
  ],

  [
    'MENTAL',
    'Resistance to effects that target the mind, emotions, perception, consciousness, instincts, thoughts, memories, or psychological state. This includes fear, charm, confusion, illusion, intimidation, psychic attacks, mind control, emotional manipulation, hallucinations, and mental intrusion.',
  ],

  [
    'VITALITY',
    'Resistance to effects that damage biological stability, life force, stamina, regeneration, internal health, cellular integrity, or long-term survival condition. This includes poison, disease, bleeding, decay, fatigue, burning deterioration, aging, necrosis, corruption, and life-draining effects.',
  ],

  [
    'ELEMENTAL',
    'Resistance to elemental phenomena generated from natural or magical forces such as fire, water, ice, lightning, wind, earth, darkness, light, heat, cold, storms, magma, sound, pressure, and other elemental manifestations.',
  ],

  [
    'RADIANT',
    'Resistance to radiant, holy, sacred, celestial, solar, purification, and divine-energy based effects. This includes holy light, judgment beams, consecrated flames, purification waves, blessing-powered attacks, and spiritually empowered radiant damage.',
  ],

  [
    'LEVEL_NULL',
    'Resistance to nullification, suppression, cancellation, erasure, sealing, disruption, or removal of active enhancements, magical buffs, temporary boosts, transformations, empowered states, passive effects, enchantments, and external power amplification.',
  ],
];
const skillType = [
  ['ALCHEMIST', 'Alchemists are craftsmen who specialize in creating potions and magical items.'],
  ['ARCHER', 'Archers are skilled with bows.'],
  ['ASSASSIN', 'Assassins are stealthy and deadly.'],
  ['BLACKSMITH', 'Blacksmiths are craftsmen who specialize in forging weapons and armor.'],
  ['CRAFTSMAN', 'Craftsmen are characters that create items, weapons, armor, and other goods for players.'],
  ['GATHERER', 'Gatherers are characters that collect resources, materials, and information for players.'],
  ['HEALER', 'Healers restore health and support allies. Can be Magical or Physical.'],
  ['HERBALIST', 'Herbalists are gatherers who specialize in collecting and using herbs for various purposes.'],
  ['INFORMANT', 'Informants are gatherers who specialize in collecting and providing information.'],
  ['MAGE', 'Mages are masters of magic.'],
  ['MERCHANT', 'Merchants are characters that sell goods and services to players.'],
  ['SCRIBIST', 'Scribists are craftsmen who specialize in creating written works, scrolls, and magical texts.'],
  ['SUMMONER', 'Summoners call forth creatures to aid them. Special case of Mages.'],
  ['TANK', 'Tanks have high defense and are resilient.'],
  ['THIEF', 'Thieves are agile and stealthy.'],
  ['WARRIOR', 'Warriors are strong and brave.'],
];

const abilityTypeDB = await TinyVectorDB.create();
const affinityTypeDB = await TinyVectorDB.create();
const attributeTypeDB = await TinyVectorDB.create();
const characterTypeDB = await TinyVectorDB.create();
const evolutionConditionTypeDB = await TinyVectorDB.create();
const magicElementTypeDB = await TinyVectorDB.create();
const raceTypeDB = await TinyVectorDB.create();
const resistanceTypeDB = await TinyVectorDB.create();
const skillTypeDB = await TinyVectorDB.create();
// const weaponDB = await TinyVectorDB.create();

const enumDBPairs = {
  abilityType: { type: abilityType, db: abilityTypeDB },
  affinityType: { type: affinityType, db: affinityTypeDB },
  attributeType: { type: attributeType, db: attributeTypeDB },
  characterType: { type: characterType, db: characterTypeDB },
  evolutionConditionType: { type: evolutionConditionType, db: evolutionConditionTypeDB },
  magicElementType: { type: magicElementType, db: magicElementTypeDB },
  raceType: { type: raceType, db: raceTypeDB },
  resistanceType: { type: resistanceType, db: resistanceTypeDB },
  skillType: { type: skillType, db: skillTypeDB },
};

for (const [enumName, { type, db }] of Object.entries(enumDBPairs)) {
  for (const [value, description] of type) {
    await db.addString(value, description);
  }
}

// console.log(await enumDBPairs.magicElementType.db.queryString('ICE', 1)); // example usage

export default enumDBPairs;
