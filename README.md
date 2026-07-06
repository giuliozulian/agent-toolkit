# ai-agents-team

A team of 17 specialized AI agents (coordinator, backend, frontend, design, designer, accessibility, performance, security, testing, database, devops, geo, seo, copy, code-review, release, pm) for web development, distributed as a small CLI so every project can install and update them from one place instead of copy-pasting files by hand.

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

`sync` updates only files already installed in your project (tracked by the lock file).
If new templates were added to the toolkit (for example a new agent), `sync` now prints
an explicit notice and tells you to run `init` to install them.

`init` copies selected agents/skills/instructions into `.github/` in the current project and writes a
`.github/ai-agents-team.lock.json` manifest (content hash + version per file). `sync` re-copies template
files whose local hash still matches the manifest (i.e. untouched since install) and **skips** files that
were customized locally, unless `--force` is passed. During `init`, the CLI also ensures these managed
outputs are listed in `.gitignore` (`.github/agents/`, `.github/skills/`, `.github/instructions/`, and
`.github/ai-agents-team.lock.json`) to avoid accidental commits.

## Repo layout

- `src/` — CLI source (TypeScript, ESM, built with `tsup`).
- `src/lib/remoteSkills.ts` — registry of skills fetched live from their upstream source at `init`/`sync` time (see below).
- `templates/agents/*.agent.md` — 17 generic sub-agents (coordinator, backend, frontend, design, designer, accessibility, performance, security, testing, database, devops, geo, seo, copy, code-review, release, pm).
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
dependency — the expertise/checklist is written inline in the agent file). Twelve exceptions, all
fetched live at `init`/`sync` time (see Self-sufficiency rule above) — nothing manual required:

- all agents use `caveman` (team-wide compression skill);
- `coordinator` uses [`grilling`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) ([mattpocock/skills](https://github.com/mattpocock/skills)) to stress-test a plan with the user before delegating work.
- `frontend` uses [`frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) (Apache-2.0, [anthropics/skills](https://github.com/anthropics/skills)).
- `designer` uses [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md) from [tasteskill.dev](https://www.tasteskill.dev/) ([Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)) to define interface direction and collaborate with frontend on implementation.
- `devops` uses [`ci-cd`](https://github.com/ahmedasmar/devops-claude-skills/blob/main/ci-cd/skills/SKILL.md) from [ahmedasmar/devops-claude-skills](https://github.com/ahmedasmar/devops-claude-skills) for CI/CD and DevSecOps pipeline workflows.
- `database` uses [`postgres`](https://github.com/planetscale/database-skills/blob/main/skills/postgres/SKILL.md) from [planetscale/database-skills](https://github.com/planetscale/database-skills) for database design, query optimization, and performance triage workflows.
- `copy` uses [`copywriting`](https://github.com/coreyhaines31/marketingskills/blob/main/skills/copywriting/SKILL.md) from [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) for conversion-oriented copywriting and messaging workflows.
- `security` uses [`security`](https://github.com/openhands/skills/blob/main/skills/security/SKILL.md) from [openhands/skills](https://github.com/openhands/skills) for secure-coding and vulnerability-prevention workflows.
- `performance` uses [`web-performance-optimization`](https://github.com/sickn33/antigravity-awesome-skills/blob/main/skills/web-performance-optimization/SKILL.md) from [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) for systematic web performance optimization workflows.
- `geo` uses [`seo-geo-aeo`](https://github.com/SNLabat/SEO-GEO-AEO-Skill/blob/main/SKILL.md) from [SNLabat/SEO-GEO-AEO-Skill](https://github.com/SNLabat/SEO-GEO-AEO-Skill) for GEO-aware search optimization workflows.
- `seo` uses the same [`seo-geo-aeo`](https://github.com/SNLabat/SEO-GEO-AEO-Skill/blob/main/SKILL.md) skill for full SEO/GEO/AEO audits and optimization.
- `pm` uses [`docs-maintenance`](https://github.com/jeffrigby/somepulp-agents/blob/main/plugins/codebase-health/skills/docs-maintenance/SKILL.md) from [jeffrigby/somepulp-agents](https://github.com/jeffrigby/somepulp-agents) for documentation synchronization and maintenance workflows.
- `code-review` uses [`code-review`](https://github.com/petyosi/rc/blob/master/claude/skills/code-review/SKILL.md) from [petyosi/rc](https://github.com/petyosi/rc) for structured pre-PR review flows.
- `release` uses [`release-skills`](https://github.com/JimLiu/baoyu-skills/blob/main/.claude/skills/release-skills/SKILL.md) from [JimLiu/baoyu-skills](https://github.com/JimLiu/baoyu-skills) for cross-project release workflow automation.
- `accessibility` uses six skills from [mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills) (AGPL-3.0) and [mikemai2awesome/agent-skills](https://github.com/mikemai2awesome/agent-skills) (see table below).

| | Agent | Description | Skill it uses |
|---|---|---|---|
| 🧭 | `coordinator` | Coordinates multi-step engineering work across all the specialist agents below: plans, delegates, integrates, and verifies the result. | Team-wide `caveman` + live-fetched: [`grilling`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md) → `.github/skills/grilling/`. |
| ⚙️ | `backend` | Implements and reviews server-side logic, APIs, business logic, and third-party integrations. | Team-wide `caveman` + inline checklist. |
| 🖥️ | `frontend` | Implements and refactors UI components/pages, matching existing project conventions. | Team-wide `caveman` + live-fetched: [`frontend-design`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) → `.github/skills/frontend-design/`. |
| 🎨 | `design` | Reviews and defines design tokens, layout, spacing, and visual/UX consistency. | Team-wide `caveman` + inline checklist. |
| 🧩 | `designer` | Defines interface direction and works with frontend to ship implementation-ready UI specs and handoff. | Team-wide `caveman` + live-fetched: [`design-taste-frontend`](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md) → `.github/skills/design-taste-frontend/`. |
| ♿ | `accessibility` | Audits UI against WCAG for keyboard nav, screen readers, contrast, and semantics. | Team-wide `caveman` + live-fetched: `accessibility-general`, `forms-a11y`, `keyboard-a11y`, `color-contrast-a11y`, `aria-live-regions-a11y` (from [mgifford/accessibility-skills](https://github.com/mgifford/accessibility-skills)) and `frontend-a11y` (from [mikemai2awesome/agent-skills](https://github.com/mikemai2awesome/agent-skills)) → `.github/skills/`. |
| ⚡ | `performance` | Reviews rendering, bundle size, network requests, and data-access performance. | Team-wide `caveman` + live-fetched: [`web-performance-optimization`](https://github.com/sickn33/antigravity-awesome-skills/blob/main/skills/web-performance-optimization/SKILL.md) → `.github/skills/web-performance-optimization/`. |
| 🌍 | `geo` | Implements and reviews geolocation, maps, and spatial queries (e.g. PostGIS). | Team-wide `caveman` + live-fetched: [`seo-geo-aeo`](https://github.com/SNLabat/SEO-GEO-AEO-Skill/blob/main/SKILL.md) → `.github/skills/seo-geo-aeo/`. |
| 🔎 | `seo` | Audits and improves SEO, GEO, and AEO outcomes for websites and web apps. | Team-wide `caveman` + live-fetched: [`seo-geo-aeo`](https://github.com/SNLabat/SEO-GEO-AEO-Skill/blob/main/SKILL.md) → `.github/skills/seo-geo-aeo/`. |
| 🔒 | `security` | Reviews code/designs for OWASP Top 10-style vulnerabilities and risky config/dependencies. | Team-wide `caveman` + live-fetched: [`security`](https://github.com/openhands/skills/blob/main/skills/security/SKILL.md) → `.github/skills/security/`. |
| 🧪 | `testing` | Designs/writes automated tests, reviews coverage, diagnoses flaky failures. | Team-wide `caveman` + inline checklist. |
| 🗄️ | `database` | Designs and reviews schema, migrations, indexes, and constraints. | Team-wide `caveman` + live-fetched: [`postgres`](https://github.com/planetscale/database-skills/blob/main/skills/postgres/SKILL.md) → `.github/skills/postgres/`. |
| 🚀 | `devops` | Reviews/implements CI/CD pipelines, build/deploy config, and infrastructure as code. | Team-wide `caveman` + live-fetched: [`ci-cd`](https://github.com/ahmedasmar/devops-claude-skills/blob/main/ci-cd/skills/SKILL.md) → `.github/skills/ci-cd/`. |
| ✍️ | `copy` | Centralizes UI strings, manages i18n/translations, keeps terminology consistent. | Team-wide `caveman` + live-fetched: [`copywriting`](https://github.com/coreyhaines31/marketingskills/blob/main/skills/copywriting/SKILL.md) → `.github/skills/copywriting/`. |
| 🔍 | `code-review` | Reviews changes for quality/readability pre-merge and runs the lint/typecheck/build gate. | Team-wide `caveman` + live-fetched: [`code-review`](https://github.com/petyosi/rc/blob/master/claude/skills/code-review/SKILL.md) → `.github/skills/code-review/`. |
| 🏷️ | `release` | Manages semantic versioning and changelog entries. | Team-wide `caveman` + live-fetched: [`release-skills`](https://github.com/JimLiu/baoyu-skills/blob/main/.claude/skills/release-skills/SKILL.md) → `.github/skills/release-skills/`. |
| 📋 | `pm` | Maintains project documentation, changelog, and status tracking. | Team-wide `caveman` + live-fetched: [`docs-maintenance`](https://github.com/jeffrigby/somepulp-agents/blob/main/plugins/codebase-health/skills/docs-maintenance/SKILL.md) → `.github/skills/docs-maintenance/`. |

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




