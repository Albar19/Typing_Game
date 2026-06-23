import { Game } from './core/game.js';
import { SCREEN } from './core/router.js';
import { screenMenu } from './screens/screenMenu.js';
import { screenPlaying } from './screens/screenPlaying.js';
import { screenPaused } from './screens/screenPaused.js';
import { screenGameOver } from './screens/screenGameOver.js';

console.debug('[Game] main module loaded');
const game = new Game();
game.router.register(SCREEN.MENU, screenMenu);
game.router.register(SCREEN.PLAYING, screenPlaying);
game.router.register(SCREEN.PAUSED, screenPaused);
game.router.register(SCREEN.GAME_OVER, screenGameOver);
game.start();
