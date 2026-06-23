export const canvas = (() => {
  let c = document.getElementById('gameCanvas');
  if (!c) {
    // create a fallback canvas if the element isn't present for any reason
    c = document.createElement('canvas');
    c.id = 'gameCanvas';
    const parent = document.body || document.getElementsByTagName('body')[0] || document.documentElement;
    parent.appendChild(c);
  }
  return c;
})();

export const ctx = canvas.getContext('2d');

// Polyfill for CanvasRenderingContext2D.roundRect on browsers that lack it
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      radius = radius || {tl:0, tr:0, br:0, bl:0};
      radius.tl = radius.tl || 0; radius.tr = radius.tr || 0; radius.br = radius.br || 0; radius.bl = radius.bl || 0;
    }
    this.beginPath();
    this.moveTo(x + radius.tl, y);
    this.lineTo(x + width - radius.tr, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    this.lineTo(x + width, y + height - radius.br);
    this.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    this.lineTo(x + radius.bl, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    this.lineTo(x, y + radius.tl);
    this.quadraticCurveTo(x, y, x + radius.tl, y);
    this.closePath();
  };
}

export function resizeCanvas() {
  canvas.width = window.innerWidth || document.documentElement.clientWidth || 800;
  canvas.height = window.innerHeight || document.documentElement.clientHeight || 600;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Debug: confirm canvas initialized
console.debug('[Game] canvas initialized:', canvas.id, canvas.width + 'x' + canvas.height);
