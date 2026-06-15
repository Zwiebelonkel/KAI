import { Trophy, Rarity } from './types';

export const TROPHIES: Trophy[] = [
  { id: 't1', emoji: '📜', name: 'Alte Schriftrolle', rarity: 'Common' },
  { id: 't2', emoji: '🔋', name: 'Energie-Zelle', rarity: 'Common' },
  { id: 't3', emoji: '🥉', name: 'Bronze-Chip', rarity: 'Common' },
  { id: 't4', emoji: '⚙️', name: 'Zahnrad des Wissens', rarity: 'Common' },
  { id: 't5', emoji: '🧩', name: 'Puzzle-Fragment', rarity: 'Common' },
  { id: 't6', emoji: '🪙', name: 'KAI-Münze', rarity: 'Common' },
  { id: 't7', emoji: '📎', name: 'Trainings-Clip', rarity: 'Common' },
  { id: 't8', emoji: '🧠', name: 'Mini-Neuron', rarity: 'Common' },
  { id: 't9', emoji: '💡', name: 'Geistesblitz', rarity: 'Rare' },
  { id: 't10', emoji: '🥈', name: 'Silber-Prozessor', rarity: 'Rare' },
  { id: 't11', emoji: '💎', name: 'Daten-Kristall', rarity: 'Rare' },
  { id: 't12', emoji: '🛰️', name: 'Satelliten-Signal', rarity: 'Rare' },
  { id: 't13', emoji: '🔬', name: 'Analyse-Linse', rarity: 'Rare' },
  { id: 't14', emoji: '🛡️', name: 'Firewall-Schild', rarity: 'Rare' },
  { id: 't15', emoji: '🧪', name: 'Prompt-Elixier', rarity: 'Rare' },
  { id: 't16', emoji: '⚡', name: 'Turbo-Boost', rarity: 'Epic' },
  { id: 't17', emoji: '🥇', name: 'Gold-Kern', rarity: 'Epic' },
  { id: 't18', emoji: '🔮', name: 'Vorhersage-Kugel', rarity: 'Epic' },
  { id: 't19', emoji: '🚀', name: 'Raketen-Algorithmus', rarity: 'Epic' },
  { id: 't20', emoji: '🧬', name: 'Neuronale DNA', rarity: 'Epic' },
  { id: 't21', emoji: '🌀', name: 'Token-Wirbel', rarity: 'Epic' },
  { id: 't22', emoji: '🏆', name: 'KI-Meister-Pokal', rarity: 'Legendary' },
  { id: 't23', emoji: '👑', name: 'Krone der Logik', rarity: 'Legendary' },
  { id: 't24', emoji: '☄️', name: 'Kometen-Code', rarity: 'Legendary' },
  { id: 't25', emoji: '🦾', name: 'Cyber-Arm', rarity: 'Legendary' },
  { id: 't26', emoji: '🧙', name: 'Prompt-Magier', rarity: 'Legendary' },
  { id: 't27', emoji: '🌈', name: 'Quanten-Spektrum', rarity: 'Exotic' },
  { id: 't28', emoji: '👾', name: 'Ghost in the Shell', rarity: 'Exotic' },
  { id: 't29', emoji: '🌌', name: 'Singularitäts-Nebel', rarity: 'Exotic' },
  { id: 't30', emoji: '🛸', name: 'Alien-Modell', rarity: 'Exotic' },
  { id: 't31', emoji: '🦄', name: 'Unicorn-Datensatz', rarity: 'Exotic' },
];

export const getRandomTrophy = (): Trophy => {
  const rand = Math.random() * 100;
  let rarity: Rarity = 'Common';

  if (rand < 1) rarity = 'Exotic';
  else if (rand < 5) rarity = 'Legendary';
  else if (rand < 15) rarity = 'Epic';
  else if (rand < 40) rarity = 'Rare';
  else rarity = 'Common';

  const possibleTrophies = TROPHIES.filter(t => t.rarity === rarity);
  return possibleTrophies[Math.floor(Math.random() * possibleTrophies.length)];
};

export const getRandomTrophies = (count = 3): Trophy[] => {
  return Array.from({ length: count }, () => getRandomTrophy());
};

export const getRarityColor = (rarity: Rarity) => {
  switch (rarity) {
    case 'Common': return 'text-slate-400';
    case 'Rare': return 'text-blue-400';
    case 'Epic': return 'text-purple-400';
    case 'Legendary': return 'text-orange-400';
    case 'Exotic': return 'text-pink-400 animate-pulse';
    default: return 'text-white';
  }
};
