import enEasy from './en/easy.js';
import enMedium from './en/medium.js';
import enHard from './en/hard.js';
import enExpert from './en/expert.js';
import idEasy from './id/easy.js';
import idMedium from './id/medium.js';
import idHard from './id/hard.js';
import idExpert from './id/expert.js';

export const WORD_BANKS_EN = { easy: enEasy, medium: enMedium, hard: enHard, expert: enExpert };
export const WORD_BANKS_ID = { easy: idEasy, medium: idMedium, hard: idHard, expert: idExpert };

export function getWordBanks(lang) {
  return lang === 'id' ? WORD_BANKS_ID : WORD_BANKS_EN;
}
