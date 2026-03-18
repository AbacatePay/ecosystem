import { defineConfig } from "tsup";

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/webhooks/index.ts",
		"src/webhooks/types.ts",
		"src/webhooks/signature.ts",
		"src/webhooks/dispatch.ts",
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
