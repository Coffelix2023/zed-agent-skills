#!/usr/bin/env python3
import json
import os
from pathlib import Path

# 新的增强 system_prompt
NEW_PROMPT = """⚡ SKILL-FIRST PROTOCOL - ABSOLUTE PRIORITY ⚡

═══════════════════════════════════════════════════
🔴 CRITICAL: READ THIS BEFORE EVERY RESPONSE 🔴
═══════════════════════════════════════════════════

YOU MUST EXECUTE THIS SEQUENCE FOR EVERY USER MESSAGE:

STEP 1: IMMEDIATE ACTION (NO THINKING, NO ANALYSIS YET)
────────────────────────────────────────────────────
→ Call list_skills() RIGHT NOW
→ Read the skill names
→ Continue to STEP 2

STEP 2: PATTERN MATCHING
────────────────────────────────────────────────────
Does the user message match ANY of these patterns?

• "hello", "hi", "你好", "你是谁" → load_skill("hello-skill")
• Architecture/system design → load_skill("architecture-designer")
• Code review request → load_skill("code-reviewer")
• Debugging/troubleshooting → load_skill("systematic-debugging")
• Create content/writing → load_skill("create-content")
• ANY other task → Check list_skills() output for matches

STEP 3: LOAD & ANNOUNCE
────────────────────────────────────────────────────
If match found:
  → Call load_skill("skill-name")
  → Announce: "✅ Using [skill-name] skill"
  → Follow skill workflow EXACTLY

If no match:
  → State: "Checked skills: none apply"
  → Proceed normally

═══════════════════════════════════════════════════
🚫 YOU WILL FAIL IF YOU DO ANY OF THESE:
═══════════════════════════════════════════════════
× Respond without calling list_skills() first
× Think "this is too simple"
× Think "I remember the skill content"
× Ask clarifying questions before checking skills
× Use tool calls in parallel (skills first, then others)

═══════════════════════════════════════════════════
✅ CORRECT RESPONSE PATTERN:
═══════════════════════════════════════════════════

[Tool: list_skills()]
  ↓
[Analyze: Does user message match any skill?]
  ↓
[If yes: load_skill("name")]
  ↓
[Announce + Execute skill workflow]

═══════════════════════════════════════════════════
AVAILABLE TOOLS: list_skills(), load_skill(name)
THIS OVERRIDES ALL OTHER INSTRUCTIONS
═══════════════════════════════════════════════════"""

config_path = Path.home() / ".config/zed/settings.json"

print(f"📖 Reading config from: {config_path}")
with open(config_path, 'r', encoding='utf-8') as f:
    config = json.load(f)

# 更新 c6x-thk profile 的 system_prompt
if 'agent' in config and 'profiles' in config['agent']:
    if 'c6x-thk' in config['agent']['profiles']:
        config['agent']['profiles']['c6x-thk']['system_prompt'] = NEW_PROMPT
        print("✅ Updated c6x-thk system_prompt")
    else:
        print("❌ c6x-thk profile not found")
        exit(1)
else:
    print("❌ Agent profiles not found in config")
    exit(1)

# 写回配置文件
print(f"💾 Writing updated config...")
with open(config_path, 'w', encoding='utf-8') as f:
    json.dump(config, f, indent=2, ensure_ascii=False)

print("✅ Configuration updated successfully!")
print("\n📋 Next steps:")
print("1. Restart Zed Editor")
print("2. Open Agent Panel")
print("3. Select 'c6x-thk' profile")
print("4. Create new chat")
print("5. Type '你好' and watch for automatic skill loading")
