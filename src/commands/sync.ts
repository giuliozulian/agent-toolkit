import pc from "picocolors";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { listTemplateItems, copyTemplateFile } from "../lib/copyTemplates.js";
import { loadManifest, saveManifest } from "../lib/manifest.js";
import { hashContent, hashFile } from "../lib/diff.js";
import { getToolkitVersion } from "../lib/version.js";

export interface SyncOptions {
  force?: boolean;
  cwd?: string;
}

export async function sync(options: SyncOptions = {}): Promise<void> {
  const projectRoot = options.cwd ?? process.cwd();
  const version = await getToolkitVersion();
  const manifest = await loadManifest(projectRoot);

  if (!manifest) {
    console.log(
      pc.yellow("No agent-toolkit.lock.json found. Run `agent-toolkit init` first."),
    );
    return;
  }

  const items = await listTemplateItems();
  const sourceByTarget = new Map<string, string>();
  for (const item of items) {
    for (const file of item.files) {
      sourceByTarget.set(file.targetRelative, file.source);
    }
  }

  let updated = 0;
  let skipped = 0;
  let unchanged = 0;
  let removed = 0;

  for (const [targetRelative, entry] of Object.entries(manifest.files)) {
    const source = sourceByTarget.get(targetRelative);
    if (!source) {
      // Template no longer exists in this version of the toolkit.
      console.log(pc.dim(`- ${targetRelative} (no longer provided by toolkit, left as-is)`));
      removed += 1;
      continue;
    }

    const localHash = await hashFile(join(projectRoot, targetRelative));
    const templateContent = await readFile(source, "utf8");
    const templateHash = hashContent(templateContent);

    const isLocallyModified = localHash !== null && localHash !== entry.hash;

    if (isLocallyModified && !options.force) {
      console.log(pc.yellow(`⚠ modificato localmente, sync saltato: ${targetRelative}`));
      skipped += 1;
      continue;
    }

    if (localHash === templateHash) {
      unchanged += 1;
      continue;
    }

    await copyTemplateFile(projectRoot, { source, targetRelative });
    manifest.files[targetRelative] = { hash: templateHash, version };
    console.log(pc.green("✓ updated"), targetRelative);
    updated += 1;
  }

  manifest.toolkitVersion = version;
  await saveManifest(projectRoot, manifest);

  console.log(
    pc.bold(
      `\nSync complete (agent-toolkit v${version}): ${updated} updated, ${unchanged} unchanged, ${skipped} skipped (local changes), ${removed} no longer in toolkit.`,
    ),
  );
  if (skipped > 0 && !options.force) {
    console.log(pc.dim("Re-run with --force to overwrite locally modified files."));
  }
}
