# @giuliozulian/agent-toolkit

Shared Copilot/Claude sub-agents, skills and instructions, distributed as a small CLI so every project can install and update them from one place instead of copy-pasting files by hand.

See [agent-toolkit-package-plan.md](agent-toolkit-package-plan.md) for the full design doc.

## Usage

```bash
# build the CLI once (or after changing templates/src)
pnpm install
pnpm build

# in a consumer project
pnpm dlx github:giuliozulian/gz-agent-toolkit init   # first install (interactive, or --all)
pnpm dlx github:giuliozulian/gz-agent-toolkit sync   # update installed files to latest templates
pnpm dlx github:giuliozulian/gz-agent-toolkit list   # show available vs installed
```

`init` copies selected agents/skills/instructions into `.github/` in the current project and writes a
`.github/agent-toolkit.lock.json` manifest (content hash + version per file). `sync` re-copies template
files whose local hash still matches the manifest (i.e. untouched since install) and **skips** files that
were customized locally, unless `--force` is passed.

## Repo layout

- `src/` — CLI source (TypeScript, ESM, built with `tsup`).
- `templates/agents/*.agent.md` — generic sub-agents (coordinator, security-reviewer, frontend-engineer, accessibility-auditor, performance-auditor, qa-test-engineer).
- `templates/skills/`, `templates/instructions/` — reserved for future generic skills/instructions (currently empty; project-specific instructions stay in each repo, see the plan doc §1 and §9).
