import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

export const MANIFEST_RELATIVE_PATH = join(".github", "agent-toolkit.lock.json");

export interface ManifestEntry {
  /** sha256 of the file content at the time it was written by the toolkit. */
  hash: string;
  /** Version of the agent-toolkit package that produced this file. */
  version: string;
}

export interface Manifest {
  /** Version of agent-toolkit that last touched this project. */
  toolkitVersion: string;
  /** Map of project-relative file path -> entry. */
  files: Record<string, ManifestEntry>;
}

export function emptyManifest(toolkitVersion: string): Manifest {
  return { toolkitVersion, files: {} };
}

export function manifestPath(projectRoot: string): string {
  return join(projectRoot, MANIFEST_RELATIVE_PATH);
}

export async function loadManifest(projectRoot: string): Promise<Manifest | null> {
  const filePath = manifestPath(projectRoot);
  if (!existsSync(filePath)) {
    return null;
  }
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as Manifest;
}

export async function saveManifest(projectRoot: string, manifest: Manifest): Promise<void> {
  const filePath = manifestPath(projectRoot);
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}
