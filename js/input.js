import { AudioFX } from './audio.js';
import { canvas } from './canvas.js';

export function handleKeyDown(game, e) {
  if (e.key === 'Escape') {
    if (game.state === 'playing') {
      game.state = 'paused';
      game.pauseMenuSelectedRow = 0;
      game.playLobbyMusic();
    } else if (game.state === 'paused') {
      game.state = 'playing';
      game.playBackgroundMusic();
    }
    return;
  }

  if (game.state === 'menu' || game.state === 'gameover') {
    if (e.key === 'Enter') {
      game.reset();
    }
    return;
  }

  if (game.state === 'paused') {
    if (e.key === 'ArrowUp') {
      game.pauseMenuSelectedRow = (game.pauseMenuSelectedRow - 1 + 6) % 6;
    } else if (e.key === 'ArrowDown') {
      game.pauseMenuSelectedRow = (game.pauseMenuSelectedRow + 1) % 6;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (game.pauseMenuSelectedRow === 0) {
        const newLang = game.language === 'en' ? 'id' : 'en';
        game.setLanguage(newLang);
      } else if (game.pauseMenuSelectedRow === 1) {
        const fpsOptions = [60, 120, 144, 0];
        let idx = fpsOptions.indexOf(game.targetFPS);
        if (idx === -1) idx = 0;
        if (e.key === 'ArrowLeft') {
          idx = (idx - 1 + fpsOptions.length) % fpsOptions.length;
        } else {
          idx = (idx + 1) % fpsOptions.length;
        }
        game.setFPS(fpsOptions[idx]);
      } else if (game.pauseMenuSelectedRow === 2) {
        const change = e.key === 'ArrowLeft' ? -0.1 : 0.1;
        game.setMusicVolume(game.musicVolume + change);
      } else if (game.pauseMenuSelectedRow === 3) {
        const change = e.key === 'ArrowLeft' ? -0.1 : 0.1;
        game.setSfxVolume(game.sfxVolume + change);
      } else if (game.pauseMenuSelectedRow === 4) {
        game.setErrorShake(!game.errorShakeEnabled);
      }
    } else if (e.key === 'Enter') {
      if (game.pauseMenuSelectedRow === 4) {
        game.setErrorShake(!game.errorShakeEnabled);
      } else if (game.pauseMenuSelectedRow === 5) {
        game.state = 'playing';
        game.playBackgroundMusic();
      }
    }
    return;
  }

  if (game.state !== 'playing') return;

  if (e.key === 'Backspace') {
    if (game.currentTarget) {
      game.currentTarget.isTargeted = false;
      game.currentTarget.typedIndex = 0;
      game.currentTarget = null;
    }
    return;
  }

  const key = e.key.toUpperCase();
  if (key.length !== 1 || key < 'A' || key > 'Z') return;

  const hasLaser = game.activeBuff && game.activeBuff.id === 'laser';

  if (game.currentTarget) {
    const nextChar = game.currentTarget.word[game.currentTarget.typedIndex];
    if (key === nextChar) {
      game.currentTarget.typedIndex++;
      AudioFX.playTyping();

      if (hasLaser) {
        game.currentTarget.typedIndex = game.currentTarget.word.length;
      }

      if (game.currentTarget.typedIndex >= game.currentTarget.word.length) {
        game.fireBullet(game.currentTarget);
        game.currentTarget.isTargeted = false;
        game.currentTarget = null;
      }
    } else {
      AudioFX.playErrorType();
      if (game.errorShakeEnabled) {
        game.shakeIntensity = Math.max(game.shakeIntensity, 4.5);
      }
    }
    return;
  }

  const matches = game.entities.filter(e =>
    e.alive && e.typedIndex === 0 && e.word[0] === key
  );
  if (matches.length === 0) return;

  matches.sort((a, b) => b.y - a.y);
  const target = matches[0];
  target.isTargeted = true;
  target.typedIndex = 1;
  game.currentTarget = target;
  AudioFX.playTyping();

  if (hasLaser) {
    target.typedIndex = target.word.length;
  }

  if (target.typedIndex >= target.word.length) {
    game.fireBullet(target);
    target.isTargeted = false;
    game.currentTarget = null;
  }
}

export function handleCanvasClick(game, e) {
  if (game.state !== 'paused') return;

  const rect = canvas.getBoundingClientRect();
  const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
  const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const cardY = cy - 570 / 2;

  if (clickY >= cardY + 115 && clickY <= cardY + 145) {
    if (clickX >= cx - 110 && clickX <= cx - 10) {
      game.setLanguage('en');
      game.pauseMenuSelectedRow = 0;
    } else if (clickX >= cx + 10 && clickX <= cx + 110) {
      game.setLanguage('id');
      game.pauseMenuSelectedRow = 0;
    }
  }

  if (clickY >= cardY + 190 && clickY <= cardY + 220) {
    if (clickX >= cx - 181 && clickX <= cx - 101) {
      game.setFPS(60);
      game.pauseMenuSelectedRow = 1;
    } else if (clickX >= cx - 87 && clickX <= cx - 7) {
      game.setFPS(120);
      game.pauseMenuSelectedRow = 1;
    } else if (clickX >= cx + 7 && clickX <= cx + 87) {
      game.setFPS(144);
      game.pauseMenuSelectedRow = 1;
    } else if (clickX >= cx + 101 && clickX <= cx + 181) {
      game.setFPS(0);
      game.pauseMenuSelectedRow = 1;
    }
  }

  if (clickY >= cardY + 255 && clickY <= cardY + 285) {
    if (clickX >= cx - 110 && clickX <= cx - 80) {
      game.setMusicVolume(game.musicVolume - 0.1);
      game.pauseMenuSelectedRow = 2;
    } else if (clickX >= cx + 80 && clickX <= cx + 110) {
      game.setMusicVolume(game.musicVolume + 0.1);
      game.pauseMenuSelectedRow = 2;
    } else if (clickX >= cx - 70 && clickX <= cx + 70) {
      const percent = (clickX - (cx - 70)) / 140;
      game.setMusicVolume(percent);
      game.pauseMenuSelectedRow = 2;
    }
  }

  if (clickY >= cardY + 320 && clickY <= cardY + 350) {
    if (clickX >= cx - 110 && clickX <= cx - 80) {
      game.setSfxVolume(game.sfxVolume - 0.1);
      game.pauseMenuSelectedRow = 3;
    } else if (clickX >= cx + 80 && clickX <= cx + 110) {
      game.setSfxVolume(game.sfxVolume + 0.1);
      game.pauseMenuSelectedRow = 3;
    } else if (clickX >= cx - 70 && clickX <= cx + 70) {
      const percent = (clickX - (cx - 70)) / 140;
      game.setSfxVolume(percent);
      game.pauseMenuSelectedRow = 3;
    }
  }

  if (clickY >= cardY + 385 && clickY <= cardY + 415) {
    if (clickX >= cx - 110 && clickX <= cx - 10) {
      game.setErrorShake(true);
      game.pauseMenuSelectedRow = 4;
    } else if (clickX >= cx + 10 && clickX <= cx + 110) {
      game.setErrorShake(false);
      game.pauseMenuSelectedRow = 4;
    }
  }

  if (clickY >= cardY + 450 && clickY <= cardY + 490) {
    if (clickX >= cx - 100 && clickX <= cx + 100) {
      game.state = 'playing';
      game.playBackgroundMusic();
    }
  }
}

export function setupInputListeners(game) {
  const startLobbyMusicOnInteraction = () => {
    if (game.state === 'menu') {
      game.playLobbyMusic();
    }
    window.removeEventListener('click', startLobbyMusicOnInteraction);
    window.removeEventListener('keydown', startLobbyMusicOnInteraction);
  };
  window.addEventListener('click', startLobbyMusicOnInteraction);
  window.addEventListener('keydown', startLobbyMusicOnInteraction);

  window.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') e.preventDefault();
    handleKeyDown(game, e);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (game.state === 'playing') {
        game.state = 'paused';
        game.pauseMenuSelectedRow = 0;
      }
      game.pauseAllMusic();
    } else {
      if (game.state === 'menu' || game.state === 'paused' || game.state === 'gameover') {
        game.playLobbyMusic();
      }
    }
  });

  canvas.addEventListener('click', (e) => handleCanvasClick(game, e));
}
