# Skills 自动加载机制对比

## 技术限制

### Zed 当前不支持
❌ SessionStart Hook (MCP Prompts API 的 `initialize` 在新对话时不会自动触发)  
❌ Agent Lifecycle Hooks  
❌ 默认工具预加载  

### 可用方案
✅ `system_prompt` - 通过配置文件告知 Agent 行为规则  
✅ User trigger words - 用户在对话开始时说 "check skills"  
✅ Custom Rules (Rule-101) - 在用户自定义规则中添加 skill 协议  

---

## 实现路径对比

### Codex/Claude Code (原生支持)
```
会话开始
  ↓
SessionStart Hook 触发
  ↓
自动调用 initialize prompt
  ↓
注入 using-superpowers skill
  ↓
Agent 获得 skill 能力
```

### Zed Agent (当前实现)
```
会话开始
  ↓
加载 Agent Profile
  ↓
读取 system_prompt
  ↓
Agent 被告知: "每次都检查 skills"
  ↓
收到用户消息
  ↓
Agent 主动调用 list_skills() / load_skill()
```

---

## 为什么需要 system_prompt？

**核心问题**: Zed Agent 不知道 MCP Server 提供了 skill 相关工具

**解决方案**: 通过 `system_prompt` 显式告知:
1. 有 `list_skills()` 和 `load_skill()` 工具可用
2. 必须在回复前先检查这些工具
3. 提供具体的使用场景和触发条件

---

## 最佳实践

### 推荐配置层次

1. **项目级 (Project)** - 项目 `.zed/settings.json`  
   适用于: 特定项目需要特定 skills

2. **用户级 (User)** - `~/.config/zed/settings.json`  
   适用于: 个人通用 skill 协议

3. **全局规则 (Global)** - Rule-101 / Custom Instructions  
   适用于: 所有 Agent 会话统一行为

### 示例配置

```json
{
  "agent": {
    "profiles": {
      "my-profile": {
        "name": "My Profile",
        "system_prompt": "...[skill protocol]...",
        "context_servers": {
          "zed-agent-skills": {
            "tools": {
              "load_skill": true,
              "list_skills": true
            }
          }
        }
      }
    }
  }
}
```

---

## 未来改进方向

### Zed 可能支持的功能 (需要官方实现)

1. **MCP Prompt Auto-trigger**  
   允许 MCP Server 声明某些 prompts 在会话开始时自动运行

2. **Agent Profile Hooks**  
   支持 `on_session_start`, `on_message_received` 等生命周期钩子

3. **Default Tool Preloading**  
   允许在 Agent Profile 中预加载特定工具/prompts

### 社区贡献方向

- 提交 Feature Request 到 Zed 官方仓库
- 分享 system_prompt 最佳实践
- 开发更智能的 skill 匹配算法

---

**更新时间**: 2026-02-15  
**版本**: 1.0.0
