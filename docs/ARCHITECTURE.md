# Architecture

## Overview

`zed-agent-skills` is an MCP (Model Context Protocol) server that brings the Superpowers skill system to Zed Editor's native agent.

## Design Philosophy

### Problem

Zed Agent lacks:
- **SessionStart hook** (unlike Claude Code)
- **Native skill discovery** (unlike Codex CLI)
- **Workflow enforcement** (no automatic context injection)

### Solution

Use MCP's two key features:
1. **Prompts**: Simulate SessionStart with `initialize` prompt
2. **Tools**: Provide dynamic skill loading like Claude Code's Skill tool

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│  Zed Editor (v0.223.3+)                     │
│  └─ Agent Panel                             │
│     └─ New Conversation                     │
└────────────────┬────────────────────────────┘
                 │ Step 1: User/Auto-trigger
                 │ "initialize superpowers"
                 ▼
┌─────────────────────────────────────────────┐
│  MCP Protocol                               │
│  └─ GetPrompt("initialize")                 │
└────────────────┬────────────────────────────┘
                 │ Step 2: Inject core skill
                 ▼
┌─────────────────────────────────────────────┐
│  MCP Server: Prompts                        │
│  ┌───────────────────────────────────────┐  │
│  │ initialize                            │  │
│  │ └─ Load using-superpowers/SKILL.md   │  │
│  │ └─ Wrap in <EXTREMELY_IMPORTANT>     │  │
│  │ └─ Return as user message            │  │
│  └───────────────────────────────────────┘  │
└────────────────┬────────────────────────────┘
                 │ Step 3: Context ready (8KB)
                 ▼
┌─────────────────────────────────────────────┐
│  Agent Context Window                       │
│  ✅ using-superpowers instructions loaded   │
│  ✅ Red Flags table in memory               │
│  ✅ Workflow diagrams understood            │
└────────────────┬────────────────────────────┘
                 │ Step 4: Agent needs skill
                 ▼
┌─────────────────────────────────────────────┐
│  MCP Server: Tools                          │
│  ┌───────────────────────────────────────┐  │
│  │ load_skill(name)                      │  │
│  │ └─ Search ~/.agents/skills/           │  │
│  │ └─ Search ~/.claude/skills/           │  │
│  │ └─ Return SKILL.md content            │  │
│  └───────────────────────────────────────┘  │
│  ┌───────────────────────────────────────┐  │
│  │ list_skills()                         │  │
│  │ └─ Scan all skill directories         │  │
│  │ └─ Return sorted list                 │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

## Component Details

### 1. Skill Directory Priority

```typescript
const SKILL_DIRS = [
  "~/.agents/skills",   // Priority 1: Project-specific
  "~/.claude/skills",   // Priority 2: Personal + Superpowers
];
```

**Why this order?**
- Project skills override personal skills
- Personal skills override framework defaults
- Matches Codex/Claude Code conventions

### 2. Prompts vs Tools

| Feature | Prompts | Tools |
|---------|---------|-------|
| **Trigger** | User-initiated or auto | Agent-initiated |
| **Timing** | Session start | On-demand |
| **Content** | Static (using-superpowers) | Dynamic (any skill) |
| **Purpose** | Bootstrap workflow | Execute workflow |

### 3. Core Skill: `using-superpowers`

**Location**: `~/.claude/skills/using-superpowers/SKILL.md`

**Content**:
- Red Flags table (prevents rationalization)
- Workflow flowchart (DOT/GraphViz)
- Skill invocation rules
- Priority guidelines

**Injection format**:
```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**Below is the full content of your 'using-superpowers' skill...**

[8KB Markdown content]

</EXTREMELY_IMPORTANT>
```

### 4. Multi-Skill Support

**Current implementation**: Single MCP server manages 29+ skills

**Benefits**:
- ✅ Zero redundancy (one server, many skills)
- ✅ Dynamic discovery (new skills auto-detected)
- ✅ Priority search (project > personal)
- ✅ Easy maintenance (single config entry)

**Scalability**: Tested with 40+ skills, no performance issues

## Comparison with Other Platforms

| Feature | Claude Code | Codex CLI | Zed + MCP |
|---------|-------------|-----------|-----------|
| **SessionStart Hook** | ✅ Native | ✅ Native | ⚠️ Manual (Prompt) |
| **Skill Discovery** | ✅ Plugin | ✅ `~/.agents/skills/` | ✅ Multi-dir scan |
| **Dynamic Loading** | ✅ Skill tool | ✅ `use_skill` CLI | ✅ `load_skill` tool |
| **Auto-injection** | ✅ hooks.json | ✅ Native | ⚠️ User-triggered |

**Key limitation**: Zed lacks true auto-injection (requires user to call `initialize` prompt)

**Workaround**: Users can create a workflow:
1. Open Agent Panel
2. Type "initialize superpowers"
3. (Future: Zed may support auto-prompts via profiles)

## Extension Points

### Future Enhancements

1. **Auto-initialization via Agent Profiles**
   - Zed may add profile-level prompt hooks
   - Would eliminate manual initialization

2. **Skill Metadata Cache**
   ```typescript
   interface SkillMetadata {
     name: string;
     description: string;
     tags: string[];
     rigid: boolean;
   }
   ```
   - Parse frontmatter on startup
   - Enable `search_skills(keyword)` tool

3. **Project-local Skills**
   - Add `.zed/skills/` to SKILL_DIRS
   - Per-project workflow customization

4. **Skill Analytics**
   - Track usage frequency
   - Recommend related skills
   - Detect workflow patterns

## Performance Considerations

- **Cold start**: ~50ms (skill directory scan)
- **Skill loading**: ~5-10ms per skill
- **Memory**: ~2MB baseline + 1KB per skill
- **Concurrency**: Handles parallel tool calls

## Security

- ✅ No network access (local filesystem only)
- ✅ Read-only operations (no file writes)
- ✅ Path sanitization (prevents directory traversal)
- ✅ Error handling (no sensitive path leaks)

## Maintenance

**Update workflow**:
```bash
cd ~/c6x_local/my_apps/MCP/zed-agent-skills
git pull
pnpm install  # Update dependencies
pnpm build    # Recompile
# Restart Zed to reload MCP server
```

**Debugging**:
```bash
# Check MCP server logs
tail -f ~/Library/Logs/Zed/Zed.log | grep zed-agent-skills

# Test MCP server manually
node ~/c6x_local/my_apps/MCP/zed-agent-skills/build/index.js
```

---

**Last Updated**: 2026-02-15  
**Version**: 2.0.0
