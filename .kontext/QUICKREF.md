# 快速参考 - Zed Agent Skills MCP Server

## 🎯 项目概览

**仓库**: https://github.com/Coffelix2023/zed-agent-skills.git  
**本地路径**: ~/c6x_local/my_apps/MCP/zed-agent-skills  
**版本**: 2.0.0  
**状态**: ✅ 开发完成，待验证

---

## 💡 核心价值

**让 Zed Agent 拥有 Claude Code/Codex 级别的 Skill 能力**

通过 MCP (Model Context Protocol) 实现：
1. **自动注入** - SessionStart 模拟（Prompts API）
2. **动态加载** - 按需加载 skills（Tools API）
3. **多层目录** - 项目 > 个人 > 框架优先级
4. **零配置** - 安装后即用，支持 29+ skills

---

## 🏗️ 架构速览

```
MCP Server (Node.js)
├── Prompts API
│   └── initialize → 注入 using-superpowers (8KB)
└── Tools API
    ├── load_skill(name) → 加载指定 skill
    └── list_skills() → 列出所有 skills

Skill 目录优先级:
1. ~/.agents/skills/    (项目级)
2. ~/.claude/skills/    (个人 + Superpowers)
```

---

## 🚀 快速启动

### 1. 构建
```bash
cd ~/c6x_local/my_apps/MCP/zed-agent-skills
pnpm install
pnpm build
```

### 2. 配置 Zed
编辑 `~/.config/zed/settings.json`:
```json
{
  "context_servers": {
    "zed-agent-skills": {
      "command": "node",
      "args": [
        "/Users/felix/c6x_local/my_apps/MCP/zed-agent-skills/build/index.js"
      ]
    }
  }
}
```

### 3. 验证
1. 重启 Zed
2. Agent Panel → Settings → 查看 "zed-agent-skills" 🟢
3. 新对话输入: `initialize superpowers`

---

## 🔧 核心功能

### MCP Prompts (自动注入)

**Prompt**: `initialize`  
**作用**: 注入 `using-superpowers` 完整内容到上下文  
**触发**: 用户在对话中输入 "initialize superpowers"

**注入格式**:
```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

[8KB using-superpowers/SKILL.md 内容]

</EXTREMELY_IMPORTANT>
```

### MCP Tools (动态加载)

**Tool 1: load_skill**
- **参数**: `skill_name` (string)
- **功能**: 加载指定 skill 的完整 SKILL.md 内容
- **示例**: `load_skill("test-driven-development")`

**Tool 2: list_skills**
- **参数**: 无
- **功能**: 列出所有可用 skills (29+)
- **返回**: 按字母排序的 skill 名称列表

---

## 📂 文件结构

```
zed-agent-skills/
├── src/
│   └── index.ts              # 305 lines - MCP Server 核心
├── build/
│   └── index.js              # 9.3KB - 编译输出
├── docs/
│   └── ARCHITECTURE.md       # 215 lines - 架构文档
├── .kontext/                 # 记忆库 (本目录)
│   ├── issues.jsonl          # 数据层
│   ├── README.md             # 视图层
│   └── QUICKREF.md           # 本文件
├── README.md                 # 项目文档
├── package.json              # npm 配置
├── tsconfig.json             # TypeScript 配置
└── .gitignore
```

---

## 📋 待办清单

### MVP 验证
- [x] MCP Server 开发完成
- [x] 构建系统配置
- [x] 文档编写
- [x] Git 提交
- [x] Kontext 记忆迁移
- [ ] Zed settings.json 配置
- [ ] 重启 Zed 验证服务器
- [ ] 测试 `initialize` prompt
- [ ] 测试 `load_skill` tool
- [ ] 测试 `list_skills` tool
- [ ] 推送到 GitHub

### 后续增强 (可选)
- [ ] search_skills 工具 (关键词搜索)
- [ ] Skill metadata cache (性能优化)
- [ ] 项目级 skills 支持 (.zed/skills/)
- [ ] 自动初始化 (Agent Profiles)

---

## 🔑 关键路径

| 项目 | 路径 |
|------|------|
| MCP Server | ~/c6x_local/my_apps/MCP/zed-agent-skills |
| Skills 目录 1 | ~/.agents/skills/ |
| Skills 目录 2 | ~/.claude/skills/ |
| Zed 配置 | ~/.config/zed/settings.json |
| Zed 日志 | ~/Library/Logs/Zed/Zed.log |
| Superpowers 仓库 | ~/c6x_local/from_github/superpowers |

---

## 🐛 故障排除

### MCP Server 不运行
```bash
# 检查构建输出
ls ~/c6x_local/my_apps/MCP/zed-agent-skills/build/index.js

# 检查 Node 版本
node --version  # 需要 v18+

# 查看 Zed 日志
tail -f ~/Library/Logs/Zed/Zed.log | grep zed-agent-skills
```

### Skills 找不到
```bash
# 确认 skills 目录存在
ls ~/.claude/skills/using-superpowers/SKILL.md

# 列出所有 skills
ls ~/.claude/skills/
```

### Agent 不遵循工作流
1. 重新初始化: `initialize superpowers`
2. 明确请求: `Before we start, load the test-driven-development skill`
3. 引用 Red Flags: `Remember the Red Flags table - check for skills before any action`

---

## 📊 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| TypeScript | 5.9.3 | 开发语言 |
| @modelcontextprotocol/sdk | 1.26.0 | MCP 协议实现 |
| Node.js | v18+ | 运行时 |
| pnpm | 10.29.3+ | 包管理 |
| Zed Editor | v0.223.3+ | 目标平台 |

---

## 🔗 相关资源

- **MCP 官方文档**: https://modelcontextprotocol.io/
- **Zed MCP 文档**: https://zed.dev/docs/ai/mcp
- **Superpowers 仓库**: https://github.com/superpowers-dev/superpowers
- **项目仓库**: https://github.com/Coffelix2023/zed-agent-skills

---

## 🎓 核心学习

### Superpowers 工作原理
1. **不是训练/微调** - 纯 prompt 工程
2. **三层防守** - 自动注入 + 显式驳斥 + 可见承诺
3. **环境强制** - SessionStart hook + Skill tool + Red Flags

### MCP 设计模式
1. **Prompts = 静态注入** (会话初始化)
2. **Tools = 动态加载** (按需调用)
3. **一个 Server 管理多个 Skills** (零冗余)

### Zed vs Claude Code
| 功能 | Claude Code | Zed + MCP |
|------|-------------|-----------|
| SessionStart Hook | ✅ 原生 | ⚠️ 手动 Prompt |
| Skill Tool | ✅ 内置 | ✅ MCP Tools |
| 多 Skills | ✅ Plugin | ✅ MCP Server |

---

## 💾 记忆节点

- **kx-5idy**: Superpowers 探索与 Zed 集成
- **kx-53bo**: Superpowers 工作原理分析
- **kx-iqux**: 早期 MCP 原型
- **kx-r5rz**: Kontext 记忆系统
- **kx-m8zp**: 完整 MCP Server 实现 ⭐
- **kx-7n4q**: 记忆库跨仓库迁移

**依赖链**: kx-53bo → kx-iqux → kx-m8zp → kx-7n4q

---

## 🔄 下次对话唤醒命令

在任何窗口中说：

```
读取 .kontext/README.md 恢复记忆
```

或直接引用节点：

```
加载记忆节点 kx-m8zp (MCP Server 完整实现)
```

---

**生成时间**: 2026-02-15 04:45 UTC  
**会话 ID**: zed-agent-2026-02-15  
**维护者**: Agent-Claude + Felix  
**仓库**: zed-agent-skills
