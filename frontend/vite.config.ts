import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@components": path.resolve(__dirname, "src/components"),
			"@context": path.resolve(__dirname, "src/context"),
			"@hooks": path.resolve(__dirname, "src/hooks"),
			"@pages": path.resolve(__dirname, "src/pages"),
			"@routes": path.resolve(__dirname, "src/routes"),
			"@schemas": path.resolve(__dirname, "src/schemas"),
			"@store": path.resolve(__dirname, "src/store"),
			"@appTypes": path.resolve(__dirname, "src/types"),
			"@utils": path.resolve(__dirname, "src/utils"),
			"@lib": path.resolve(__dirname, "src/lib"),
		},
	},
});
