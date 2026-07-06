import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

/**
 * Returns the sha256 hex digest of a string.
 */
export function hashContent(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

/**
 * Returns the sha256 hex digest of a file's contents.
 * Returns null if the file does not exist.
 */
export async function hashFile(filePath: string): Promise<string | null> {
  try {
    const content = await readFile(filePath, "utf8");
    return hashContent(content);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}
