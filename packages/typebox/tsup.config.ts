import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/v1/index.ts", "src/v2/index.ts"],
	format: ["esm", "cjs"],
	target: "es2022",
	outDir: "dist",
	clean: true,
	dts: true,
	sourcemap: true,
	treeshake: true,
	splitting: false,
});
