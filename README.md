# NetRunner: Belajar Mengetik 🚀

A **cyberpunk-themed typing trainer and shooter game** built entirely with vanilla JavaScript (ES6 Modules) and HTML5 Canvas.  
Type words to destroy falling alien/glitch enemies before they breach your system!

## 🎮 Features

- **Typing-based combat** — Type words that appear above aliens to fire lasers
- **4 difficulty tiers** — Easy (3-letter) to Expert (8+ letter) words, auto-scaling with score
- **Bilingual support** — English & Indonesian (switchable mid-game via pause menu)
- **5 Power-ups** — Slow Motion, Double Score, Bomb (screen clear), Shield, Auto Laser
- **Endless progression** — Speed increases every 50 points (up to 4x)
- **Health system** — 3 hearts (max 5 via pickup), shield protection
- **Settings persistence** — Volume, SFX, and high score saved to `localStorage`
- **Visual effects** — Screen shake, particle explosions, scrolling starfield, neon scanlines
- **Audio system** — Background music + 8 SFX (typing, laser, explosion, buffs, etc.)
- **FPS options** — 60 / 120 / 144 / Unlimited

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | **Vanilla JavaScript** (ES6 Modules) |
| Rendering | **HTML5 Canvas 2D** |
| Game Loop | **requestAnimationFrame** |
| Audio | **Web Audio API** |
| Storage | **localStorage** |
| Fonts | Google Fonts — Orbitron, Share Tech Mono |
| Build | **None — zero dependencies** |

## 🚀 Getting Started

### Play Online
_[Add deployment link here]_

### Run Locally (via IDE)

> ⚠️ **Important**: Because this game uses **ES6 Modules** (`import`/`export`), you **must** serve it via an HTTP server. Opening `index.html` directly (`file://` protocol) will not work.

#### VS Code (recommended)

**Option A — Live Server extension** (easiest):
1. Install the **Live Server** extension (by Ritwick Dey).
2. Right-click `index.html` → **Open with Live Server**.

**Option B — Built-in terminal** (no extension needed):

Depending on what tools you have installed on your machine, you can run any of the following commands in the project directory:

- **Node.js (NPM)**:
  ```bash
  npx serve .
  ```
  Then open the URL displayed in the terminal (usually **http://localhost:3000**).

- **Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Then open **http://localhost:8000** in your browser.

- **PHP**:
  ```bash
  php -S localhost:8000
  ```
  Then open **http://localhost:8000** in your browser.

#### Other IDEs

Use the IDE's integrated terminal to run one of the commands above, or install a live-reload extension for your editor.

## 🎯 How to Play

1. **Words** appear above falling aliens
2. **Type** the word correctly to fire a laser and destroy the alien
3. **Miss** or mistype and you'll take damage (lose a heart)
4. **Collect** power-ups (Lucky Boxes) and extra hearts
5. **Survive** as long as possible and beat your high score!

### Controls

| Key | Action |
|-----|--------|
| `A-Z` | Type letters |
| `Backspace` | Delete last letter |
| `Escape` | Pause / Resume |
| Mouse | Click menu buttons, toggle settings |

### Power-ups

| Icon | Name | Effect |
|------|------|--------|
| 🌀 | Slow Motion | Slows alien movement for 10s |
| ✖️ | Double Score | 2x points for 10s |
| 💣 | Bomb | Destroys all aliens on screen |
| 🛡️ | Shield | Blocks one hit |
| ⚡ | Auto Laser | Auto-completes words for 10s |

## 📁 Project Structure

```
├── index.html              # Entry point
├── css/
│   └── style.css           # Minimal styling
├── js/
│   ├── main.js             # Game bootstrapper (thin entry point)
│   ├── core/               # Core game systems
│   │   ├── game.js         # State, update loop, spawning, collisions
│   │   ├── input.js        # Keyboard & mouse input, pause navigation
│   │   ├── canvas.js       # Canvas singleton & resize handling
│   │   ├── audio.js        # SFX & music (pre-cached via cloneNode)
│   │   └── utils.js        # Math utilities (randInt, clamp, lerp, dist)
│   ├── config/             # Static data & configuration
│   │   ├── config.js       # Game constants, UI text, buffs, image preload
│   │   └── wordbanks/      # Word banks — per language & difficulty
│   │       ├── index.js    # Aggregator, exports getWordBanks()
│   │       ├── en/         # English words
│   │       │   ├── easy.js
│   │       │   ├── medium.js
│   │       │   ├── hard.js
│   │       │   └── expert.js
│   │       └── id/         # Indonesian words
│   │           ├── easy.js
│   │           ├── medium.js
│   │           ├── hard.js
│   │           └── expert.js
│   ├── rendering/          # All canvas drawing, one concern per file
│   │   ├── effects.js      # Scanlines, grid, heart shape (shared)
│   │   ├── player.js       # Player ship + shield drawing
│   │   ├── entity.js       # Entity drawing + word labels
│   │   ├── hud.js          # Score, HP, buff bar, typing box
│   │   └── menus.js        # Menu, game over, pause screens
│   └── entities/           # Game entity classes
│       ├── entity.js       # Base entity (alien / power-up / heart)
│       ├── bullet.js       # Laser bullet with trail effect
│       ├── particle.js     # Explosion debris particles
│       └── star.js         # Scrolling parallax starfield
└── assets/
    └── audio/              # Audio files (MP3 + WAV)
```

## 🛠️ Development

### Adding Words

Edit the files under `js/config/wordbanks/` — each difficulty tier has its own file per language:

- `en/easy.js`, `en/medium.js`, `en/hard.js`, `en/expert.js` — English
- `id/easy.js`, `id/medium.js`, `id/hard.js`, `id/expert.js` — Indonesian

Each file exports a single `default` array of words. The aggregator `index.js` composes them into `WORD_BANKS_EN` / `WORD_BANKS_ID`.

### Adding Power-ups

Add a new entry to `BUFF_TYPES` in `js/config/config.js` and implement its effect in `js/core/game.js`.

### Code Conventions

- **One module, one concern** — each file has a single responsibility
- **No global state** — all shared state lives in the `Game` instance, passed explicitly
- **No `window.game`** — audio volume is injected via `AudioFX.setVolume()`
- **ES Modules** — all imports/exports are explicit; zero global leak

## 📝 License

_[Add license here]_
