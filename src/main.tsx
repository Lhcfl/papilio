import { createRoot } from "react-dom/client";
import "virtual:uno.css";
import "./tailwind.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import "./plugins/i18n";

import { StrictMode } from "react";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Create a query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: 1000 * 60 * 60, // 1 hour
		},
	},
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
