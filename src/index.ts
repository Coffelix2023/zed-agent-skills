#!/usr/bin/env node
/**
 * Zed Agent Skills MCP Server
 * 
 * Enables Superpowers skill system in Zed Editor through Model Context Protocol.
 * Provides two key capabilities:
 * 1. Prompts: Auto-inject `using-superpowers` at session start
 * 2. Tools: Dynamic skill loading on-demand
 * 
 * @version 2.0.0
 * @author Felix (@Coffelix2023)
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import os from "os";

// ==================== Configuration ====================

/**
 * Multi-layer skill directory priority
 * Priority 1: Project-specific skills
 * Priority 2: Personal skills
 * Priority 3: Superpowers framework skills (via symlink)
 */
const SKILL_DIRS = [
  path.join(os.homedir(), ".agents", "skills"),   // Project-level
  path.join(os.homedir(), ".claude", "skills"),   // Personal
];

/**
 * Path to the core Superpowers skill
 * This skill teaches the agent how to use all other skills
 */
const USING_SUPERPOWERS_SKILL = path.join(
  os.homedir(),
  ".claude/skills/using-superpowers/SKILL.md"
);

// ==================== MCP Server Setup ====================

const server = new Server(
  {
    name: "zed-agent-skills",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},    // Enable dynamic skill loading
      prompts: {},  // Enable session initialization
    },
  }
);

// ==================== Skill Loading Functions ====================

/**
 * Load a skill by name with priority search
 * Searches through SKILL_DIRS in order until found
 */
async function loadSkill(skillName: string): Promise<string | null> {
  for (const dir of SKILL_DIRS) {
    try {
      const skillPath = path.join(dir, skillName, "SKILL.md");
      const content = await fs.readFile(skillPath, "utf-8");
      return content;
    } catch {
      // Skill not found in this directory, try next
      continue;
    }
  }
  return null;
}

/**
 * List all available skills across all directories
 * Returns deduplicated sorted list
 */
async function listSkills(): Promise<string[]> {
  const allSkills = new Set<string>();

  for (const dir of SKILL_DIRS) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      entries
        .filter((e) => e.isDirectory())
        .forEach((e) => allSkills.add(e.name));
    } catch {
      // Directory doesn't exist or not readable, skip
      continue;
    }
  }

  return Array.from(allSkills).sort();
}

/**
 * Load the using-superpowers skill
 * This is the core skill that teaches the agent the workflow
 */
async function loadUsingSuperPowersSkill(): Promise<string> {
  try {
    return await fs.readFile(USING_SUPERPOWERS_SKILL, "utf-8");
  } catch (error) {
    throw new Error(
      `Failed to load using-superpowers skill: ${error}\n` +
      `Expected path: ${USING_SUPERPOWERS_SKILL}\n` +
      `Please ensure ~/.claude/skills/using-superpowers/SKILL.md exists.`
    );
  }
}

// ==================== MCP Prompts (Session Initialization) ====================

/**
 * List available prompts
 * Currently provides "initialize" prompt for session start
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    {
      name: "initialize",
      description:
        "🚀 Initialize Superpowers workflow - Loads using-superpowers skill. " +
        "USE THIS AT THE START OF EVERY NEW CONVERSATION to enable skill-based development.",
      arguments: [],
    },
  ],
}));

/**
 * Handle prompt requests
 * "initialize" prompt injects using-superpowers into context
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;

  if (name === "initialize") {
    try {
      const content = await loadUsingSuperPowersSkill();

      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `<EXTREMELY_IMPORTANT>
You have superpowers.

**Below is the full content of your 'using-superpowers' skill - your introduction to using skills. For all other skills, use the load_skill tool:**

${content}

</EXTREMELY_IMPORTANT>`,
            },
          },
        ],
      };
    } catch (error) {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `❌ Failed to initialize Superpowers: ${error}`,
            },
          },
        ],
      };
    }
  }

  throw new Error(`Unknown prompt: ${name}`);
});

// ==================== MCP Tools (Dynamic Skill Loading) ====================

/**
 * List available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "load_skill",
      description:
        "Load a skill's full content. Use BEFORE any task if there's even a 1% chance a skill applies. " +
        "Skills contain workflows, checklists, and best practices.",
      inputSchema: {
        type: "object",
        properties: {
          skill_name: {
            type: "string",
            description:
              "Skill name (e.g., 'test-driven-development', 'kontext-expert', 'systematic-debugging')",
          },
        },
        required: ["skill_name"],
      },
    },
    {
      name: "list_skills",
      description: "List all available skills across personal and framework directories",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  ],
}));

/**
 * Handle tool calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "load_skill") {
    const skillName = (args as { skill_name: string }).skill_name;
    const content = await loadSkill(skillName);

    if (!content) {
      const availableSkills = await listSkills();
      return {
        content: [
          {
            type: "text",
            text:
              `❌ Skill '${skillName}' not found.\n\n` +
              `Available skills (${availableSkills.length}):\n` +
              availableSkills.map((s) => `- ${s}`).join("\n") +
              `\n\nUse list_skills to see all available skills.`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `✅ Loaded skill: ${skillName}\n\n${content}`,
        },
      ],
    };
  }

  if (name === "list_skills") {
    const skills = await listSkills();
    return {
      content: [
        {
          type: "text",
          text:
            `📚 Available skills (${skills.length}):\n\n` +
            skills.map((s) => `- ${s}`).join("\n") +
            `\n\nUse load_skill(skill_name) to load a specific skill.`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `❌ Unknown tool: ${name}`,
      },
    ],
  };
});

// ==================== Server Startup ====================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("╔════════════════════════════════════════════════════════════╗");
  console.error("║  🚀 Zed Agent Skills MCP Server v2.0.0                    ║");
  console.error("╠════════════════════════════════════════════════════════════╣");
  console.error("║  Capabilities:                                             ║");
  console.error("║    📌 Prompts: initialize                                  ║");
  console.error("║    🔧 Tools: load_skill, list_skills                       ║");
  console.error("╠════════════════════════════════════════════════════════════╣");
  console.error("║  Skill Directories:                                        ║");
  for (const dir of SKILL_DIRS) {
    console.error(`║    - ${dir.padEnd(53)}║`);
  }
  console.error("╚════════════════════════════════════════════════════════════╝");
}

main().catch((error) => {
  console.error("❌ Fatal error in MCP server:", error);
  process.exit(1);
});
