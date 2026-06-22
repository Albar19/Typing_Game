import { canvas, ctx } from './canvas.js';
import { CONFIG, IMAGES } from './config.js';

export function drawHeartShape(cx, cy, size) {
  const w = size, h = size;
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.15);
  ctx.bezierCurveTo(cx, cy - h * 0.55, cx - w * 0.55, cy - h * 0.55, cx - w * 0.55, cy - h * 0.15);
  ctx.bezierCurveTo(cx - w * 0.55, cy + h * 0.15, cx, cy + h * 0.35, cx, cy + h * 0.55);
  ctx.bezierCurveTo(cx, cy + h * 0.35, cx + w * 0.55, cy + h * 0.15, cx + w * 0.55, cy - h * 0.15);
  ctx.bezierCurveTo(cx + w * 0.55, cy - h * 0.55, cx, cy - h * 0.55, cx, cy - h * 0.15);
  ctx.closePath();
}

export function renderGrid() {
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  const gridSize = 80;
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

export function renderScanlines(game) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  for (let y = game.scanlineOffset; y < canvas.height; y += 4) {
    ctx.fillRect(0, y, canvas.width, 2);
  }
}

export function renderPlayer(game) {
  const px = game.playerX;
  const py = game.playerY;
  const s = CONFIG.PLAYER_SIZE;

  if (IMAGES.player) {
    ctx.drawImage(IMAGES.player, px - s / 2, py - s / 2, s, s);
    return;
  }

  const pulse = 0.85 + 0.15 * Math.sin(game.gameTime * 4);

  ctx.shadowBlur = 25;
  ctx.shadowColor = '#0ff';
  ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * pulse})`;
  ctx.beginPath();
  ctx.moveTo(px - s * 0.25, py + s * 0.3);
  ctx.lineTo(px, py + s * 0.6);
  ctx.lineTo(px + s * 0.25, py + s * 0.3);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 18;
  ctx.shadowColor = '#0ff';
  ctx.strokeStyle = `rgba(0, 255, 255, ${pulse})`;
  ctx.lineWidth = 2.5;
  ctx.fillStyle = 'rgba(0, 30, 50, 0.8)';

  ctx.beginPath();
  ctx.moveTo(px, py - s * 0.5);
  ctx.lineTo(px - s * 0.38, py + s * 0.3);
  ctx.lineTo(px - s * 0.12, py + s * 0.2);
  ctx.lineTo(px, py + s * 0.35);
  ctx.lineTo(px + s * 0.12, py + s * 0.2);
  ctx.lineTo(px + s * 0.38, py + s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + 0.3 * pulse})`;
  ctx.beginPath();
  ctx.moveTo(px, py - s * 0.2);
  ctx.lineTo(px - s * 0.08, py);
  ctx.lineTo(px, py + s * 0.1);
  ctx.lineTo(px + s * 0.08, py);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;

  if (game.hasShield) {
    const shieldPulse = 0.6 + 0.4 * Math.sin(game.gameTime * 3);
    const shieldRadius = s * 0.65;
    ctx.beginPath();
    ctx.arc(px, py, shieldRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 255, 136, ${0.5 * shieldPulse})`;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 18;
    ctx.shadowColor = '#00ff88';
    ctx.stroke();
    ctx.fillStyle = `rgba(0, 255, 136, ${0.06 * shieldPulse})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  if (game.shieldFlashTimer > 0) {
    const t = game.shieldFlashTimer;
    const breakRadius = s * 0.65 + (1 - t) * 40;
    ctx.beginPath();
    ctx.arc(px, py, breakRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = `rgba(0, 255, 136, ${t * 0.8})`;
    ctx.lineWidth = 3 * t;
    ctx.shadowBlur = 20 * t;
    ctx.shadowColor = '#00ff88';
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}

function renderTargetReticle(game, cx, cy, size) {
  const r = size * 0.7;
  const angle = game.gameTime * 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#0ff';

  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate((Math.PI / 2) * i);
    ctx.beginPath();
    ctx.moveTo(r, r * 0.4);
    ctx.lineTo(r, r);
    ctx.lineTo(r * 0.4, r);
    ctx.stroke();
    ctx.restore();
  }

  ctx.shadowBlur = 0;
  ctx.restore();
}

function renderWordLabel(e) {
  const word = e.word;
  const fontSize = 16;
  ctx.font = `bold ${fontSize}px 'Share Tech Mono', monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  const labelY = e.cy - e.size * 0.55 - 8;

  const textWidth = ctx.measureText(word).width;
  const pillPadX = 8, pillPadY = 4;
  const pillX = e.cx - textWidth / 2 - pillPadX;
  const pillY = labelY - fontSize - pillPadY;
  const pillW = textWidth + pillPadX * 2;
  const pillH = fontSize + pillPadY * 2;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 5);
  ctx.fill();

  const borderColors = {
    alien: 'rgba(255, 50, 50, 0.6)',
    luckybox: 'rgba(255, 215, 0, 0.6)',
    heart: 'rgba(255, 105, 180, 0.6)',
  };
  if (e.isTargeted) {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = borderColors[e.type] || 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  const totalWidth = ctx.measureText(word).width;
  let startX = e.cx - totalWidth / 2;

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const charW = ctx.measureText(ch).width;

    if (i < e.typedIndex) {
      ctx.fillStyle = '#39ff14';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#39ff14';
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowBlur = 0;
    }
    ctx.textAlign = 'left';
    ctx.fillText(ch, startX, labelY);
    startX += charW;
  }
  ctx.shadowBlur = 0;
  ctx.textAlign = 'center';
}

export function renderEntity(game, e) {
  const s = e.size;
  const pulse = 0.8 + 0.2 * Math.sin(e.pulsePhase);
  const cx = e.cx;
  const cy = e.cy;

  if (e.isTargeted) {
    renderTargetReticle(game, cx, cy, s);
  }

  if (e.type === 'alien') {
    if (IMAGES.alien) {
      ctx.drawImage(IMAGES.alien, cx - s / 2, cy - s / 2, s, s);
    } else {
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#ff3333';
      ctx.strokeStyle = `rgba(255, 50, 50, ${pulse})`;
      ctx.fillStyle = 'rgba(80, 10, 10, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + (s * 0.45) * Math.cos(angle);
        const hy = cy + (s * 0.45) * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = `rgba(255, 80, 80, ${pulse})`;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  else if (e.type === 'luckybox') {
    if (IMAGES.lucky) {
      ctx.drawImage(IMAGES.lucky, cx - s / 2, cy - s / 2, s, s);
    } else {
      const rotAngle = game.gameTime * 1.5;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotAngle);
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ffd700';
      ctx.strokeStyle = `rgba(255, 215, 0, ${pulse})`;
      ctx.fillStyle = 'rgba(80, 60, 0, 0.6)';
      ctx.lineWidth = 2.5;
      const hs = s * 0.38;
      ctx.beginPath();
      ctx.moveTo(0, -hs);
      ctx.lineTo(hs, 0);
      ctx.lineTo(0, hs);
      ctx.lineTo(-hs, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 150, ${0.5 * pulse})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, -hs * 0.5); ctx.lineTo(0, hs * 0.5);
      ctx.moveTo(-hs * 0.5, 0); ctx.lineTo(hs * 0.5, 0);
      ctx.stroke();

      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }
  else if (e.type === 'heart') {
    if (IMAGES.heart) {
      ctx.drawImage(IMAGES.heart, cx - s / 2, cy - s / 2, s, s);
    } else {
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#ff69b4';
      ctx.strokeStyle = `rgba(255, 105, 180, ${pulse})`;
      ctx.fillStyle = 'rgba(100, 20, 50, 0.6)';
      ctx.lineWidth = 2;
      drawHeartShape(cx, cy, s * 0.45);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  renderWordLabel(e);
}

function renderHearts(game) {
  const pad = 20;
  const heartSize = 10;
  const gap = 6;
  const startX = pad;
  const y = canvas.height - 20;

  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText('HP', startX, y - heartSize - 2);

  for (let i = 0; i < CONFIG.PLAYER_MAX_HEARTS; i++) {
    const hx = startX + i * (heartSize * 2 + gap) + heartSize;
    const hy = y;

    if (i < game.hearts) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff1493';
      ctx.fillStyle = '#ff1493';
      ctx.strokeStyle = '#ff69b4';
    } else {
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(60, 20, 30, 0.6)';
      ctx.strokeStyle = 'rgba(255, 105, 180, 0.25)';
    }

    ctx.lineWidth = 1.5;
    drawHeartShape(hx, hy, heartSize);
    ctx.fill();
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

function renderTypingBox(game) {
  const cx = canvas.width / 2;
  const w = 360;
  const h = 42;
  const bx = cx - w / 2;
  const by = canvas.height - 70;

  ctx.fillStyle = 'rgba(10, 10, 25, 0.85)';
  ctx.beginPath();
  ctx.roundRect(bx, by, w, h, 6);
  ctx.fill();

  const hasTarget = !!game.currentTarget;
  if (hasTarget) {
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 0;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.textBaseline = 'middle';
  if (!hasTarget) {
    ctx.font = '13px "Orbitron", monospace';
    ctx.fillStyle = 'rgba(0, 255, 255, 0.4)';
    ctx.textAlign = 'center';
    ctx.fillText(game.t('typeHere'), cx, by + h / 2);
  } else {
    const word = game.currentTarget.word;
    ctx.font = 'bold 20px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';

    const totalWidth = ctx.measureText(word).width;
    let startX = cx - totalWidth / 2;

    for (let i = 0; i < word.length; i++) {
      const ch = word[i];
      const charW = ctx.measureText(ch).width;

      ctx.textAlign = 'left';
      if (i < game.currentTarget.typedIndex) {
        ctx.fillStyle = '#39ff14';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#39ff14';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.shadowBlur = 0;
      }
      ctx.fillText(ch, startX, by + h / 2);
      startX += charW;
    }
    ctx.shadowBlur = 0;
  }
}

export function renderHUD(game) {
  const pad = 20;

  ctx.font = 'bold 22px "Orbitron", monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#0ff';
  ctx.fillStyle = '#0ff';
  ctx.fillText(game.t('score'), pad, pad);
  ctx.font = 'bold 32px "Orbitron", monospace';
  ctx.fillText(`${game.score}`, pad, pad + 26);
  ctx.shadowBlur = 0;

  ctx.font = '14px "Share Tech Mono", monospace';
  ctx.fillStyle = '#888';
  ctx.fillText(`${game.t('speed')}: ${game.gameSpeed.toFixed(2)}x`, pad, pad + 64);
  ctx.fillText(`${game.t('lvl')}: ${game.speedLevel}`, pad, pad + 82);

  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.font = 'bold 16px "Orbitron", monospace';
  ctx.fillStyle = '#ffd700';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#ffd700';
  ctx.fillText(`HI-SCORE: ${game.highScore}`, canvas.width - pad, pad);
  ctx.shadowBlur = 0;

  ctx.font = '13px "Share Tech Mono", monospace';
  ctx.fillStyle = game.currentFPS >= 50 ? '#39ff14' : game.currentFPS >= 25 ? '#ffd700' : '#ff3333';
  ctx.fillText(`${game.currentFPS} FPS`, canvas.width - pad, pad + 24);

  renderHearts(game);

  let buffBarBottomY = pad + 10;
  if (game.activeBuff) {
    const bx = canvas.width / 2;
    const by = pad + 10;
    const buffText = `⚡ ${game.activeBuff.name} (${game.activeBuff.timer.toFixed(1)}s)`;
    ctx.font = 'bold 16px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const bw = ctx.measureText(buffText).width + 32;
    const bh = 32;
    const boxX = bx - bw / 2;
    const boxY = by;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, bw, bh, 6);
    ctx.fill();

    ctx.strokeStyle = game.activeBuff.color;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = game.activeBuff.color;
    ctx.stroke();

    ctx.fillStyle = game.activeBuff.color;
    ctx.fillText(buffText, bx, boxY + bh / 2);

    const progress = game.activeBuff.timer / (CONFIG.BUFF_DURATION_MS / 1000);
    ctx.fillStyle = game.activeBuff.color;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(boxX + 2, boxY + bh - 5, (bw - 4) * progress, 3);
    ctx.globalAlpha = 1;

    ctx.shadowBlur = 0;
    buffBarBottomY = by + bh + 6;
  }

  if (game.hasShield) {
    const bx = canvas.width / 2;
    const by = buffBarBottomY;
    const shieldLabel = game.t('buffShield');
    const shieldText = `🛡 ${shieldLabel}`;
    ctx.font = 'bold 14px "Orbitron", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const sw = ctx.measureText(shieldText).width + 28;
    const sh = 28;
    const sBoxX = bx - sw / 2;
    const sBoxY = by;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.beginPath();
    ctx.roundRect(sBoxX, sBoxY, sw, sh, 5);
    ctx.fill();

    const shieldPulse = 0.6 + 0.4 * Math.sin(game.gameTime * 3);
    ctx.strokeStyle = `rgba(0, 255, 136, ${shieldPulse})`;
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00ff88';
    ctx.stroke();

    ctx.fillStyle = `rgba(0, 255, 136, ${0.7 + 0.3 * shieldPulse})`;
    ctx.fillText(shieldText, bx, sBoxY + sh / 2);
    ctx.shadowBlur = 0;
  }

  renderTypingBox(game);
}

export function renderMenu(game) {
  ctx.fillStyle = 'rgba(5, 5, 15, 0.85)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#0ff';
  ctx.fillStyle = '#0ff';
  ctx.font = 'bold 48px "Orbitron", sans-serif';
  ctx.fillText(game.t('titleLine1'), cx, cy - 90);
  ctx.font = 'bold 56px "Orbitron", sans-serif';
  ctx.fillStyle = '#fff';
  ctx.shadowColor = '#ff3399';
  ctx.fillText(game.t('titleLine2'), cx, cy - 35);
  ctx.shadowBlur = 0;

  const lineW = 300;
  const grad = ctx.createLinearGradient(cx - lineW / 2, 0, cx + lineW / 2, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.3, '#0ff');
  grad.addColorStop(0.7, '#ff3399');
  grad.addColorStop(1, 'transparent');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - lineW / 2, cy + 5);
  ctx.lineTo(cx + lineW / 2, cy + 5);
  ctx.stroke();

  ctx.font = '15px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.fillText(game.t('instruction1'), cx, cy + 50);
  ctx.fillText(game.t('instruction2'), cx, cy + 75);

  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
  ctx.font = 'bold 20px "Orbitron", sans-serif';
  ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + 0.6 * pulse})`;
  ctx.shadowBlur = 12 * pulse;
  ctx.shadowColor = '#0ff';
  ctx.fillText(game.t('pressStart'), cx, cy + 130);
  ctx.shadowBlur = 0;

  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillText(game.t('version'), cx, canvas.height - 30);
}

export function renderGameOver(game) {
  ctx.fillStyle = 'rgba(5, 0, 10, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ff0044';
  ctx.fillStyle = '#ff0044';
  ctx.font = 'bold 60px "Orbitron", sans-serif';
  ctx.fillText(game.t('gameOver'), cx, cy - 70);
  ctx.shadowBlur = 0;

  ctx.font = '18px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText(game.t('finalScore'), cx, cy - 10);
  ctx.font = 'bold 48px "Orbitron", sans-serif';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#ffd700';
  ctx.fillStyle = '#ffd700';
  ctx.fillText(`${game.score}`, cx, cy + 35);
  ctx.shadowBlur = 0;

  ctx.font = '14px "Share Tech Mono", monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.fillText(`${game.t('maxSpeed')}: ${game.gameSpeed.toFixed(2)}x  ·  ${game.t('level')}: ${game.speedLevel}`, cx, cy + 80);

  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
  ctx.font = 'bold 18px "Orbitron", sans-serif';
  ctx.fillStyle = `rgba(0, 255, 255, ${0.4 + 0.6 * pulse})`;
  ctx.shadowBlur = 10 * pulse;
  ctx.shadowColor = '#0ff';
  ctx.fillText(game.t('pressRestart'), cx, cy + 130);
  ctx.shadowBlur = 0;
}

export function renderPauseMenu(game) {
  ctx.fillStyle = 'rgba(5, 5, 15, 0.82)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

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

  const row0Focused = game.pauseMenuSelectedRow === 0;
  ctx.font = 'bold 13px "Orbitron", monospace';
  ctx.fillStyle = row0Focused ? '#ff3399' : '#888';
  if (row0Focused) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff3399';
  }
  ctx.fillText(game.t('language'), cx, cardY + 100);
  ctx.shadowBlur = 0;

  const enSelected = game.language === 'en';
  const enX = cx - 110;
  const enY = cardY + 115;
  ctx.beginPath();
  ctx.roundRect(enX, enY, 100, 30, 5);
  if (enSelected) {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = enSelected ? '#0ff' : '#fff';
  ctx.font = 'bold 12px "Orbitron", monospace';
  ctx.fillText('ENGLISH', cx - 60, cardY + 130);

  const idSelected = game.language === 'id';
  const idX = cx + 10;
  const idY = cardY + 115;
  ctx.beginPath();
  ctx.roundRect(idX, idY, 100, 30, 5);
  if (idSelected) {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = idSelected ? '#0ff' : '#fff';
  ctx.fillText('INDONESIA', cx + 60, cardY + 130);

  const row1Focused = game.pauseMenuSelectedRow === 1;
  ctx.font = 'bold 13px "Orbitron", monospace';
  ctx.fillStyle = row1Focused ? '#ff3399' : '#888';
  if (row1Focused) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff3399';
  }
  ctx.fillText(game.t('refreshRate'), cx, cardY + 175);
  ctx.shadowBlur = 0;

  const fpsOptions = [60, 120, 144, 0];
  const fpsLabels = ['60', '120', '144', game.t('unlimited')];
  const btnW = 80;
  const btnH = 30;
  const fpsGap = 14;
  const totalW = fpsOptions.length * btnW + (fpsOptions.length - 1) * fpsGap;
  const startX = cx - totalW / 2;
  const fpsY = cardY + 190;

  for (let i = 0; i < fpsOptions.length; i++) {
    const opt = fpsOptions[i];
    const lbl = fpsLabels[i];
    const selected = game.targetFPS === opt;
    const x = startX + i * (btnW + fpsGap);

    ctx.beginPath();
    ctx.roundRect(x, fpsY, btnW, btnH, 5);
    if (selected) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = '#0ff';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#0ff';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = selected ? '#0ff' : '#fff';
    ctx.font = 'bold 11px "Orbitron", monospace';
    ctx.fillText(lbl, x + btnW / 2, fpsY + btnH / 2);
  }

  const row2Focused = game.pauseMenuSelectedRow === 2;
  ctx.font = 'bold 13px "Orbitron", monospace';
  ctx.fillStyle = row2Focused ? '#ff3399' : '#888';
  if (row2Focused) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff3399';
  }
  ctx.fillText(game.t('musicVolume'), cx, cardY + 240);
  ctx.shadowBlur = 0;

  const mDecX = cx - 110;
  const mDecY = cardY + 255;
  ctx.beginPath();
  ctx.roundRect(mDecX, mDecY, 30, 30, 5);
  ctx.strokeStyle = row2Focused ? '#ff3399' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Orbitron", monospace';
  ctx.fillText('-', mDecX + 15, mDecY + 15);

  const mBarX = cx - 70;
  const mBarY = cardY + 265;
  const mBarW = 140;
  const mBarH = 10;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(mBarX, mBarY, mBarW, mBarH);
  ctx.fillStyle = '#0ff';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#0ff';
  ctx.fillRect(mBarX, mBarY, mBarW * game.musicVolume, mBarH);
  ctx.shadowBlur = 0;

  const mIncX = cx + 80;
  const mIncY = cardY + 255;
  ctx.beginPath();
  ctx.roundRect(mIncX, mIncY, 30, 30, 5);
  ctx.strokeStyle = row2Focused ? '#ff3399' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Orbitron", monospace';
  ctx.fillText('+', mIncX + 15, mIncY + 15);

  ctx.textAlign = 'left';
  ctx.font = 'bold 12px "Orbitron", monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${Math.round(game.musicVolume * 100)}%`, cx + 125, cardY + 270);
  ctx.textAlign = 'center';

  const row3Focused = game.pauseMenuSelectedRow === 3;
  ctx.font = 'bold 13px "Orbitron", monospace';
  ctx.fillStyle = row3Focused ? '#ff3399' : '#888';
  if (row3Focused) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff3399';
  }
  ctx.fillText(game.t('sfxVolume'), cx, cardY + 305);
  ctx.shadowBlur = 0;

  const sDecX = cx - 110;
  const sDecY = cardY + 320;
  ctx.beginPath();
  ctx.roundRect(sDecX, sDecY, 30, 30, 5);
  ctx.strokeStyle = row3Focused ? '#ff3399' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Orbitron", monospace';
  ctx.fillText('-', sDecX + 15, sDecY + 15);

  const sBarX = cx - 70;
  const sBarY = cardY + 330;
  const sBarW = 140;
  const sBarH = 10;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(sBarX, sBarY, sBarW, sBarH);
  ctx.fillStyle = '#0ff';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#0ff';
  ctx.fillRect(sBarX, sBarY, sBarW * game.sfxVolume, sBarH);
  ctx.shadowBlur = 0;

  const sIncX = cx + 80;
  const sIncY = cardY + 320;
  ctx.beginPath();
  ctx.roundRect(sIncX, sIncY, 30, 30, 5);
  ctx.strokeStyle = row3Focused ? '#ff3399' : 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 14px "Orbitron", monospace';
  ctx.fillText('+', sIncX + 15, sIncY + 15);

  ctx.textAlign = 'left';
  ctx.font = 'bold 12px "Orbitron", monospace';
  ctx.fillStyle = '#fff';
  ctx.fillText(`${Math.round(game.sfxVolume * 100)}%`, cx + 125, cardY + 335);
  ctx.textAlign = 'center';

  const row4Focused = game.pauseMenuSelectedRow === 4;
  ctx.font = 'bold 13px "Orbitron", monospace';
  ctx.fillStyle = row4Focused ? '#ff3399' : '#888';
  if (row4Focused) {
    ctx.shadowBlur = 6;
    ctx.shadowColor = '#ff3399';
  }
  ctx.fillText(game.t('errorShake'), cx, cardY + 370);
  ctx.shadowBlur = 0;

  const shakeOnSelected = game.errorShakeEnabled === true;
  const shakeOnX = cx - 110;
  const shakeOnY = cardY + 385;
  ctx.beginPath();
  ctx.roundRect(shakeOnX, shakeOnY, 100, 30, 5);
  if (shakeOnSelected) {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = shakeOnSelected ? '#0ff' : '#fff';
  ctx.font = 'bold 12px "Orbitron", monospace';
  ctx.fillText('ON', cx - 60, cardY + 400);

  const shakeOffSelected = game.errorShakeEnabled === false;
  const shakeOffX = cx + 10;
  const shakeOffY = cardY + 385;
  ctx.beginPath();
  ctx.roundRect(shakeOffX, shakeOffY, 100, 30, 5);
  if (shakeOffSelected) {
    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.fill();
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#0ff';
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = shakeOffSelected ? '#0ff' : '#fff';
  ctx.fillText('OFF', cx + 60, cardY + 400);

  const row5Focused = game.pauseMenuSelectedRow === 5;
  const resX = cx - 100;
  const resY = cardY + 450;
  const resW = 200;
  const resH = 40;

  ctx.beginPath();
  ctx.roundRect(resX, resY, resW, resH, 6);
  if (row5Focused) {
    const pulse = 0.8 + 0.2 * Math.sin(performance.now() / 200);
    ctx.fillStyle = `rgba(255, 51, 153, ${0.15 * pulse})`;
    ctx.fill();
    ctx.strokeStyle = '#ff3399';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12 * pulse;
    ctx.shadowColor = '#ff3399';
  } else {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  ctx.font = 'bold 15px "Orbitron", sans-serif';
  ctx.fillStyle = row5Focused ? '#ff3399' : '#fff';
  ctx.fillText(game.t('resume'), cx, resY + resH / 2);

  ctx.fillStyle = '#ff3399';
  ctx.font = 'bold 16px "Orbitron", sans-serif';
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#ff3399';
  if (row0Focused) {
    ctx.fillText('>', cx - 140, cardY + 130);
  } else if (row1Focused) {
    ctx.fillText('>', startX - 25, fpsY + btnH / 2);
  } else if (row2Focused) {
    ctx.fillText('>', mDecX - 25, mDecY + 15);
  } else if (row3Focused) {
    ctx.fillText('>', sDecX - 25, sDecY + 15);
  } else if (row4Focused) {
    ctx.fillText('>', shakeOnX - 25, shakeOnY + 15);
  } else if (row5Focused) {
    ctx.fillText('>', cx - 125, resY + resH / 2);
  }
  ctx.shadowBlur = 0;

  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 400);
  ctx.font = '11px "Share Tech Mono", monospace';
  ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + 0.3 * pulse})`;
  ctx.fillText(game.t('pressEscResume'), cx, cardY + 535);
}
