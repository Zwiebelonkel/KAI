
import { Trophy, Rarity } from './types';

export const TROPHIES: Trophy[] = [
  { id: 't1', emoji: '📜', name: 'Alte Schriftrolle', rarity: 'Common' },
  { id: 't2', emoji: '🔋', name: 'Energie-Zelle', rarity: 'Common' },
  { id: 't3', emoji: '🥉', name: 'Bronze-Chip', rarity: 'Common' },
  { id: 't4', emoji: '⚙️', name: 'Zahnrad des Wissens', rarity: 'Common' },
  { id: 't5', emoji: '💡', name: 'Geistesblitz', rarity: 'Rare' },
  { id: 't6', emoji: '🥈', name: 'Silber-Prozessor', rarity: 'Rare' },
  { id: 't7', emoji: '💎', name: 'Daten-Kristall', rarity: 'Rare' },
  { id: 't8', emoji: '⚡', name: 'Turbo-Boost', rarity: 'Epic' },
  { id: 't9', emoji: '🥇', name: 'Gold-Kern', rarity: 'Epic' },
  { id: 't10', emoji: '🔮', name: 'Vorhersage-Kugel', rarity: 'Epic' },
  { id: 't11', emoji: '🏆', name: 'KI-Meister-Pokal', rarity: 'Legendary' },
  { id: 't12', emoji: '👑', name: 'Krone der Logik', rarity: 'Legendary' },
  { id: 't13', emoji: '☄️', name: 'Kometen-Code', rarity: 'Legendary' },
  { id: 't14', emoji: '🌈', name: 'Quanten-Spektrum', rarity: 'Exotic' },
  { id: 't15', emoji: '👾', name: 'Ghost in the Shell', rarity: 'Exotic' },
  { id: 't16', emoji: '🌌', name: 'Singularitäts-Nebel', rarity: 'Exotic' },
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
