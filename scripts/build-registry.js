const fs = require("fs");
const path = require("path");

const REGISTRY_DIR = path.join(__dirname, "../registry");
const PUBLIC_REGISTRY_DIR = path.join(__dirname, "../public/registry");

// Simple static list of components to compile into JSON schemas for the CLI
const components = [
  {
    name: "music-player",
    type: "registry:ui",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "music-player.tsx",
        type: "registry:ui"
      }
    ]
  },
  {
    name: "dark-player",
    type: "registry:ui",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "dark-player.tsx",
        type: "registry:ui"
      }
    ]
  },
  {
    name: "bar-visualizer",
    type: "registry:ui",
    dependencies: ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
    files: [
      {
        path: "bar-visualizer.tsx",
        type: "registry:ui"
      }
    ]
  }
];

// Make sure the destination folder exists
if (!fs.existsSync(PUBLIC_REGISTRY_DIR)) {
  fs.mkdirSync(PUBLIC_REGISTRY_DIR, { recursive: true });
}

const registryIndex = [];

components.forEach((component) => {
  try {
    const componentFiles = component.files.map((file) => {
      const rawContent = fs.readFileSync(path.join(REGISTRY_DIR, file.path), "utf-8");
      return {
        path: file.path,
        content: rawContent,
        type: file.type
      };
    });

    const registryJson = {
      name: component.name,
      type: component.type,
      dependencies: component.dependencies,
      files: componentFiles
    };

    // Write shadcn-compatible component JSON schema
    fs.writeFileSync(
      path.join(PUBLIC_REGISTRY_DIR, `${component.name}.json`),
      JSON.stringify(registryJson, null, 2),
      "utf-8"
    );
    
    registryIndex.push({
      name: component.name,
      type: component.type,
      dependencies: component.dependencies,
      files: component.files.map(f => f.path)
    });
    
    console.log(`✓ Compiled JSON schema for: ${component.name}`);
  } catch (err) {
    console.error(`✗ Failed compiling registry schema for ${component.name}:`, err);
  }
});

// Write the main index.json listing all components
fs.writeFileSync(
  path.join(PUBLIC_REGISTRY_DIR, "index.json"),
  JSON.stringify(registryIndex, null, 2),
  "utf-8"
);
console.log("✓ Compiled main registry index.json");
