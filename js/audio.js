// ─── AUDIO PLACEHOLDER SYSTEM ────────────────────────────────
const getSfxVolume = () => {
  return (typeof window !== 'undefined' && window.game) ? window.game.sfxVolume : 0.5;
};

export const AudioFX = {
  playTyping() {
    const a = new Audio('assets/audio/type.mp3');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
  playLaser() {
    const a = new Audio('assets/audio/laserShoot.wav');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
  playExplosion() {
    const a = new Audio('assets/audio/explosion.wav');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
  playBuff() {
    const a = new Audio('assets/audio/powerUp.wav');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
  playHeal() {
    const a = new Audio('assets/audio/heart.wav');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
  playHit() {
    /* const a = new Audio('assets/audio/hit.mp3'); a.volume = getSfxVolume(); a.play().catch(() => {}); */
  },
  playGameOver() {
    const a = new Audio('assets/audio/gameOver.wav');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
  playErrorType() {
    const a = new Audio('assets/audio/errorType.wav');
    a.volume = getSfxVolume() * 0.6;
    a.play().catch(() => { });
  },
  playScoreUp() {
    const a = new Audio('assets/audio/scoreUpwav.wav');
    a.volume = getSfxVolume();
    a.play().catch(() => { });
  },
};
