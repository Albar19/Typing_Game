// ─── AUDIO SYSTEM ────────────────────────────────────────────
let sfxVolume = 0.5;
const cache = {};

function getAudio(src) {
  if (!cache[src]) {
    cache[src] = new Audio(src);
  }
  return cache[src].cloneNode();
}

function play(src, volMul = 1) {
  const a = getAudio(src);
  a.volume = sfxVolume * volMul;
  a.play().catch(() => {});
}

export function setVolume(vol) {
  sfxVolume = vol;
}

export const AudioFX = {
  playTyping()    { play('assets/audio/type.mp3'); },
  playLaser()     { play('assets/audio/laserShoot.wav'); },
  playExplosion() { play('assets/audio/explosion.wav'); },
  playBuff()      { play('assets/audio/powerUp.wav'); },
  playHeal()      { play('assets/audio/heart.wav'); },
  playHit()       { /* placeholder */ },
  playGameOver()  { play('assets/audio/gameOver.wav'); },
  playErrorType() { play('assets/audio/errorType.wav', 0.6); },
  playScoreUp()   { play('assets/audio/scoreUpwav.wav'); },
};
