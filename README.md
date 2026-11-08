# 🪔 Diwali Wishes & Interactive Celebration Web App

A high-performance, festive Diwali celebration web application built with **React**, **Vite**, **Framer Motion**, and **HTML5 Canvas**.

Visitors are welcomed with an atmospheric starry night sky and a glowing diya. Once they enter their name and submit, a dramatic **Diwali rocket takes flight**, accelerating upward and bursting into dazzling fireworks. The explosion seamlessly reveals a personalized festive greeting (*"Wishing you a Happy Diwali, [Name]!"*) along with 6 synchronized, butter-smooth 60fps animation layers.

---

## ✨ Features

- **🚀 Cinematic Rocket Intro Sequence**:
  - Rocket ignites from the bottom with dynamic spark trails.
  - Realistic acceleration, physics-based wobble, and spark emissions.
  - Massive explosion at apex with screen flash, multi-layer shockwave rings, and 200+ bursting sparkles.
- **✨ Personalized Greeting Reveal**:
  - *"Happy Diwali"* rendered with an animated golden shimmer gradient.
  - Smooth spring-based letter-by-letter reveal powered by Framer Motion.
  - Personalized with the visitor's name.
- **🎆 60fps Canvas Particle Fireworks**:
  - Multi-colored bursts (gold, orange, crimson red, magenta, cyan-green).
  - Rocket trails, falling glitter particles affected by gravity and drag.
  - Occasional heart-shaped burst formations.
  - **Click-to-Fire**: Click anywhere on the screen to launch an interactive firework burst at that exact point.
  - **Replay Barrage**: Trigger fresh salvos on demand.
- **🪔 Ambient Lighting & Traditional Decor**:
  - **Flickering Diyas**: Clay oil lamps along the bottom with multi-stage flame flicker and glowing radial halos.
  - **Twinkling Fairy Lights**: Multi-colored string bulbs draped across the top with sequential blinking.
  - **Floating Lanterns (Akash Kandil)**: Sky lanterns gently swaying and drifting upwards.
  - **Mandala Rangoli**: Traditional geometric SVG rangoli rotating smoothly with a pulsing golden glow.
  - **Canvas Bokeh / Sparkle Overlay**: Drifting golden particles rendered on canvas to eliminate DOM layout thrashing.
- **🔊 Interactive Web Audio Sound Effects**:
  - Synthesized firework burst effects using Web Audio API (procedural white noise + bandpass envelope filter).
  - Muted by default to strictly respect browser autoplay policies.
  - Toggle sound anytime via the top-right button.
- **⚡ Performance Engineered (Zero Lag)**:
  - In-place particle array compaction eliminates garbage collection stutters.
  - Device Pixel Ratio (DPR) capped at 2× to preserve 60fps even on 4K/retina displays.
  - GPU acceleration enabled (`will-change`, `translateZ(0)`).
  - Full support for `prefers-reduced-motion`.

---

## 🎨 Color Palette

| Color | Hex | Usage |
| :--- | :--- | :--- |
| **Diwali Gold** | `#FFD700` | Primary accents, text shimmer, diya glow |
| **Festive Orange** | `#FF8C00` | Gradients, fire sparks, button highlights |
| **Deep Red** | `#B22222` | Rangoli accents, firework sparks |
| **Royal Purple** | `#1A0533` | Deep night sky backdrop |
| **Midnight Navy** | `#0D1B3E` | Gradient background transition |
| **Warm Ivory** | `#FFF5CC` | Core flame highlights, sparkles |

---

## 📁 Project Structure

```
diwali/
├── public/
│   └── favicon.svg                    # Glowing Diya SVG favicon
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BokehOverlay/              # High-performance canvas bokeh
│   │   │   ├── BokehOverlay.jsx
│   │   │   └── BokehOverlay.css
│   │   ├── Diyas/                     # Traditional flickering oil lamps
│   │   │   ├── Diyas.jsx
│   │   │   └── Diyas.css
│   │   ├── Fireworks/                 # Interactive 60fps canvas firework system
│   │   │   └── Fireworks.jsx
│   │   ├── Greeting/                  # Personalized greeting screen
│   │   │   ├── Greeting.jsx
│   │   │   └── Greeting.css
│   │   ├── Lanterns/                  # Floating sky lanterns (akash kandil)
│   │   │   ├── Lanterns.jsx
│   │   │   └── Lanterns.css
│   │   ├── NameForm/                  # Welcome & name validation landing screen
│   │   │   ├── NameForm.jsx
│   │   │   └── NameForm.css
│   │   ├── Rangoli/                   # Rotating geometric SVG rangoli
│   │   │   ├── Rangoli.jsx
│   │   │   └── Rangoli.css
│   │   ├── RocketIntro/               # Launch, climb, & burst sequence
│   │   │   └── RocketIntro.jsx
│   │   ├── SoundToggle/               # Web Audio API procedural sound engine
│   │   │   ├── SoundToggle.jsx
│   │   │   └── SoundToggle.css
│   │   └── StringLights/              # Twinkling fairy lights
│   │       ├── StringLights.jsx
│   │       └── StringLights.css
│   ├── App.jsx                        # 3-phase state orchestrator
│   ├── App.css
│   ├── index.css                      # Global styles, variables, reset
│   └── main.jsx                       # React entry point
├── index.html                         # Typography & webfont integration
├── package.json
└── vite.config.js
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mohan-08812/diwali.git
   cd diwali
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Production Build

Create an optimized production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 🚀 Deployment

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
1. Push your code to GitHub.
2. Import your repository in [Vercel](https://vercel.com).
3. Vercel automatically detects Vite. Click **Deploy**.

### Deploy to Netlify
1. Run `npm run build` to generate the `dist` folder.
2. Drag and drop the `dist/` directory onto [Netlify Drop](https://app.netlify.com/drop), or link your GitHub repo directly with build command `npm run build` and publish directory `dist`.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Wishing everyone a joyful, prosperous, and bright Diwali! 🪔✨*
