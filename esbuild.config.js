const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["lambda.ts"],  // Change to your main Lambda handler file
    bundle: true,
    minify: true,
    platform: "node",
    target: "node18",
    outdir: "dist",
    external: ["aws-sdk"], // AWS SDK is pre-installed in Lambda, no need to include
}).catch(() => process.exit(1));
