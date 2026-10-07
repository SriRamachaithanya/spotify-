# 🎵 Spotify Web Player Clone

An ultra-modern, high-performance **Spotify Web Player** built with modern Vanilla HTML5/CSS3/JavaScript and a custom **Node.js Audio Streaming Backend** supporting HTTP 206 Partial Content byte-range requests for lag-free audio streaming and scrubbing.

---

## ✨ Features

- 🎧 **High-Fidelity Audio Playback**: Instant streaming and smooth scrubbing with HTTP 206 byte-range audio chunk support.
- 🎨 **Modern 2026 UI/UX**:
  - Deep obsidian dark canvas (`#000000` / `#0b0e15`) with glassmorphic top navigation bar.
  - Electric Blue master controls (`#0075ff`), luminous progress fill, and high-visibility solid white scrubber knobs.
  - Animated live audio equalizer bars on active playing tracks.
  - Interactive hero banner and quick-play playlist cards.
- 🔍 **Instant Search & Filter**: Real-time filtering by track title, artist name, and album tag, with playlist filter pills (*All Tracks*, *NCS Releases*, *Electronic*, *Liked Only*).
- 🔁 **Advanced Playback Modes**:
  - Master Play / Pause
  - Next / Previous track with wraparound
  - Random True Shuffle
  - 3-State Loop (*Off* ➔ *Repeat All* ➔ *Repeat One*)
- ❤️ **Favorites & Persistence**: Heart songs with local storage state persistence.
- ⌨️ **Keyboard Shortcuts**:
  - <kbd>Space</kbd> : Play / Pause
  - <kbd>→</kbd> / <kbd>←</kbd> : Seek 5s Forward / Backward
  - <kbd>N</kbd> / <kbd>P</kbd> : Next / Previous Track
  - <kbd>M</kbd> : Mute / Unmute Volume
- 📱 **Fully Responsive**: Adapts seamlessly to Desktop, Tablet, and Mobile screens.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, Vanilla CSS3 (Custom Design System, Flexbox, CSS Grid), Vanilla JavaScript (ES6+ Classes).
- **Icons & Fonts**: Font Awesome 6, Google Fonts (*Plus Jakarta Sans*).
- **Backend Server**: Node.js HTTP Streaming Server with native byte-range support and REST API endpoints.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher)

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SriRamachaithanya/spotify-.git
   cd spotify-
   ```

2. **Start the local server:**
   ```bash
   npm start
   # or
   node server.js
   ```

3. **Open in your browser:**
   ```
   http://localhost:5500
   ```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/songs` | Returns all available audio tracks with metadata and cover artwork |
| `GET` | `/api/health` | Returns server health, uptime, and timestamp |

---

## 📂 Project Structure

```
spotify-clone/
├── covers/              # Album artwork covers (1.jpg - 10.jpg)
├── songs/               # Audio MP3 files (1.mp3 - 10.mp3)
├── index.html           # Main application HTML structure
├── style.css            # Modern CSS3 Design System & styling
├── script.js            # Frontend Audio Engine & UI Controller
├── server.js            # Node.js Streaming Server (HTTP 206 Partial Content)
├── package.json         # Project configuration & npm scripts
├── logo.png             # Spotify brand asset
├── playing.gif          # Animated playing visualizer asset
└── README.md            # Documentation
```

---

## ⌨️ Keyboard Shortcuts Reference

| Key | Action |
| :--- | :--- |
| <kbd>Spacebar</kbd> | Toggle Play / Pause |
| <kbd>Right Arrow (→)</kbd> | Seek forward 5 seconds |
| <kbd>Left Arrow (←)</kbd> | Seek backward 5 seconds |
| <kbd>N</kbd> | Next Track |
| <kbd>P</kbd> | Previous Track |
| <kbd>M</kbd> | Toggle Mute / Unmute |

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
