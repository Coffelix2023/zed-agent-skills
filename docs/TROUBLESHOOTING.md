# 故障排除 - Agent 不主动调用 Skills

## 问题：Agent 有工具但不使用

### 症状
- MCP Server 运行正常（绿点）
- Agent 有 `load_skill` 和 `list_skills` 工具
- 但 Agent 不主动调用这些工具
- 没有"头部声明"（使用 XX skill）

### 根本原因
Zed 不支持 SessionStart hook，Agent 需要通过 `system_prompt` 告知要使用 skills。

### 解决方案

#### 1. 使用强制性 system_prompt

在 Agent Profile 中添加：

```json
"system_prompt": "🚨 MANDATORY SKILL-CHECK PROTOCOL 🚨\n\nFOR EVERY USER MESSAGE, YOU MUST:\n\n1️⃣ FIRST ACTION: Call list_skills() - NO EXCEPTIONS\n2️⃣ ANALYZE: Does ANY skill apply? (1% probability = YES)\n3️⃣ IF YES: Call load_skill(name) BEFORE responding\n4️⃣ ANNOUNCE: \"✅ Using [skill] skill\"\n5️⃣ FOLLOW: Execute skill instructions exactly\n\n❌ FORBIDDEN:\n- Respond without checking skills first\n- Ask questions before skill check\n\n✅ EVERY RESPONSE MUST START WITH:\n- Tool call: list_skills() or load_skill()\n- OR: \"Checked skills: none apply\"\n\nThis is NON-NEGOTIABLE."
```

#### 2. 使用 Sonnet 模型

Haiku 模型的指令遵循能力较弱，建议使用：

```json
"default_model": {
  "provider": "copilot_chat",
  "model": "claude-sonnet-4.5"
}
```

#### 3. 用户触发词

如果 system_prompt 还是不够，在对话开始时说：

```
[Check skills] your task here
```

或：

```
Remember to check skills first: your task
```

### 对比：为什么当前 Agent 可以？

本对话窗口的 Agent (Claude Sonnet 4.5 in Zed) 可以主动使用 skills，因为：

1. ✅ 使用 Sonnet 模型（指令遵循强）
2. ✅ 有明确的 Rule-101 指引
3. ✅ 用户已经说过"使用 skills"

你配置的 c6x-thk profile 现在也应该有同样的能力（已配置 Sonnet + 强制 prompt）。

---

**更新时间**: 2026-02-15  
**版本**: 2.0.1
