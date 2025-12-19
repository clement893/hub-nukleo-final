import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals", "next"),
  prettierConfig,
  {
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];

