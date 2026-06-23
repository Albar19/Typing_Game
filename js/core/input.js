import { canvas } from './canvas.js';
import { SCREEN } from './router.js';

export function setupInputListeners(game) {
  const startLobbyMusic = () => {
    if (game.router.current === SCREEN.MENU) {
      game.playLobbyMusic();
    }
    window.removeEventListener('click', startLobbyMusic);
    window.removeEventListener('keydown', startLobbyMusic);
  };
  window.addEventListener('click', startLobbyMusic);
  window.addEventListener('keydown', startLobbyMusic);

  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
    game.router.handleKeyDown(e);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (game.router.current === SCREEN.PLAYING) {
        game.router.go(SCREEN.PAUSED);
      }
      game.pauseAllMusic();
    } else {
      if (game.router.current === SCREEN.MENU ||
          game.router.current === SCREEN.PAUSED ||
          game.router.current === SCREEN.GAME_OVER) {
        game.playLobbyMusic();
      }
    }
  });

  canvas.addEventListener('click', (e) => game.router.handleClick(e));
}
