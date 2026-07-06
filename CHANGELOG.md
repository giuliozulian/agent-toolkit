# Changelog

All notable changes to this package are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.1] - 2026-07-06

### Changed
- `init` interactive prompt now lists only `agents/*` and `instructions/*` (skills are no longer a manual selection).
- Skill files are auto-installed based on selected agent dependencies (e.g. `frontend` -> `frontend-design`, `accessibility` -> accessibility skills, `coordinator` -> `grilling`).

## [0.1.0] - 2026-07-06

### Added
- CLI (`ai-agents-team`) with `init`, `sync`, and `list` commands.
- Manifest-based (`.github/ai-agents-team.lock.json`) hash tracking to detect locally-modified files and avoid silent overwrites during `sync`.
- First set of generic sub-agents: `coordinator`, `security-reviewer`, `frontend-engineer`, `accessibility-auditor`, `performance-auditor`, `qa-test-engineer`.
