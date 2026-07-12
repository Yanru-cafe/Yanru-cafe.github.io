#!/usr/bin/env bash
# install-hooks.sh — 一次性安装：把 git hooks 指向仓内 hooks/ 目录
# 燕如第一次 clone 博客后跑一次: bash scripts/install-hooks.sh
set -e

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [ ! -f hooks/pre-commit ]; then
    echo "❌ hooks/pre-commit 不存在，无法安装"
    exit 1
fi
chmod +x hooks/pre-commit

git config core.hooksPath hooks
echo "✅ 已设置 core.hooksPath = hooks/"
echo "   下次 git commit 会自动 rebuild index.json (当 observations/poems/quotes-archive 有变化时)"
echo "   卸载: git config --unset core.hooksPath"
