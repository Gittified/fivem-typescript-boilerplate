const esbuild = require("esbuild");

const IS_WATCH_MODE = process.env.IS_WATCH_MODE;

const TARGET_ENTRIES = [
	{
		target: "node16",
		entryPoints: ["server/server.ts"],
		platform: "node",
		outfile: "./dist/server/server.js",
	},
	{
		target: "es2020",
		entryPoints: ["client/client.ts"],
		outfile: "./dist/client/client.js",
	},
];

const buildBundle = async () => {
	try {
		const baseOptions = {
			logLevel: "info",
			bundle: true,
			charset: "utf8",
			minifyWhitespace: true,
			absWorkingDir: process.cwd(),
		};

		for (const targetOpts of TARGET_ENTRIES) {
			const ctx = await esbuild.context({ ...baseOptions, ...targetOpts });

			if (IS_WATCH_MODE) {
				await ctx.watch();
			} else {
				const { errors } = await ctx.rebuild();

				if (errors.length >= 1) {
					console.error(`[ESBuild] Bundle failed with ${errors.length} errors`);
				}

				ctx.dispose();
			}
		}
	} catch (e) {
		console.log("[ESBuild] Build failed with error");
		console.error(e);
		process.exit(1);
	}
};

buildBundle().catch(() => process.exit(1));
