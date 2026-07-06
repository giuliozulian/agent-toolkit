#!/usr/bin/env node
import { Command } from "commander";
import { init } from "./commands/init.js";
import { sync } from "./commands/sync.js";
import { list } from "./commands/list.js";
import { getToolkitVersion } from "./lib/version.js";

const program = new Command();

program
  .name("agent-toolkit")
  .description(
    "Install and update shared Copilot/Claude agents, skills and instructions in the current project.",
  );

program.hook("preAction", async (thisCommand) => {
  thisCommand.setOptionValue("toolkitVersion", await getToolkitVersion());
});

program
  .command("init")
  .description("Install agents/skills/instructions into .github/ for the current project")
  .option("--all", "Install every available template without prompting")
  .action(async (opts: { all?: boolean }) => {
    await init({ all: opts.all });
  });

program
  .command("sync")
  .description("Update previously installed files to their latest template version")
  .option("--force", "Overwrite files even if they were modified locally")
  .action(async (opts: { force?: boolean }) => {
    await sync({ force: opts.force });
  });

program
  .command("list")
  .description("Show available templates and what is currently installed")
  .action(async () => {
    await list();
  });

program.version(await getToolkitVersion());

await program.parseAsync(process.argv);
