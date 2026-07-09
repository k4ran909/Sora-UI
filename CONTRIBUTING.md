# Contributing to Sora UI

First off, thank you for taking the time to contribute! 🎉 We are excited to build a premium, tactile, and skeuomorphic copy-paste UI library for React together.

Sora UI is a curated set of React components designed with texture, weight, and motion in mind. To keep the project high-quality and easy to use, please follow these guidelines.

---

## 🗺️ Skeuomorphic Ideas & Roadmap

If you are looking for things to build, here are some awesome skeuomorphic components we would love to have in the registry:
- **🎛️ Vintage Synth Knobs & Dials:** An interactive rotary knob that responds to drag gestures, complete with a surrounding LED scale.
- **📟 Retro LCD Display / Terminal:** A glowing, segmented screen that renders charts, numbers, or logs with a pixelated glass filter.
- **🔌 Toggle Switches & Jacks:** Toggle switches that satisfyingly "flip" with realistic shadows, or patch cables you can drag and connect.
- **📼 Tape / Cassette Player:** A cassette player that spins while music plays, with mechanical deck buttons.
- **🎚️ Analog VU Meters:** A needle gauge moving back and forth reacting to actual or mock audio levels.
- **🎮 Arcade Joystick / D-Pad:** Interactive controllers with tactile mechanical clicks.
- **📟 Vintage Calculator / Keypad:** Tactile buttons that sink when pressed and display realistic drop-shadow transitions.

---

## ⚡ Development Setup

To run Sora UI locally:

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/<your-username>/Sora-UI.git
   cd Sora-UI
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. The documentation site doubles as your development playground!

---

## 🧩 Adding a New Component

To add a new skeuomorphic component, you will need to register it in four places so that the playground, documentation, and the Shadcn CLI registry all sync up perfectly.

### Step 1: Create the Component Source
Create a new file in the `registry/` directory:
- Path: `registry/your-component-name.tsx`
- Ensure all logic is self-contained. Any utilities should use existing ones (like `@/lib/utils` or `cn` helper) or be bundled.
- Keep dependencies minimal. Stick to our core stack: React 19, Framer Motion, Tailwind CSS v4, and Lucide React. (Let us know if you need to add an external dependency).

### Step 2: Register in `registry/index.ts`
Open [registry/index.ts](file:///c:/Users/k4ran/OneDrive/Desktop/Sora%20UI/registry/index.ts) and add your component entry to the `registry` object:
```typescript
"your-component-name": {
  name: "Your Component Name",
  slug: "your-component-name",
  category: "Forms / Media / Voice / Graphics",
  description: "A short, engaging description of what your component does.",
  codePath: "registry/your-component-name.tsx",
  dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
}
```

### Step 3: Register in the CLI Compiler (`scripts/build-registry.js`)
Open [scripts/build-registry.js](file:///c:/Users/k4ran/OneDrive/Desktop/Sora%20UI/scripts/build-registry.js) and add your component structure to the `components` list:
```javascript
{
  name: "your-component-name",
  type: "registry:ui",
  dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
  files: [
    {
      path: "your-component-name.tsx",
      type: "registry:ui"
    }
  ]
}
```
*Note: Running `npm run dev` or `npm run build` will automatically run `scripts/build-registry.js` under the hood and generate the schema JSON in `public/registry/your-component-name.json`!*

### Step 4: Add a Preview in `components/preview-renderer.tsx`
To showcase your component in the interactive documentation playground, open [components/preview-renderer.tsx](file:///c:/Users/k4ran/OneDrive/Desktop/Sora%20UI/components/preview-renderer.tsx):
1. Import your component dynamically:
   ```typescript
   const YourComponentPreview = dynamic(
     () => import("@/registry/your-component-name").then((mod) => mod.YourComponentName),
     { ssr: false, loading: () => <span className="text-zinc-500 text-xs">Loading component...</span> }
   );
   ```
2. Add it to the `componentsMap` record:
   ```typescript
   const componentsMap: Record<string, React.ComponentType<any>> = {
     // ... existing entries
     "your-component-name": YourComponentPreview,
   };
   ```

---

## 🎨 Coding & Design Standards

- **Skeuomorphic Feel:** Focus on rich shadows (`box-shadow`, inset gradients), subtle border highlights, glassmorphism, textures, and tactile responses.
- **Tailwind CSS v4:** Use the latest features of Tailwind CSS v4. Avoid arbitrary style blocks; keep it utility-first unless custom HSL/RGB math is needed.
- **Framer Motion:** Use spring animations (`type: "spring", stiffness: ..., damping: ...`) rather than standard eases for a weightier, physical feel.
- **TypeScript:** Fully typed components without any `any` declarations.
- **Clean Registry Output:** Keep the component file clean. It will be copy-pasted directly by users, so avoid importing local components outside of `@/lib/utils` or `@/components/ui` helpers if possible.

---

## 📤 Submission Guidelines

1. **Verify your code:**
   Ensure there are no TypeScript or build issues:
   ```bash
   npm run lint
   npm run build
   ```
2. **Commit your changes:**
   Use clear, semantic commit messages (e.g. `feat: add vintage knob component`).
3. **Pull Request requirements:**
   - Provide a clear explanation of what the component does.
   - **IMPORTANT:** Attach a GIF or a high-quality video demonstrating the skeuomorphic mechanics of the component.
   - Link any related issue.

Thank you for contributing! If you have any questions, feel free to open a draft PR or join our discussions. Let's make web interfaces satisfying again!
