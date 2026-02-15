# Zed Agent Skills

**让 Zed Agent 使用 Superpowers 技能系统的最简单方式**

## 🎯 一句话说明

新对话时让 Agent 调用 `activate_superpowers` 工具，即可启用 30+ skills。

---

## 🚀 快速开始

### 1. 构建

```bash
cd ~/c6x_local/my_apps/MCP/zed-agent-skills
pnpm install
pnpm build
```

### 2. 配置 Zed

编辑 `~/.config/zed/settings.json`：

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

**记得替换 `YOUR_USERNAME`！**

### 3. 重启 Zed

退出并重新打开 Zed Editor。

### 4. 使用

在新对话中输入：

```
请调用 activate_superpowers
```

或直接在 system_prompt 中配置：

```json
{
  "agent": {
    "profiles": {
      "your-profile": {
        "system_prompt": "每个新对话开始时，首先调用 activate_superpowers 工具启用 skills。"
      }
    }
  }
}
```

---

## 📚 可用工具

| 工具 | 用途 | 何时使用 |
|------|------|---------|
| `activate_superpowers` | 启用 skills 系统 | 每个新对话开始时（一次） |
| `load_skill(name)` | 加载特定 skill | Agent 根据需要自动调用 |
| `list_skills()` | 列出所有 skills | Agent 需要发现 skills 时 |

---

## 📖 文档

- [简单使用指南](docs/USAGE-SIMPLE.md) - 最简使用方式
- [架构说明](docs/ARCHITECTURE.md) - 技术细节

---

## 🔧 要求

- Zed Editor v0.223.3+
- Node.js v18+
- Skills 目录: `~/.claude/skills/` 或 `~/.agents/skills/`

---

## 📝 版本

**v3.0.0** - 2026-02-15
- ✨ 新增 `activate_superpowers` 工具
- ✅ 更简单的激活方式
- 🎯 "简单就是王道"

---

**作者**: Felix (@Coffelix2023)  
**协议**: MIT
