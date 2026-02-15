# Rule-101 Skill 检查协议扩展

在 Rule-101 的 `## General Principles` 后添加：

---

## Skill Loading Protocol (Skills 优先协议)

**适用条件**: 当环境中可用 `list_skills()` 和 `load_skill()` 工具时

### 强制执行规则

1. **每次对话开始时**, 自动调用 `list_skills()` 获取可用技能列表
2. **收到用户消息时**, 先判断是否有匹配的 skill:
   - 关键词匹配 (如 "hello" → hello-skill)
   - 任务类型匹配 (如 "设计架构" → architecture-designer)
   - 不确定时, 优先调用 `list_skills()` 分析
3. **加载 skill 后**, 在回复头部声明: `[使用 XX skill]`
4. **遵循 skill workflow**, 不得跳过或简化步骤

### 触发示例

| 用户输入 | 自动加载 Skill | 声明格式 |
|---------|---------------|---------|
| "hello", "hi", "你好" | `hello-skill` | `[使用 hello-skill]` |
| "设计一个系统" | `architecture-designer` | `[使用 architecture-designer]` |
| "审查代码" | `code-reviewer` | `[使用 code-reviewer]` |
| "调试问题" | `systematic-debugging` | `[使用 systematic-debugging]` |

### 禁止行为

- ❌ 不检查 skills 就直接回答
- ❌ "这个问题太简单不需要 skill"
- ❌ "我记得这个 skill 的内容"（必须重新加载）
- ❌ 先问澄清问题再检查 skills（应反过来）

### 工具使用优先级

```
用户消息 → list_skills() → 分析匹配度 → load_skill(name) → 执行 skill workflow → 回复用户
```

---

添加此协议后, 所有支持 MCP 的 Agent profile 都将自动遵循 skills 优先原则。
