# 安装和测试指南

本指南帮助你在浏览器中安装和测试插件。

## 📦 前置要求

### Node.js 环境

确保已安装 Node.js >= 16：

```bash
node --version
```

### 包管理器

支持以下任一包管理器：

- **npm** (Node.js 自带)
- **bun** (推荐，速度更快)
- **pnpm**
- **yarn**

## 🚀 构建插件

### 1. 安装依赖

**使用 bun（推荐）：**
```bash
bun install
```

**使用 npm：**
```bash
npm install
```

**使用 pnpm：**
```bash
pnpm install
```

### 2. 开发构建（支持热重载）

```bash
bun dev
# 或
npm run dev
```

构建产物：`build/chrome-mv3-dev/`

### 3. 生产构建（优化和压缩）

```bash
bun run build
# 或
npm run build
```

构建产物：`build/chrome-mv3-prod/`

## 🌐 在浏览器中安装

### Chrome / Edge / Brave

1. **打开扩展管理页面**
   - Chrome: 访问 `chrome://extensions/`
   - Edge: 访问 `edge://extensions/`
   - Brave: 访问 `brave://extensions/`

2. **启用开发者模式**
   - 右上角找到「开发者模式」开关
   - 切换为开启状态

3. **加载插件**
   - 点击「加载已解压的扩展程序」按钮
   - 选择以下目录之一：
     - 开发版本：`build/chrome-mv3-dev/`
     - 生产版本：`build/chrome-mv3-prod/`

4. **固定插件到工具栏（可选）**
   - 点击扩展程序拼图图标
   - 找到「X(Twitter) 互关检测助手」
   - 点击图钉图标固定到工具栏

## ✅ 测试功能

### 测试 1: Popup 控制面板

1. 点击浏览器工具栏中的插件图标
2. 应该看到紫色渐变的弹出窗口
3. 测试开关控件：
   - 点击开关，应该能切换启用/禁用状态
   - 刷新页面后状态应该保持

**预期效果：**
- ✅ 弹出窗口正常显示
- ✅ 开关控件工作正常
- ✅ 状态持久化

### 测试 2: 视觉标记功能

1. 访问你的 X(Twitter) 关注列表：
   ```
   https://x.com/你的用户名/following
   ```

2. 观察页面变化：
   - 页面顶部应出现蓝色统计栏
   - 统计栏显示：`总关注：XXX | 未互关：YYY`
   - 未互关的用户应该有：
     - 浅红色背景
     - 用户名后显示「（未关注你）」

3. 滚动页面测试：
   - 向下滚动加载更多用户
   - 新加载的用户应该自动标记
   - 统计数字应该实时更新

**预期效果：**
- ✅ 统计栏正常显示
- ✅ 红色标记正常显示
- ✅ 滚动加载时自动处理
- ✅ 统计数字实时更新

### 测试 3: 数据导出功能

1. 在关注列表页面，找到右下角的黑色浮动按钮
2. 点击「导出关注列表为 CSV」按钮
3. 观察自动滚动过程：
   - 按钮文字变为「滚动中...点击停止」
   - 进度文字显示：`已加载：XXX 人（滚动中...）`
   - 页面自动向下滚动

4. 等待导出完成：
   - 连续 15 秒无新用户时自动停止
   - 或手动点击按钮停止
   - 自动下载 CSV 文件

5. 检查 CSV 文件：
   - 文件名格式：`我的关注列表_20260205_143052.csv`
   - 用 Excel 或 Google Sheets 打开
   - 验证数据包含：显示名称、用户名、是否互关、是否蓝V、主页链接

**预期效果：**
- ✅ 按钮正常显示和响应
- ✅ 自动滚动功能正常
- ✅ 进度信息实时更新
- ✅ CSV 文件正确下载
- ✅ 文件格式正确，可以打开

### 测试 4: 开关功能

1. 在关注列表页面，点击插件图标打开 Popup
2. 关闭「启用插件功能」开关
3. 观察页面变化：
   - 统计栏应该消失
   - 红色标记应该消失
   - 导出按钮应该消失

4. 重新启用开关
5. 刷新页面，验证功能恢复

**预期效果：**
- ✅ 禁用后所有功能停止
- ✅ 启用后功能恢复
- ✅ 状态在页面刷新后保持

## 🐛 调试技巧

### 查看控制台日志

1. 在 X(Twitter) 页面按 F12 打开开发者工具
2. 切换到 Console 标签
3. 过滤日志：
   ```
   输入: x-mutual
   ```

### 查看 Popup 控制台

1. 右键点击插件图标
2. 选择「检查弹出内容」
3. 在新窗口中查看 Console

### 查看已加载的扩展

```
chrome://extensions/
```

找到「X(Twitter) 互关检测助手」，查看：
- 版本号：1.0.0
- 权限：storage, https://x.com/*
- 内容脚本：following-detector.js

### 重新加载插件

修改代码后，需要重新加载：

1. **开发模式**：Plasmo 支持热重载，保存文件后自动更新
2. **手动刷新**：
   - 访问 `chrome://extensions/`
   - 找到插件
   - 点击刷新图标 🔄

## 🔧 常见问题

### Q1: 插件图标不显示

**解决方法：**
- 检查是否正确加载了 `build/chrome-mv3-prod/` 目录
- 确保 `icon.png` 文件存在于 `assets/` 目录
- 重新构建项目

### Q2: 统计栏不显示

**检查清单：**
- [ ] 插件是否启用（点击图标查看 Popup）
- [ ] 是否在正确的页面（`https://x.com/*/following`）
- [ ] 浏览器控制台是否有错误
- [ ] 尝试刷新页面

### Q3: 导出功能不工作

**可能原因：**
- 网络加载缓慢（等待 15 秒自动停止）
- 浏览器阻止了下载（检查下载权限）
- 页面结构变化（查看控制台错误）

### Q4: 开发模式下热重载不工作

**解决方法：**
```bash
# 停止开发服务器
Ctrl + C

# 清理缓存
rm -rf .plasmo build

# 重新启动
bun dev
```

### Q5: 构建失败

**常见错误：**

**错误：`No icon found`**
```bash
# 确保 icon.png 存在
ls -lh assets/icon.png

# 如果不存在，从 SVG 转换
convert assets/icon.svg -resize 512x512 assets/icon.png
```

**错误：`Cannot resolve module`**
```bash
# 重新安装依赖
rm -rf node_modules
bun install
```

## 📊 构建产物说明

### 开发构建 (`chrome-mv3-dev/`)

- **特点**：未压缩，包含 source maps，支持热重载
- **大小**：~7MB
- **用途**：开发调试

### 生产构建 (`chrome-mv3-prod/`)

- **特点**：代码压缩和优化，体积更小
- **大小**：~330KB
- **用途**：实际使用和发布

### 文件说明

```
build/chrome-mv3-prod/
├── manifest.json                    # 插件清单
├── popup.html                       # Popup 页面
├── popup.*.js                       # Popup 脚本（压缩）
├── popup.*.css                      # Popup 样式
├── following-detector.*.js          # 内容脚本（压缩）
└── icon*.plasmo.*.png              # 多尺寸图标（16/32/48/64/128）
```

## 📝 性能指标

正常情况下，插件应该满足：

- **内存占用**：< 50MB
- **CPU 使用**：< 5%（空闲时）
- **页面加载影响**：< 100ms
- **大列表处理**：500+ 用户无卡顿

## 🎉 测试完成

如果所有测试通过，恭喜你！插件已成功安装并运行。

现在你可以：
- 在实际使用中体验功能
- 向其他人分享插件
- 贡献代码改进功能

## 📞 需要帮助？

- 📖 查看 [README.md](README.md)
- 🐛 [提交 Issue](https://github.com/yaolifeng0629/x-mutual-follow-detector/issues)
- 💬 [参与讨论](https://github.com/yaolifeng0629/x-mutual-follow-detector/discussions)
