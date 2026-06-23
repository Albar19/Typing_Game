import { canvas, ctx } from '../core/canvas.js';
import { SCREEN, renderBackground } from '../core/router.js';
import { renderScanlines } from '../rendering/effects.js';
import { renderButton, renderToggle, renderArrowBtn, renderLabel, renderProgressBar } from '../ui/button.js';

export const screenPaused = {
  update(game, dt) {
    for (const star of game.stars) star.update(dt);
    game.gameTime += dt;
  },

  onEnter(game) {
    game.pauseMenuSelectedRow = 0;
    game.playLobbyMusic();
  },

  onExit(game) {
    game.playBackgroundMusic();
  },

  render(game) {
    renderBackground(game);
    renderScanlines(game);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const w = 520;
    const h = 570;
    const cardX = cx - w / 2;
    const cardY = cy - h / 2;

    ctx.fillStyle = 'rgba(10, 10, 30, 0.92)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, w, h, 12);
    ctx.fill();

    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#0ff';
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 28px "Orbitron", sans-serif';
    ctx.fillStyle = '#0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0ff';
    ctx.fillText(game.t('paused'), cx, cardY + 45);
    ctx.shadowBlur = 0;

    const grad = ctx.createLinearGradient(cx - 150, 0, cx + 150, 0);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.5, '#ff3399');
    grad.addColorStop(1, 'transparent');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cardY + 70);
    ctx.lineTo(cx + 150, cardY + 70);
    ctx.stroke();

    const sel = game.pauseMenuSelectedRow;
    this.renderLanguageRow(game, cx, cardY, sel === 0);
    this.renderFpsRow(game, cx, cardY, sel === 1);
    this.renderMusicVolumeRow(game, cx, cardY, sel === 2);
    this.renderSfxVolumeRow(game, cx, cardY, sel === 3);
    this.renderShakeRow(game, cx, cardY, sel === 4);
    this.renderResumeRow(game, cx, cardY, sel === 5);

    ctx.font = '11px "Share Tech Mono", monospace';
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.3 * pulse})`;
    ctx.textAlign = 'center';  
    ctx.fillText(game.t('pressEscResume'), cx, cardY + 535);
  },

  renderLanguageRow(game, cx, cardY, focused) {
    renderLabel(game.t('language'), cx, cardY + 100, focused);
    renderToggle(cx - 110, cardY + 115, 100, 30, 'ENGLISH', game.language === 'en');
    renderToggle(cx + 10, cardY + 115, 100, 30, 'INDONESIA', game.language === 'id');
    if (focused) {
      ctx.fillStyle = '#ff3399';
      ctx.font = 'bold 16px "Orbitron", sans-serif';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff3399';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', cx - 140, cardY + 130);
      ctx.shadowBlur = 0;
    }
  },

  renderFpsRow(game, cx, cardY, focused) {
    renderLabel(game.t('refreshRate'), cx, cardY + 175, focused);
    const fpsOptions = [60, 120, 144, 0];
    const fpsLabels = ['60', '120', '144', game.t('unlimited')];
    const btnW = 80;
    const btnH = 30;
    const gap = 14;
    const totalW = fpsOptions.length * btnW + (fpsOptions.length - 1) * gap;
    const startX = cx - totalW / 2;
    const fpsY = cardY + 190;

    for (let i = 0; i < fpsOptions.length; i++) {
      renderToggle(startX + i * (btnW + gap), fpsY, btnW, btnH, fpsLabels[i], game.targetFPS === fpsOptions[i]);
    }

    if (focused) {
      ctx.fillStyle = '#ff3399';
      ctx.font = 'bold 16px "Orbitron", sans-serif';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff3399';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', startX - 25, fpsY + btnH / 2);
      ctx.shadowBlur = 0;
    }
  },

  renderMusicVolumeRow(game, cx, cardY, focused) {
    renderLabel(game.t('musicVolume'), cx, cardY + 240, focused);
    renderArrowBtn(cx - 110, cardY + 255, '-', focused);
    renderProgressBar(cx - 70, cardY + 265, 140, 10, game.musicVolume, '#0ff', focused);
    renderArrowBtn(cx + 80, cardY + 255, '+', focused);
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px "Orbitron", monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${Math.round(game.musicVolume * 100)}%`, cx + 125, cardY + 270);
    ctx.textAlign = 'center';
    if (focused) {
      ctx.fillStyle = '#ff3399';
      ctx.font = 'bold 16px "Orbitron", sans-serif';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff3399';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', cx - 135, cardY + 270);
      ctx.shadowBlur = 0;
    }
  },

  renderSfxVolumeRow(game, cx, cardY, focused) {
    renderLabel(game.t('sfxVolume'), cx, cardY + 305, focused);
    renderArrowBtn(cx - 110, cardY + 320, '-', focused);
    renderProgressBar(cx - 70, cardY + 330, 140, 10, game.sfxVolume, '#0ff', focused);
    renderArrowBtn(cx + 80, cardY + 320, '+', focused);
    ctx.textAlign = 'left';
    ctx.font = 'bold 12px "Orbitron", monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(`${Math.round(game.sfxVolume * 100)}%`, cx + 125, cardY + 335);
    ctx.textAlign = 'center';
    if (focused) {
      ctx.fillStyle = '#ff3399';
      ctx.font = 'bold 16px "Orbitron", sans-serif';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff3399';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', cx - 135, cardY + 335);
      ctx.shadowBlur = 0;
    }
  },

  renderShakeRow(game, cx, cardY, focused) {
    renderLabel(game.t('errorShake'), cx, cardY + 370, focused);
    renderToggle(cx - 110, cardY + 385, 100, 30, 'ON', game.errorShakeEnabled === true);
    renderToggle(cx + 10, cardY + 385, 100, 30, 'OFF', game.errorShakeEnabled === false);
    if (focused) {
      ctx.fillStyle = '#ff3399';
      ctx.font = 'bold 16px "Orbitron", sans-serif';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#ff3399';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', cx - 140, cardY + 400);
      ctx.shadowBlur = 0;
    }
  },

  renderResumeRow(game, cx, cardY, focused) {
    renderButton(cx - 100, cardY + 450, 200, 40, game.t('resume'), focused, {
      borderColor: focused ? '#ff3399' : 'rgba(255,255,255,0.3)',
      fillColor: focused ? 'rgba(255,51,153,0.15)' : 'transparent',
    });
  },

  handleKeyDown(game, e) {
    if (e.key === 'Escape') {
      game.router.go(SCREEN.PLAYING);
      return;
    }

    if (e.key === 'ArrowUp') {
      game.pauseMenuSelectedRow = (game.pauseMenuSelectedRow - 1 + 6) % 6;
    } else if (e.key === 'ArrowDown') {
      game.pauseMenuSelectedRow = (game.pauseMenuSelectedRow + 1) % 6;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      this.handleSettingChange(game, e);
    } else if (e.key === 'Enter') {
      if (game.pauseMenuSelectedRow === 4) {
        game.setErrorShake(!game.errorShakeEnabled);
      } else if (game.pauseMenuSelectedRow === 5) {
        game.router.go(SCREEN.PLAYING);
      }
    }
  },

  handleSettingChange(game, e) {
    const row = game.pauseMenuSelectedRow;
    if (row === 0) {
      game.setLanguage(game.language === 'en' ? 'id' : 'en');
    } else if (row === 1) {
      const fpsOptions = [60, 120, 144, 0];
      let idx = fpsOptions.indexOf(game.targetFPS);
      if (idx === -1) idx = 0;
      idx = e.key === 'ArrowLeft'
        ? (idx - 1 + fpsOptions.length) % fpsOptions.length
        : (idx + 1) % fpsOptions.length;
      game.setFPS(fpsOptions[idx]);
    } else if (row === 2) {
      const change = e.key === 'ArrowLeft' ? -0.1 : 0.1;
      game.setMusicVolume(game.musicVolume + change);
    } else if (row === 3) {
      const change = e.key === 'ArrowLeft' ? -0.1 : 0.1;
      game.setSfxVolume(game.sfxVolume + change);
    } else if (row === 4) {
      game.setErrorShake(!game.errorShakeEnabled);
    }
  },

  handleClick(game, e) {
    const rect = canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (canvas.height / rect.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const cardY = cy - 570 / 2;

    const hit = (x, y, w, h) => clickX >= x && clickX <= x + w && clickY >= y && clickY <= y + h;

    if (hit(cx - 110, cardY + 115, 100, 30)) {
      game.setLanguage('en');
      game.pauseMenuSelectedRow = 0;
    } else if (hit(cx + 10, cardY + 115, 100, 30)) {
      game.setLanguage('id');
      game.pauseMenuSelectedRow = 0;
    }

    const fpsOptions = [60, 120, 144, 0];
    const fpsLabels = ['60', '120', '144', game.t('unlimited')];
    const btnW = 80, gap = 14;
    const totalW = fpsOptions.length * btnW + (fpsOptions.length - 1) * gap;
    const startX = cx - totalW / 2;
    const fpsY = cardY + 190;
    for (let i = 0; i < fpsOptions.length; i++) {
      if (hit(startX + i * (btnW + gap), fpsY, btnW, 30)) {
        game.setFPS(fpsOptions[i]);
        game.pauseMenuSelectedRow = 1;
      }
    }

    if (hit(cx - 110, cardY + 255, 30, 30)) {
      game.setMusicVolume(game.musicVolume - 0.1);
      game.pauseMenuSelectedRow = 2;
    } else if (hit(cx + 80, cardY + 255, 30, 30)) {
      game.setMusicVolume(game.musicVolume + 0.1);
      game.pauseMenuSelectedRow = 2;
    } else if (hit(cx - 70, cardY + 255, 140, 10)) {
      const percent = (clickX - (cx - 70)) / 140;
      game.setMusicVolume(percent);
      game.pauseMenuSelectedRow = 2;
    }

    if (hit(cx - 110, cardY + 320, 30, 30)) {
      game.setSfxVolume(game.sfxVolume - 0.1);
      game.pauseMenuSelectedRow = 3;
    } else if (hit(cx + 80, cardY + 320, 30, 30)) {
      game.setSfxVolume(game.sfxVolume + 0.1);
      game.pauseMenuSelectedRow = 3;
    } else if (hit(cx - 70, cardY + 320, 140, 10)) {
      const percent = (clickX - (cx - 70)) / 140;
      game.setSfxVolume(percent);
      game.pauseMenuSelectedRow = 3;
    }

    if (hit(cx - 110, cardY + 385, 100, 30)) {
      game.setErrorShake(true);
      game.pauseMenuSelectedRow = 4;
    } else if (hit(cx + 10, cardY + 385, 100, 30)) {
      game.setErrorShake(false);
      game.pauseMenuSelectedRow = 4;
    }

    if (hit(cx - 100, cardY + 450, 200, 40)) {
      game.router.go(SCREEN.PLAYING);
    }
  },
};
