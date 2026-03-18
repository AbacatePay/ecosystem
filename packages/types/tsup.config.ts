import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"types/index.ts",
		"types/v1/index.ts",
		"types/v1/routes.ts",
		"types/v2/index.ts",
		"types/v2/routes.ts",
	],
	format: ["esm", "cjs"],
	target: "es2022",
	outDir: "dist",
	clean: true,
	dts: true,
	sourcemap: true,
	treeshake: true,
	splitting: false,
});
