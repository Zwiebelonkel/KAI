import { Trophy, Rarity } from './types';

export const RARITY_CHANCES: Record<Rarity, number> = {
  Common: 60,
  Rare: 25,
  Epic: 10,
  Legendary: 4,
  Exotic: 1,
};

export const RARITY_ORDER: Rarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Exotic'];

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

  if (rand < RARITY_CHANCES.Exotic) rarity = 'Exotic';
  else if (rand < RARITY_CHANCES.Exotic + RARITY_CHANCES.Legendary) rarity = 'Legendary';
  else if (rand < RARITY_CHANCES.Exotic + RARITY_CHANCES.Legendary + RARITY_CHANCES.Epic) rarity = 'Epic';
  else if (rand < RARITY_CHANCES.Exotic + RARITY_CHANCES.Legendary + RARITY_CHANCES.Epic + RARITY_CHANCES.Rare) rarity = 'Rare';
  else rarity = 'Common';

  const possibleTrophies = TROPHIES.filter(t => t.rarity === rarity);
  return possibleTrophies[Math.floor(Math.random() * possibleTrophies.length)];
};

export const getRandomTrophies = (count = 3): Trophy[] => {
  const selected: Trophy[] = [];
  const selectedIds = new Set<string>();
  const maxUniqueCount = Math.min(count, TROPHIES.length);

  while (selected.length < maxUniqueCount) {
    const trophy = getRandomTrophy();

    if (!selectedIds.has(trophy.id)) {
      selected.push(trophy);
      selectedIds.add(trophy.id);
    }
  }

  return selected;
};


export const getRarityCardClass = (rarity: Rarity) => {
  switch (rarity) {
    case 'Common': return 'border-slate-400/30 bg-slate-400/10 shadow-slate-400/10';
    case 'Rare': return 'border-blue-400/40 bg-blue-400/10 shadow-blue-400/20';
    case 'Epic': return 'border-purple-400/40 bg-purple-400/10 shadow-purple-400/20';
    case 'Legendary': return 'border-orange-400/50 bg-orange-400/10 shadow-orange-400/25';
    case 'Exotic': return 'border-pink-400/60 bg-pink-400/15 shadow-pink-400/30';
    default: return 'border-white/10 bg-white/5 shadow-black/10';
  }
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
