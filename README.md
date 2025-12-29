<div align="center">
  <img src="public/akool-dark.svg" alt="Akool Logo" width="180"/>
  
  # Image to Video AI Studio
  
  **Transform static images into stunning AI-generated videos with just a prompt**
  
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  
  [Features](#features) • [Demo](#demo) • [Installation](#installation) • [Usage](#usage) • [API Setup](#api-setup) • [Internationalization](#internationalization)
</div>

---

## Features

### AI-Powered Video Generation
- **Multiple AI Models** — Choose from various providers including Akool, Kling, and more
- **Smart Prompting** — Describe how you want your image animated with natural language
- **Negative Prompts** — Specify what to avoid for precise results
- **Batch Generation** — Generate multiple video variations simultaneously

### Visual Effects Library
- **Pre-built Effects** — Browse and apply stunning visual effects to your videos
- **Live Previews** — See effect demonstrations before applying
- **No Effect Option** — Generate clean animations without additional effects

### Flexible Audio Options

| Option | Description |
|--------|-------------|
| AI Generated | Let AI create matching audio for your video |
| Custom Upload | Provide your own audio via URL |
| None | Generate silent videos |

### Customizable Output
- **Resolution Options** — 720p (HD), 1080p (Full HD), 4K (Ultra HD)
- **Duration Control** — Multiple duration options per model (5s, 10s, etc.)
- **Quality Tiers** — Free and Premium model options

### Multi-Language Support

Built-in internationalization with support for:
- English
- 中文 (Chinese)
- 日本語 (Japanese)
- 한국어 (Korean)

### Premium User Experience
- **Smooth Animations** — Framer Motion transitions throughout
- **Interactive Particles** — Dynamic WebGL particle background
- **Credit Tracking** — Real-time display of available credits
- **Progress Monitoring** — Live status updates during generation

---

## Demo

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Authentication</b></td>
      <td align="center"><b>Generation Form</b></td>
      <td align="center"><b>Result View</b></td>
    </tr>
    <tr>
      <td>API Key or OAuth credentials</td>
      <td>Configure all generation settings</td>
      <td>Download or regenerate videos</td>
    </tr>
  </table>
</div>

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 19, TypeScript, Vite 7 |
| **Styling** | Tailwind CSS, tailwind-variants, class-variance-authority |
| **UI Components** | Radix UI Primitives (Dialog, Select, Slider, etc.) |
| **Animations** | Framer Motion, CSS Animations |
| **Graphics** | OGL (WebGL Particles) |
| **i18n** | react-i18next, i18next-browser-languagedetector |
| **Icons** | Lucide React |
| **API** | Akool OpenAPI v3/v4 |

---

## Installation

### Prerequisites

- **Node.js** 18.x or higher
- **npm**, **yarn**, or **pnpm**
- **Akool API credentials** ([Get them here](https://akool.com))

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AkoolLabs/i2v-demo.git
cd i2v-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Usage

### 1. Authentication

Choose your preferred authentication method:

| Method | Use Case |
|--------|----------|
| **API Key** | Quick access for development and testing |
| **Client Credentials** | OAuth flow for production applications |

<details>
<summary>Using API Key</summary>

1. Enter your Akool API key in the "API Key" tab
2. Click "Submit" to authenticate
3. Your credits will be displayed in the top-left corner

</details>

<details>
<summary>Using Client Credentials</summary>

1. Switch to the "Credentials" tab
2. Enter your **Client ID** and **Client Secret**
3. Click "Submit" — a JWT token will be generated automatically

</details>

### 2. Generate Videos

1. **Provide an Image** — Enter a publicly accessible image URL
2. **Write a Prompt** — Describe the animation you want
3. **Select AI Model** — Choose from available providers (Free/Pro)
4. **Configure Settings** — Resolution, duration, audio, effects
5. **Generate** — Click the generate button and wait for your video

### 3. View Results

- **Preview** — Watch your generated video(s) directly in the browser
- **Download** — Save videos to your device
- **Regenerate** — Try different settings with the same image
- **Update Audio** — Add or change audio on completed videos

---

## API Setup

This application uses the [Akool OpenAPI](https://docs.akool.com). You'll need to:

1. **Create an Account** at [akool.com](https://akool.com)
2. **Get API Credentials** from your dashboard
3. **Add Credits** to your account for video generation

### API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `/api/open/v3/getToken` | OAuth token generation |
| `/api/open/v3/faceswap/quota/info` | Get user credits |
| `/api/open/v4/aigModel/list` | Fetch available AI models |
| `/api/open/v4/image2Video/effects` | List video effects |
| `/api/open/v4/image2Video/createBySourcePrompt/batch` | Generate videos |
| `/api/open/v4/image2Video/resultsByIds` | Check video status |
| `/api/open/v4/image2Video/updateVideoAudio` | Update audio |

### Development Proxy

The Vite dev server is configured to proxy API requests to avoid CORS issues:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api/open': {
      target: 'https://openapi.akool.com',
      changeOrigin: true,
      secure: true,
    },
  },
}
```

---

## Internationalization

The app supports multiple languages out of the box. Language files are located in:

```
public/
└── locales/
    ├── en/
    │   └── translation.json
    ├── zh/
    │   └── translation.json
    ├── ja/
    │   └── translation.json
    └── ko/
        └── translation.json
```

### Adding a New Language

1. Create a new folder in `public/locales/` (e.g., `fr/`)
2. Copy `translation.json` from an existing language
3. Translate all strings
4. Add the language option to `LanguageSelector.tsx`

---

## Project Structure

```
src/
├── components/
│   ├── Animator/                 # Main generation components
│   │   ├── AudioSettings.tsx     # Audio configuration
│   │   ├── EffectSelector.tsx    # Visual effects grid
│   │   ├── GenerateButton.tsx    # Generation trigger
│   │   ├── ImageInput.tsx        # Image URL input
│   │   ├── PromptInput.tsx       # Prompt text areas
│   │   └── VideoSettings.tsx     # Resolution, duration, etc.
│   ├── ui/                       # Reusable UI components
│   ├── Animator.tsx              # Main container
│   ├── AnimatorFormView.tsx      # Form view layout
│   ├── AuthForm.tsx              # Authentication screen
│   ├── LanguageSelector.tsx      # i18n dropdown
│   ├── Particles.tsx             # WebGL background
│   ├── ProcessingView.tsx        # Loading/progress view
│   └── VideoResultView.tsx       # Results display
├── contaxt/
│   └── AuthProvider.tsx          # Authentication context
├── Hooks/
│   ├── useAkool.ts              # API client hook
│   ├── useAnimatorLogic.ts      # Main business logic
│   └── usePolling.ts            # Status polling hook
├── services/
│   └── apiService.ts            # API client class
├── lib/
│   └── utils.ts                 # Utility functions
├── types.ts                     # TypeScript definitions
├── i18n.ts                      # i18next configuration
└── App.tsx                      # Root component
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

---

## Customization

### Theming

The app uses CSS custom properties for theming. Modify `src/index.css` to customize:

- `--primary` — Main accent color
- `--secondary` — Secondary backgrounds
- `--background` — Main background
- `--foreground` — Text color
- `--muted` — Muted elements
- `--border` — Border colors

### Particles Background

Configure the particle effect in `App.tsx`:

```tsx
<Particles
  particleColors={["#ffffff", "#ffffff"]}
  particleCount={300}
  particleSpread={10}
  speed={0.1}
  particleBaseSize={100}
  moveParticlesOnHover={true}
/>
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Akool](https://akool.com) for the powerful Image-to-Video API
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons

---

<div align="center">
  <p>Built with React & Akool AI</p>
  
  <a href="https://akool.com">
    <img src="public/akool-dark.svg" alt="Akool" width="100"/>
  </a>
</div>
