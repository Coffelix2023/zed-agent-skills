# Changelog

## [3.0.0] - 2026-02-15

### ✨ Added
- **`activate_superpowers` 工具** - 一键启用 skills 系统
  - 更简单的激活方式
  - 作为 tool 比 prompt 更容易被调用
  - 返回友好的激活确认信息

### 🎯 Philosophy
- **简单就是王道** - 减少配置复杂度
- **一次调用** - 无需复杂的 system_prompt
- **向后兼容** - 保留 `initialize` prompt

### 📦 Tools Overview
1. `activate_superpowers` - 启用 skills（新对话开始时）
2. `load_skill(name)` - 加载特定 skill
3. `list_skills()` - 列出可用 skills

---

## [2.0.0] - 2026-02-14

### Added
- MCP Prompts API 支持
- `initialize` prompt
- 多层目录优先级

---

## [1.0.0] - 2026-02-13

### Added
- 基础 MCP Server
- `load_skill` 和 `list_skills` tools
