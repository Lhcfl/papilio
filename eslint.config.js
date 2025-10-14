import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		ignores: ["src/components/ui/*.tsx", "sharkey-js/**/*"],
		plugins: {
			prettier, // 加入 Prettier 插件
		},
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs["recommended-latest"],
			reactRefresh.configs.vite,
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
				},
			},
		],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},
]);
