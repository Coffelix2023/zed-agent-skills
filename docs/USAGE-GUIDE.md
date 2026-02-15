# Zed Agent Skills 使用指南

## 🚀 快速开始

### 方式 1: 使用 Slash Command（推荐）

在新对话中输入：

```
/initialize
```

这会自动调用 MCP `initialize` prompt，加载 `using-superpowers` skill。

### 方式 2: 手动调用 Tool

```
请帮我 initialize superpowers
```

Agent 会调用 `initialize` prompt（如果理解你的意图）。

---

## 📖 工作流程

### 步骤 1: 初始化（每个新对话）

```
/initialize
```

**Agent 会学到**：
- 如何发现和使用 skills
- 何时应该加载特定 skill
- Skills 的优先级和工作流程

### 步骤 2: 正常交互

初始化后，Agent 会根据 `using-superpowers` 的指导自动：
- 判断任务是否需要特定 skill
- 调用 `list_skills()` 查看可用 skills
- 调用 `load_skill(name)` 加载需要的 skill
- 遵循 skill 的 workflow

---

## 💡 示例对话

### 示例 1: Hello Skill

```
User: /initialize
Agent: [加载 using-superpowers skill, 说明已初始化]

User: hello
Agent: [根据 using-superpowers 指导，检测到 greeting，调用 load_skill("hello-skill")]
      [触发了✏️Hello-Skill]
      你好！...
```

### 示例 2: 架构设计

```
User: /initialize
Agent: [初始化完成]

User: 我想设计一个电商系统的架构
Agent: [检测到架构设计任务]
      [调用 load_skill("architecture-designer")]
      [使用 architecture-designer skill]
      让我按照架构设计流程来帮你...
```

---

## ⚙️ 配置说明

### 为什么不能自动初始化？

Zed 目前**不支持** MCP Prompt 的自动触发（SessionStart Hook）。

对比其他平台：
- **Claude Code**: ✅ 支持 SessionStart hook
- **Codex CLI**: ✅ 原生集成
- **Zed Editor**: ❌ 需要手动调用

### 未来可能的改进

Zed 可能在未来版本支持：
1. Agent Profile 中配置 `init_prompts`
2. 会话开始时自动调用指定 prompts
3. 用户无需手动输入 `/initialize`

---

## 🎯 最佳实践

### DO ✅

1. **每个新对话开始时运行 `/initialize`**
   - 这是一次性操作（每个对话开始时）
   - 加载 using-superpowers skill
   - Agent 获得使用其他 skills 的能力

2. **信任 Agent 的判断**
   - 初始化后，Agent 会自己决定何时加载 skills
   - 你不需要手动说 "load XX skill"

3. **创建快捷方式**
   - 在 Zed 中设置 Text Snippet:
     - 触发词: `init`
     - 展开为: `/initialize`

### DON'T ❌

1. **不要在 system_prompt 中硬编码 skill 触发规则**
   - 不可扩展
   - 违反设计初衷

2. **不要每次都手动 load skill**
   - using-superpowers 已经教会了 Agent 如何使用 skills
   - Agent 会根据任务自动决定

3. **不要期望完全自动化（目前）**
   - Zed 不支持 SessionStart Hook
   - `/initialize` 是必需的手动步骤

---

## 🔧 故障排除

### 问题: 输入 `/initialize` 没有反应

**解决方案**:
1. 确认 MCP Server 运行正常（绿点）
2. 确认 profile 中启用了 `zed-agent-skills`
3. 尝试完整输入: `请运行 initialize prompt`

### 问题: Agent 初始化后仍不使用 skills

**解决方案**:
1. 检查 using-superpowers skill 是否正确加载
2. 检查 `~/.claude/skills/using-superpowers/SKILL.md` 是否存在
3. 在对话中提醒: "记得使用 skills"

---

## 📚 相关文档

- [Architecture](ARCHITECTURE.md) - 技术架构
- [Auto-Loading](AUTO-LOADING.md) - 自动加载机制说明
- [Troubleshooting](TROUBLESHOOTING.md) - 常见问题

---

**更新时间**: 2026-02-15  
**版本**: 1.0.0
