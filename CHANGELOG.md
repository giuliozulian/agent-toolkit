# Changelog

All notable changes to this package are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.1.0] - 2026-07-06

### Added
- CLI (`agent-toolkit`) with `init`, `sync`, and `list` commands.
- Manifest-based (`.github/agent-toolkit.lock.json`) hash tracking to detect locally-modified files and avoid silent overwrites during `sync`.
- First set of generic sub-agents: `coordinator`, `security-reviewer`, `frontend-engineer`, `accessibility-auditor`, `performance-auditor`, `qa-test-engineer`.
