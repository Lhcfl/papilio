import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import UnoCSS from "unocss/vite";
import TanStackRouter from "@tanstack/router-plugin/vite";
import AutoImport from "unplugin-auto-import/vite";
import path from "node:path";
import TailWindCSS from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TailWindCSS(),
		UnoCSS(),
		TanStackRouter(),
		AutoImport({
			imports: [
				"react",
				{
					"@tanstack/react-query": [
						"useQuery",
						"useMutation",
						"useQueryClient",
						"QueryClient",
						"QueryClientProvider",
					],
					"@tanstack/react-router": [
						"useNavigate",
						"useParams",
						"useSearch",
						"useRouter",
						"Link",
						"Outlet",
					],
				},
			],
			dts: "./src/auto-imports.d.ts",
			dirs: ["./src/hooks", "./src/lib"],
			dtsMode: "overwrite",
		}),
		react(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
