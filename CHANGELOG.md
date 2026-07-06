# Changelog

All notable changes to this package are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

### Added
- `performance` now auto-installs the live-fetched `web-performance-optimization` skill from `sickn33/antigravity-awesome-skills`.
- New `seo` agent for SEO/GEO/AEO audits and optimization workflows.
- `geo` and `seo` now auto-install the live-fetched `seo-geo-aeo` skill from `SNLabat/SEO-GEO-AEO-Skill`.

## [0.1.2] - 2026-07-06

### Added
- New `designer` agent focused on interface direction and frontend handoff collaboration.
- Live-fetched `design-taste-frontend` skill (from `Leonxlnx/taste-skill`) auto-installed when `designer` is selected.
- README updates for the new `designer` role and skill mapping (team now includes 16 agents).
- `init` now auto-updates consumer `.gitignore` with toolkit-managed outputs (`.github/agents/`, `.github/skills/`, `.github/instructions/`, `.github/ai-agents-team.lock.json`).

### Changed
- `sync` now detects templates newly introduced by the toolkit but not yet installed in the project, and prints an explicit message to run `init` for installing them.

## [0.1.1] - 2026-07-06

### Changed
- `init` interactive prompt now lists only `agents/*` and `instructions/*` (skills are no longer a manual selection).
- Skill files are auto-installed based on selected agent dependencies (e.g. `frontend` -> `frontend-design`, `accessibility` -> accessibility skills, `coordinator` -> `grilling`).

## [0.1.0] - 2026-07-06

### Added
- CLI (`ai-agents-team`) with `init`, `sync`, and `list` commands.
- Manifest-based (`.github/ai-agents-team.lock.json`) hash tracking to detect locally-modified files and avoid silent overwrites during `sync`.
- First set of generic sub-agents: `coordinator`, `security-reviewer`, `frontend-engineer`, `accessibility-auditor`, `performance-auditor`, `qa-test-engineer`.
