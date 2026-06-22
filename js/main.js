// ─── ENTRY POINT ─────────────────────────────────────────────
// Thin bootstrap: imports the Game class and starts it.
// All logic lives in dedicated modules under js/.
import { Game } from './game.js';

const game = new Game();
window.game = game; // Expose for AudioFX volume access
game.start();
