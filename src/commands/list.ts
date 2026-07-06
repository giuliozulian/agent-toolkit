import pc from "picocolors";
import { listTemplateItems, itemLabel } from "../lib/copyTemplates.js";
import { loadManifest } from "../lib/manifest.js";
import { getToolkitVersion } from "../lib/version.js";

export interface ListOptions {
  cwd?: string;
}

export async function list(options: ListOptions = {}): Promise<void> {
  const projectRoot = options.cwd ?? process.cwd();
  const version = await getToolkitVersion();
  const items = await listTemplateItems();
  const manifest = await loadManifest(projectRoot);

  const installedTargets = new Set(Object.keys(manifest?.files ?? {}));

  console.log(pc.bold(`agent-toolkit v${version} — available templates:\n`));

  for (const category of ["agents", "skills", "instructions"] as const) {
    const inCategory = items.filter((item) => item.category === category);
    if (inCategory.length === 0) continue;
    console.log(pc.underline(category));
    for (const item of inCategory) {
      const installed = item.files.some((f) => installedTargets.has(f.targetRelative));
      const marker = installed ? pc.green("✓ installed") : pc.dim("  not installed");
      console.log(`  ${itemLabel(item).padEnd(40)} ${marker}`);
    }
    console.log("");
  }

  if (!manifest) {
    console.log(pc.dim("No agent-toolkit.lock.json in this project. Run `agent-toolkit init`."));
  } else {
    console.log(pc.dim(`Project last synced with toolkit v${manifest.toolkitVersion}.`));
  }
}
