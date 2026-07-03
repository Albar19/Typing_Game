# NetRunner: Belajar Mengetik 🚀

A **cyberpunk-themed typing trainer and shooter game** built entirely with vanilla JavaScript (ES6 Modules) and HTML5 Canvas.  
Type words to destroy falling alien/glitch enemies before they breach your system!

## 🎮 Features

- **Typing-based combat** — Type words that appear above aliens to fire lasers
- **4 alien types** — Normal, Speedy (fast & small), Tank (slow, big, high score), Zigzag (sinusoidal movement)
- **Combo/Streak system** — Build combos for score multiplier (up to 2x at 100 streak); progress bar per 10 hits
- **4 difficulty tiers** — Easy (3-letter) to Expert (8+ letter) words, auto-scaling with score
- **Auto-targeting** — First letter typed auto-targets the lowest alien with matching initial
- **Bilingual support** — English & Indonesian (switchable mid-game via pause menu)
- **5 Power-ups** — Slow Motion, Double Score, Bomb (screen clear), Shield, Auto Laser
- **Endless progression** — Speed increases every 50 points (up to 4x)
- **Health system** — 3 hearts (max 5 via pickup), shield protection with break animation
- **Settings persistence** — Volume, SFX, error shake, and high score saved to `localStorage`
- **Visual effects** — Screen shake, particle explosions, scrolling starfield, neon scanlines, screen flash on hit
- **Audio system** — Background music + 9 SFX (typing, laser, explosion, buffs, heal, hit, game over, error type, score milestone)
- **FPS options** — 60 / 120 / 144 / Unlimited (uses `requestAnimationFrame` or `setTimeout(0)` fallback)
- **Auto-pause** — Pauses automatically when tab loses focus

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
| `A-Z` | Type letters — auto-targets lowest alien with matching first letter |
| `Backspace` | Clear current typing target (reset word progress) |
| `Escape` | Pause / Resume |
| `Arrow Up/Down` | Navigate pause menu rows |
| `Arrow Left/Right` | Adjust settings (FPS, volume) in pause menu |
| `Enter` | Start game, restart, toggle settings |
| Mouse | Click menu buttons, toggle settings |

### Power-ups

| Icon | Name | Effect |
|------|------|--------|
| 🌀 | Slow Motion | Slows alien movement for 10s |
| ✖️ | Double Score | 2x points for 10s |
| 💣 | Bomb | Destroys all aliens on screen |
| 🛡️ | Shield | Blocks one hit |
| ⚡ | Auto Laser | Auto-completes words for 10s |

### Enemy Types

| Type | Visual | Behavior | Score |
|------|--------|----------|-------|
| Normal | Red hexagon | Falls straight down | 10 pts |
| Speedy | Cyan, smaller | Falls 25% faster, easy words | 15 pts |
| Tank | Purple, larger | Falls 55% slower, hard words, tanky | 30 pts |
| Zigzag | Green | Sinusoidal horizontal movement | 20 pts |

### Combo System

- **Building combos** — Each correctly typed letter increments your streak
- **Score multiplier** — Every 10 consecutive hits adds +0.1x multiplier (up to 2.0x at 100 streak)
- **Progress bar** — Visual indicator shows progress toward next multiplier tier
- **Breaking combo** — Mistyping or missing a word resets combo to 0
- **High combo glow** — Streak ≥ 10 highlights the counter in green with neon glow

## 📁 Project Structure

```
├── index.html              # Entry point
├── css/
│   └── style.css           # Minimal styling
├── js/
│   ├── main.js             # Game bootstrapper (thin entry point)
│   ├── core/               # Core game systems
│   │   ├── game.js         # State, update loop, spawning, collisions, buffs
│   │   ├── input.js        # Keyboard & mouse input, auto-pause on tab switch
│   │   ├── canvas.js       # Canvas singleton & resize handling
│   │   ├── audio.js        # SFX & music (pre-cached via cloneNode)
│   │   ├── router.js       # Screen state machine (Menu → Playing → Paused → GameOver)
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
│   │   ├── player.js       # Player ship + shield drawing & break animation
│   │   ├── entity.js       # Entity drawing + word label with typed highlighting
│   │   └── hud.js          # Score, HP, buff bar, combo meter, typing box
│   ├── screens/            # Screen logic (update, render, key/mouse handlers)
│   │   ├── screenMenu.js   # Main menu screen
│   │   ├── screenPlaying.js# Active gameplay screen (input handling, typing)
│   │   ├── screenPaused.js # Pause menu with settings (language, FPS, volume, shake)
│   │   └── screenGameOver.js# Game over screen with final score
│   ├── ui/                 # Reusable UI components
│   │   └── button.js       # Button, toggle, arrow button, label, progress bar
│   └── entities/           # Game entity classes
│       ├── entity.js       # Base entity (alien types / power-up / heart)
│       ├── bullet.js       # Laser bullet with trail effect
│       ├── particle.js     # Explosion debris particles
│       └── star.js         # Scrolling parallax starfield
└── assets/
    ├── audio/              # Audio files (MP3 + WAV)
    └── images/             # Game sprites (optional — fallback drawing included)
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
- **Screen Router pattern** — each screen (`screenMenu`, `screenPlaying`, etc.) is an object with `update()`, `render()`, `handleKeyDown()`, `handleClick()`, `onEnter()`, `onExit()` methods, registered in `Router`

## 📝 License

_[Add license here]_
