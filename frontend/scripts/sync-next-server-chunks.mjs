import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const serverDir = path.join(process.cwd(), ".next", "server");
const chunksDir = path.join(serverDir, "chunks");

if (!existsSync(serverDir) || !existsSync(chunksDir)) {
  process.exit(0);
}

for (const entry of readdirSync(chunksDir)) {
  const src = path.join(chunksDir, entry);
  const dest = path.join(serverDir, entry);

  if (!statSync(src).isFile()) {
    continue;
  }

  copyFileSync(src, dest);
}
