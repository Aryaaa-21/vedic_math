import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["dist/**", "build/**", "node_modules/**", ".next/**"],
  },
]);
