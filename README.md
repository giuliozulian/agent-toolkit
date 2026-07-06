# ai-agents-team

A team of 15 specialized AI agents (coordinator, backend, frontend, design, accessibility, performance, security, testing, database, devops, geo, copy, code-review, release, pm) for web development, distributed as a small CLI so every project can install and update them from one place instead of copy-pasting files by hand.

See [agent-toolkit-package-plan.md](agent-toolkit-package-plan.md) for the original design doc.

## Usage

```bash
# clear cache 
npm cache clean --force
# in a consumer project
npx ai-agents-team init   # first install (interactive, or --all)
npx ai-agents-team sync   # update installed files to latest templates
npx ai-agents-team list   # show available vs installed
```

`init` copies selected agents/skills/instructions into `.github/` in the current project and writes a
`.github/ai-agents-team.lock.json` manifest (content hash + version per file). `sync` re-copies template
files whose local hash still matches the manifest (i.e. untouched since install) and **skips** files that
were customized locally, unless `--force` is passed.

## Repo layout

- `src/` — CLI source (TypeScript, ESM, built with `tsup`).
- `src/lib/remoteSkills.ts` — registry of skills fetched live from their upstream source at `init`/`sync` time (see below).
- `templates/agents/*.agent.md` — 15 generic sub-agents (coordinator, backend, frontend, design, accessibility, performance, security, testing, database, devops, geo, copy, code-review, release, pm).
- `templates/instructions/` — reserved for future generic instructions (currently empty; project-specific instructions stay in each repo, see the plan doc §1 and §9).

## Self-sufficiency rule

Every agent shipped in this package must work standalone: it must never assume a skill or
instruction that this package doesn't itself install. Some agents (`frontend`, `accessibility`)
depend on skills that aren't vendored as static files in this repo — instead, `init`/`sync` fetch
them **live** from their upstream source straight into the consumer project's `.github/skills/`
(see `src/lib/remoteSkills.ts`). This keeps them always up to date with zero manual steps, at the
cost of requiring network access during `init`/`sync` and trusting the content served by the source
URL at that moment (no local pinned/reviewed copy). `init`/`sync` retry transient failures and report
any file that couldn't be fetched without aborting the rest of the run.

## Agents included

### Team-wide skill (all agents)

Every agent in this package automatically gets the live-fetched
[`caveman`](https://github.com/JuliusBrussee/caveman/tree/main/skills/caveman)
skill in `.github/skills/caveman/`.

It is a global output-compression layer (terser responses, same technical
substance) to reduce output tokens across the whole team, not only a single
specialist agent.

Each agent ships as a single `.agent.md` file. Most are fully self-contained (no external skill
dependency — the expertise/checklist is written inline in the agent file). Three exceptions, all
fetched live at `init`/`sync` time (see Self-sufficiency rule above) — nothing manual required:

- all agents use `caveman` (team-wide compression skill);
- `coordinator` uses [`grilling`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) ([mattpocock/skills](https://github.com/mattpocock/skills)) to stress-test a plan with the user before delegating work.
- `frontend` uses [`frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) (Apache-2.0, [anthropics/skills](https://github.com/anthropics/skills)).
- `accessibility` uses six skills from [mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills) (AGPL-3.0) and [mikemai2awesome/agent-skills](https://github.com/mikemai2awesome/agent-skills) (see table below).

| | Agent | Description | Skill it uses |
|---|---|---|---|
| 🧭 | `coordinator` | Coordinates multi-step engineering work across all the specialist agents below: plans, delegates, integrates, and verifies the result. | Team-wide `caveman` + live-fetched: [`grilling`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) → `.github/skills/grilling/`. |
| ⚙️ | `backend` | Implements and reviews server-side logic, APIs, business logic, and third-party integrations. | Team-wide `caveman` + inline checklist. |
| 🖥️ | `frontend` | Implements and refactors UI components/pages, matching existing project conventions. | Team-wide `caveman` + live-fetched: [`frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) → `.github/skills/frontend-design/`. |
| 🎨 | `design` | Reviews and defines design tokens, layout, spacing, and visual/UX consistency. | Team-wide `caveman` + inline checklist. |
| ♿ | `accessibility` | Audits UI against WCAG for keyboard nav, screen readers, contrast, and semantics. | Team-wide `caveman` + live-fetched: `accessibility-general`, `forms-a11y`, `keyboard-a11y`, `color-contrast-a11y`, `aria-live-regions-a11y` (from [mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills)) and `frontend-a11y` (from [mikemai2awesome/agent-skills](https://github.com/mikemai2awesome/agent-skills)) → `.github/skills/`. |
| ⚡ | `performance` | Reviews rendering, bundle size, network requests, and data-access performance. | Team-wide `caveman` + inline checklist. |
| 🔒 | `security` | Reviews code/designs for OWASP Top 10-style vulnerabilities and risky config/dependencies. | Team-wide `caveman` + inline checklist. |
| 🧪 | `testing` | Designs/writes automated tests, reviews coverage, diagnoses flaky failures. | Team-wide `caveman` + inline checklist. |
| 🗄️ | `database` | Designs and reviews schema, migrations, indexes, and constraints. | Team-wide `caveman` + inline checklist. |
| 🚀 | `devops` | Reviews/implements CI/CD pipelines, build/deploy config, and infrastructure as code. | Team-wide `caveman` + inline checklist. |
| 🌍 | `geo` | Implements and reviews geolocation, maps, and spatial queries (e.g. PostGIS). | Team-wide `caveman` + inline checklist. |
| ✍️ | `copy` | Centralizes UI strings, manages i18n/translations, keeps terminology consistent. | Team-wide `caveman` + inline checklist. |
| 🔍 | `code-review` | Reviews changes for quality/readability pre-merge and runs the lint/typecheck/build gate. | Team-wide `caveman` + inline checklist. |
| 🏷️ | `release` | Manages semantic versioning and changelog entries. | Team-wide `caveman` + inline checklist. |
| 📋 | `pm` | Maintains project documentation, changelog, and status tracking. | Team-wide `caveman` + inline responsibilities. |

**Note on trust:** live-fetched skills are pulled from third-party repos you don't control. Review
`src/lib/remoteSkills.ts` if you want to audit exactly which URLs are fetched, or fork/pin them if you
need a reviewed, network-independent alternative.

## Using it with GitHub Copilot, Claude Code, and Codex

`init` writes files to `.github/agents/*.agent.md`, which is the format **GitHub Copilot (VS Code)**
reads natively — no extra step needed there. Other hosts expect the same content in a different
location/format, since there is no shared standard across tools yet:

| Host | Where it looks for agents | What to do |
|---|---|---|
| **GitHub Copilot / VS Code** | `.github/agents/*.agent.md` | Nothing extra — this is exactly what `init` installs. |
| **Claude Code** | `.claude/agents/*.md` (project) or `~/.claude/agents/*.md` (user, all projects) | Copy the installed files there and drop the `.agent` part of the extension, e.g. `cp .github/agents/security.agent.md .claude/agents/security.md`. The YAML frontmatter (`name`, `description`) is compatible; Claude also supports an optional `tools:`/`model:` field you can add per agent. |
| **Codex CLI** | No dedicated per-agent file format at the time of writing — Codex reads a single `AGENTS.md` for instructions. | Reference the relevant agent file(s) from `AGENTS.md` (e.g. "When reviewing security, follow `.github/agents/security.agent.md`"), or paste the agent's body into `AGENTS.md` directly. |

Because every agent file here is self-contained (see the self-sufficiency rule above), copying it
as-is to another host's expected location is safe — there's never a hidden skill/instruction
dependency to bring along separately.




