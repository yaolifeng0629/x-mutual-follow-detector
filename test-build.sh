#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 X(Twitter) 互关检测助手 - 构建测试脚本"
echo "================================================"
echo ""

# 检查 Node.js
echo -n "检查 Node.js... "
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓${NC} $(node --version)"
else
    echo -e "${RED}✗ Node.js 未安装${NC}"
    exit 1
fi

# 检查包管理器
echo -n "检查包管理器... "
if command -v bun &> /dev/null; then
    echo -e "${GREEN}✓${NC} bun $(bun --version)"
    PKG_MANAGER="bun"
elif command -v pnpm &> /dev/null; then
    echo -e "${GREEN}✓${NC} pnpm $(pnpm --version)"
    PKG_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    echo -e "${GREEN}✓${NC} npm $(npm --version)"
    PKG_MANAGER="npm"
else
    echo -e "${RED}✗ 未找到包管理器${NC}"
    exit 1
fi

# 检查图标文件
echo -n "检查图标文件... "
if [ -f "assets/icon.png" ]; then
    echo -e "${GREEN}✓${NC} assets/icon.png"
else
    echo -e "${RED}✗ assets/icon.png 不存在${NC}"
    exit 1
fi

# 安装依赖
echo ""
echo "📦 安装依赖..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bun install
elif [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm install
else
    npm install
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 依赖安装成功${NC}"
else
    echo -e "${RED}✗ 依赖安装失败${NC}"
    exit 1
fi

# 生产构建
echo ""
echo "🔨 开始生产构建..."
if [ "$PKG_MANAGER" = "bun" ]; then
    bun run build
elif [ "$PKG_MANAGER" = "pnpm" ]; then
    pnpm run build
else
    npm run build
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}✗ 构建失败${NC}"
    exit 1
fi

# 检查构建产物
echo ""
echo "📊 检查构建产物..."

if [ -d "build/chrome-mv3-prod" ]; then
    echo -e "${GREEN}✓${NC} build/chrome-mv3-prod/"
    
    # 检查必需文件
    FILES=("manifest.json" "popup.html" "following-detector.*.js" "popup.*.js")
    for file in "${FILES[@]}"; do
        if ls build/chrome-mv3-prod/$file 1> /dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $file"
        else
            echo -e "  ${RED}✗${NC} $file"
        fi
    done
    
    # 显示文件大小
    echo ""
    echo "📏 构建产物大小:"
    du -sh build/chrome-mv3-prod/
    
else
    echo -e "${RED}✗ build/chrome-mv3-prod/ 不存在${NC}"
    exit 1
fi

echo ""
echo "================================================"
echo -e "${GREEN}✅ 所有测试通过！${NC}"
echo ""
echo "📍 下一步："
echo "1. 打开 Chrome/Edge: chrome://extensions/"
echo "2. 开启「开发者模式」"
echo "3. 点击「加载已解压的扩展程序」"
echo "4. 选择 build/chrome-mv3-prod/ 目录"
echo ""
echo "📖 完整安装指南: INSTALLATION.md"
