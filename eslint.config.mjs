import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Best Practices
      eqeqeq: ["error", "always"],
      curly: "error",

      // Stylistic Issues
      semi: ["error", "always"],

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",

      // React/Next.js
      "react/react-in-jsx-scope": "off", // Not needed for Next.js
      "react/jsx-uses-react": "off", // Not needed for Next.js
      "react/jsx-uses-vars": "error",
      semi: ["error", "always"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
      "eol-last": ["error", "always"],
      "react/jsx-indent": ["error", 2],
      "react/jsx-indent-props": ["error", 2],
    },
  },
];

export default eslintConfig;
