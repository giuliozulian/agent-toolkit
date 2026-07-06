/**
 * Maps an agent id to the skill ids it depends on. When a user interactively
 * selects an agent during `init`, its dependent skills are installed
 * automatically — skills are not offered as a separate interactive choice.
 */
export const AGENT_SKILL_DEPENDENCIES: Record<string, string[]> = {
  coordinator: ["grilling"],
  frontend: ["frontend-design"],
  accessibility: [
    "accessibility-general",
    "forms-a11y",
    "keyboard-a11y",
    "color-contrast-a11y",
    "aria-live-regions-a11y",
    "frontend-a11y",
  ],
};
