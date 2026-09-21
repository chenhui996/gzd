import { defineConfig, devices } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "./tests/ct",
  timeout: 30_000,
  fullyParallel: true,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    viewport: { width: 1280, height: 800 },
    ctPort: 3101,
  },
});
