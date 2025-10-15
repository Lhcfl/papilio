import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
	globalIgnores(["dist", "sharkey-js"]),
	{
		files: ["**/*.{ts,tsx}"],
		ignores: ["src/components/ui/*.tsx"],
		plugins: {
			prettier, // 加入 Prettier 插件
		},
		extends: [
			js.configs.recommended,
      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
			// Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
			stylistic.configs.recommended,
			prettierConfig, // 禁用冲突规则
			{
				rules: {
					// 启用 prettier 检查
					"prettier/prettier": ["error", {
						endOfLine: "auto",
						singleQuote: true,
						semi: true,
						trailingComma: "all",
						printWidth: 120,
						tabWidth: 2,
					}],
					"@stylistic/jsx-self-closing-comp": "error",
					"@typescript-eslint/no-non-null-assertion": "off",
				},
			},
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
		},
	},
]);
