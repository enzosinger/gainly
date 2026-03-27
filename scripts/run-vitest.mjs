import { spawnSync } from "node:child_process";

const args = process.argv.slice(2).filter((arg) => arg !== "--runInBand");
const result = spawnSync("vitest", args, { stdio: "inherit", shell: true });

process.exit(result.status ?? 1);
