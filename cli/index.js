#!/usr/bin/env node

const { spawn } = require("child_process");

const args = process.argv.slice(2);
const command = args[0]; // e.g. 'add'
const component = args[1]; // e.g. 'music-player'

if (command === "add" && component) {
  const registryUrl = `https://raw.githubusercontent.com/k4ran909/Sora-UI/main/public/registry/${component}.json`;
  console.log(`\n🕯️  Sora UI CLI: Installing ${component}...`);
  console.log(`Connecting to registry: ${registryUrl}\n`);
  
  const fullCommand = `npx shadcn@latest add "${registryUrl}"`;
  
  // Under the hood, we spawn the official shadcn CLI to do the heavy lifting:
  // parsing aliases, merging Tailwind config, and downloading files.
  const child = spawn(fullCommand, [], {
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code) => {
    process.exit(code);
  });
} else {
  console.log(`
🕯️  Sora UI CLI
  
Usage:
  npx soraui-cli add <component-name>
  
Example:
  npx soraui-cli add music-player
  `);
  process.exit(1);
}
