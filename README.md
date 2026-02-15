# Zed Agent Skills

**Make Zed Agent smarter with the Superpowers skill system.**

An MCP (Model Context Protocol) server that brings Claude Code/Codex-style skill workflows to Zed Editor's native agent.

## 🎯 What This Does

- **Auto-inject** `using-superpowers` skill at conversation start
- **Dynamic loading** of 29+ skills (TDD, debugging, code review, etc.)
- **Multi-directory** skill discovery (project → personal → framework)
- **Zero configuration** once installed

## 🚀 Quick Start

### 1. Build

```bash
cd ~/c6x_local/my_apps/MCP/zed-agent-skills
pnpm install
pnpm build
```

### 2. Configure Zed

Add to `~/.config/zed/settings.json`:

```json
{
  "context_servers": {
    "zed-agent-skills": {
      "command": "node",
      "args": [
        "/Users/YOUR_USERNAME/c6x_local/my_apps/MCP/zed-agent-skills/build/index.js"
      ]
    }
  }
}
```

**Important**: Replace `YOUR_USERNAME` with your actual username!

### 3. Restart Zed

Quit and relaunch Zed Editor.

### 4. Verify

1. Open Agent Panel
2. Click Settings (gear icon)
3. Look for **"zed-agent-skills"**
4. Status should show 🟢 green dot

### 5. Use It

In any new conversation:

```
initialize superpowers
```

Agent will load the core workflow and be ready to use skills!

## 📚 Available Tools

### Prompts
- **`initialize`** - Load using-superpowers skill (use at conversation start)

### Tools
- **`load_skill(name)`** - Load a specific skill
- **`list_skills()`** - See all available skills

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md) - How it works
- [Usage Guide](docs/USAGE.md) - Detailed workflows (coming soon)

## 🔧 Requirements

- **Zed Editor** v0.223.3+
- **Node.js** v18+
- **Skills directory** at `~/.claude/skills/` or `~/.agents/skills/`

## 🏗️ Project Structure

```
zed-agent-skills/
├── src/index.ts          # MCP Server source
├── build/index.js        # Compiled server (git-ignored)
├── docs/
│   └── ARCHITECTURE.md   # Technical design
└── README.md             # This file
```

## 🤝 Integration with Superpowers

This MCP server is designed to work with the [Superpowers](https://github.com/superpowers-dev/superpowers) framework.

**Install Superpowers skills**:

```bash
cd ~/.claude
git clone https://github.com/superpowers-dev/superpowers.git
cd ~/.claude/skills
ln -s ../superpowers/skills/* .
```

## 🐛 Troubleshooting

**MCP server not running?**
```bash
# Check build output
ls ~/c6x_local/my_apps/MCP/zed-agent-skills/build/index.js

# Check Zed logs
tail -f ~/Library/Logs/Zed/Zed.log
```

**Skills not found?**
```bash
# Verify skills directory
ls ~/.claude/skills/using-superpowers/
```

## 📝 License

MIT

## 👤 Author

Felix (@Coffelix2023)

---

**Version**: 2.0.0  
**Last Updated**: 2026-02-15
