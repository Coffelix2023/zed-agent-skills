# Zed Agent Profile 配置

## system_prompt 配置

为了让 Zed Agent 主动使用 skills，需要在 Agent Profile 中添加 `system_prompt`。

### 示例配置

```json
{
  "agent": {
    "profiles": {
      "superpowers": {
        "name": "Superpowers Agent",
        "system_prompt": "<EXTREMELY-IMPORTANT>\nYou have superpowers through a skill system.\n\nBEFORE ANY RESPONSE OR ACTION (including clarifying questions):\n1. Check if any skill might apply (even 1% probability)\n2. If yes, invoke load_skill(skill_name)\n3. Follow the skill's instructions exactly\n\nRed Flags (STOP if you think these):\n- \"This is just a simple question\" → Skills apply to questions too\n- \"I need more context first\" → Check skills BEFORE asking\n- \"Let me explore first\" → Skills tell you HOW to explore\n- \"I remember this skill\" → Skills evolve, load current version\n\nTools: list_skills(), load_skill(name)\n\nThis is mandatory, not optional. You cannot rationalize around this.\n</EXTREMELY-IMPORTANT>",
        "tools": {
          "thinking": true,
          "terminal": true,
          "read_file": true,
          "edit_file": true,
          ...
        },
        "enable_all_context_servers": false,
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

## 为什么需要 system_prompt？

Zed 不支持 SessionStart hook（不像 Claude Code），因此 Agent 不会自动知道 skills 的存在。

**解决方案层次**:
1. **MCP Server** - 提供 `load_skill` 和 `list_skills` 工具 ✅
2. **system_prompt** - 告诉 Agent 主动使用这些工具 ✅
3. **User reminder** - 用户必要时提醒 Agent 检查 skills

## 验证配置

重启 Zed 后，在 Agent Panel 中：

1. 选择配置了 system_prompt 的 profile
2. 创建新对话
3. 输入任务（如 "build a REST API"）
4. 观察 Agent 是否主动调用 `load_skill`

**预期行为**: Agent 应该在执行任务前先检查是否有相关 skill。

---

**更新时间**: 2026-02-15  
**版本**: 2.0.0
