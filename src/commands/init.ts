import prompts from "prompts";
import pc from "picocolors";
import {
  listTemplateItems,
  copyTemplateFile,
  itemLabel,
  type TemplateItem,
} from "../lib/copyTemplates.js";
import { loadManifest, saveManifest, emptyManifest } from "../lib/manifest.js";
import { hashContent } from "../lib/diff.js";
import { getToolkitVersion } from "../lib/version.js";

export interface InitOptions {
  all?: boolean;
  cwd?: string;
}

export async function init(options: InitOptions = {}): Promise<void> {
  const projectRoot = options.cwd ?? process.cwd();
  const version = await getToolkitVersion();
  const items = await listTemplateItems();

  if (items.length === 0) {
    console.log(pc.yellow("No templates found in this package. Nothing to install."));
    return;
  }

  let selected: TemplateItem[] = items;

  if (!options.all) {
    const { ids } = await prompts({
      type: "multiselect",
      name: "ids",
      message: "Select agents/skills/instructions to install",
      choices: items.map((item) => ({
        title: itemLabel(item),
        value: itemLabel(item),
        selected: true,
      })),
      hint: "Space to toggle, Enter to confirm",
    });

    if (!ids || ids.length === 0) {
      console.log(pc.yellow("Nothing selected. Aborted."));
      return;
    }
    selected = items.filter((item) => ids.includes(itemLabel(item)));
  }

  const existingManifest = (await loadManifest(projectRoot)) ?? emptyManifest(version);
  const manifest = { ...existingManifest, toolkitVersion: version };

  for (const item of selected) {
    for (const file of item.files) {
      const content = await copyTemplateFile(projectRoot, file);
      manifest.files[file.targetRelative] = {
        hash: hashContent(content),
        version,
      };
      console.log(pc.green("+"), file.targetRelative);
    }
  }

  await saveManifest(projectRoot, manifest);
  console.log(pc.bold(`\nInstalled ${selected.length} item(s). agent-toolkit v${version}`));
}
