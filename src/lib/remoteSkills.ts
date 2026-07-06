/**
 * Registry of skills that are fetched live from their upstream source at
 * `init`/`sync` time, instead of being vendored as static files in this
 * package. This guarantees the installed skill is always the latest
 * upstream version, at the cost of requiring network access during
 * `init`/`sync` and trusting the content served by the source URL at
 * that moment (no local pinned/reviewed copy).
 */
export interface RemoteSkillFile {
  /** URL the file's content is fetched from at install/sync time. */
  url: string;
  /** File name to write under `.github/skills/<skillId>/`. */
  targetName: string;
}

export interface RemoteSkillDefinition {
  id: string;
  files: RemoteSkillFile[];
}

export const REMOTE_SKILLS: RemoteSkillDefinition[] = [
  {
    id: "ci-cd",
    files: [
      {
        url: "https://raw.githubusercontent.com/ahmedasmar/devops-claude-skills/main/ci-cd/skills/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "postgres",
    files: [
      {
        url: "https://raw.githubusercontent.com/planetscale/database-skills/main/skills/postgres/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "copywriting",
    files: [
      {
        url: "https://raw.githubusercontent.com/coreyhaines31/marketingskills/main/skills/copywriting/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "security",
    files: [
      {
        url: "https://raw.githubusercontent.com/openhands/skills/main/skills/security/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "design-taste-frontend",
    files: [
      {
        url: "https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "frontend-design",
    files: [
      {
        url: "https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md",
        targetName: "SKILL.md",
      },
      {
        url: "https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/LICENSE.txt",
        targetName: "LICENSE.txt",
      },
    ],
  },
  {
    id: "accessibility-general",
    files: [
      {
        url: "https://raw.githubusercontent.com/mgifford/accessibility-skills/main/skills/ACCESSIBILITY-general/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "forms-a11y",
    files: [
      {
        url: "https://raw.githubusercontent.com/mgifford/accessibility-skills/main/skills/forms/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "keyboard-a11y",
    files: [
      {
        url: "https://raw.githubusercontent.com/mgifford/accessibility-skills/main/skills/keyboard/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "color-contrast-a11y",
    files: [
      {
        url: "https://raw.githubusercontent.com/mgifford/accessibility-skills/main/skills/color-contrast/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "aria-live-regions-a11y",
    files: [
      {
        url: "https://raw.githubusercontent.com/mgifford/accessibility-skills/main/skills/aria-live-regions/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "frontend-a11y",
    files: [
      {
        url: "https://raw.githubusercontent.com/mikemai2awesome/agent-skills/main/skills/frontend-a11y/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "web-performance-optimization",
    files: [
      {
        url: "https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/skills/web-performance-optimization/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "seo-geo-aeo",
    files: [
      {
        url: "https://raw.githubusercontent.com/SNLabat/SEO-GEO-AEO-Skill/main/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "docs-maintenance",
    files: [
      {
        url: "https://raw.githubusercontent.com/jeffrigby/somepulp-agents/main/plugins/codebase-health/skills/docs-maintenance/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "code-review",
    files: [
      {
        url: "https://raw.githubusercontent.com/petyosi/rc/master/claude/skills/code-review/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "release-skills",
    files: [
      {
        url: "https://raw.githubusercontent.com/JimLiu/baoyu-skills/main/.claude/skills/release-skills/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "grilling",
    files: [
      {
        url: "https://raw.githubusercontent.com/mattpocock/skills/main/skills/productivity/grilling/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
  {
    id: "caveman",
    files: [
      {
        url: "https://raw.githubusercontent.com/JuliusBrussee/caveman/main/skills/caveman/SKILL.md",
        targetName: "SKILL.md",
      },
    ],
  },
];

export async function fetchRemoteText(url: string): Promise<string> {
  const maxAttempts = 3;
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.text();
      }
      lastError = new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      // Only retry on rate limiting / transient server errors.
      if (response.status !== 429 && response.status < 500) {
        throw lastError;
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw lastError ?? new Error(`Failed to fetch ${url}`);
}
