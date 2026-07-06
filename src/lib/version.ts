import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_JSON_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "package.json",
);

let cachedVersion: string | undefined;

export async function getToolkitVersion(): Promise<string> {
  if (cachedVersion) return cachedVersion;
  const raw = await readFile(PACKAGE_JSON_PATH, "utf8");
  const pkg = JSON.parse(raw) as { version: string };
  cachedVersion = pkg.version;
  return cachedVersion;
}
