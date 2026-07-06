/**
 * Maps an agent id to the skill ids it depends on. When a user interactively
 * selects an agent during `init`, its dependent skills are installed
 * automatically — skills are not offered as a separate interactive choice.
 */
const AGENT_SPECIFIC_SKILLS: Record<string, string[]> = {
  coordinator: ["grilling"],
  devops: ["ci-cd"],
  database: ["postgres"],
  copy: ["copywriting"],
  security: ["security"],
  design: ["design-taste-frontend"],
  testing: ["writing-tests"],
  frontend: ["frontend-design"],
  performance: ["web-performance-optimization"],
  geo: ["seo-geo-aeo"],
  seo: ["seo-geo-aeo"],
  pm: ["docs-maintenance"],
  "code-review": ["code-review"],
  release: ["release-skills"],
  accessibility: [
    "accessibility-general",
    "forms-a11y",
    "keyboard-a11y",
    "color-contrast-a11y",
    "aria-live-regions-a11y",
    "frontend-a11y",
  ],
};

/** Every agent that ships in this package (used to apply team-wide skills below). */
const ALL_AGENT_IDS = [
  "coordinator",
  "backend",
  "frontend",
  "design",
  "accessibility",
  "performance",
  "security",
  "testing",
  "database",
  "devops",
  "geo",
  "seo",
  "copy",
  "code-review",
  "release",
  "pm",
];

/**
 * Skills applied to every agent regardless of its specialty. `caveman`
 * compresses output tokens (terser replies, same technical substance) —
 * a cross-cutting concern, not owned by any single agent.
 */
const TEAM_WIDE_SKILLS = ["caveman"];

export const AGENT_SKILL_DEPENDENCIES: Record<string, string[]> = Object.fromEntries(
  ALL_AGENT_IDS.map((id) => [id, [...(AGENT_SPECIFIC_SKILLS[id] ?? []), ...TEAM_WIDE_SKILLS]]),
);
