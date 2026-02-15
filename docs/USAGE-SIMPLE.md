# 简单使用指南

## 🚀 一句话总结

新对话开始时，让 Agent 调用 `activate_superpowers` 工具即可。

---

## 📋 使用步骤

### 方法 1：让 Agent 自动调用（推荐）

在 `~/.config/zed/settings.json` 的 profile 中添加：

```json
{
  "agent": {
    "profiles": {
      "your-profile": {
        "system_prompt": "在每个新对话开始时，首先调用 activate_superpowers 工具来启用 skills 系统。",
        "context_servers": {
          "zed-agent-skills": {
            "tools": {
              "activate_superpowers": true,
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

### 方法 2：手动触发

在新对话中输入：

```
请调用 activate_superpowers
```

或：

```
/initialize
```

---

## ✅ 验证

成功激活后，Agent 会：
1. 显示 "✅ SUPERPOWERS ACTIVATED"
2. 显示可用 skills 数量
3. 自动学会如何使用其他 skills

之后你说 "hello"，Agent 会自动：
1. 检测到需要 hello-skill
2. 调用 `load_skill("hello-skill")`
3. 在回复中声明并遵循 skill

---

## 🔧 故障排除

### 问题：Agent 没有自动调用

**解决**：在对话开始时手动提醒一次：
```
记得先 activate superpowers
```

### 问题：激活后仍不使用 skills

**检查**：
```bash
ls ~/.claude/skills/using-superpowers/SKILL.md
```

确保文件存在。

---

**就这么简单！**
