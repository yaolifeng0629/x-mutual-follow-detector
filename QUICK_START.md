# 快速开始指南

本指南帮助你快速安装和使用 X(Twitter) 互关检测助手。

## 📦 安装步骤

### 1. 安装 Node.js

确保你的系统已安装 Node.js (>= 16)。

检查版本：
```bash
node --version
npm --version
```

如果未安装，请访问 [nodejs.org](https://nodejs.org/) 下载安装。

### 2. 克隆项目

```bash
git clone https://github.com/yaolifeng0629/x-mutual-follow-detector.git
cd x-mutual-follow-detector
```

### 3. 安装依赖

```bash
npm install
```

或使用 pnpm（推荐）：

```bash
pnpm install
```

### 4. 构建插件

**开发模式**（支持热重载）：
```bash
npm run dev
```

**生产构建**：
```bash
npm run build
```

### 5. 加载到浏览器

1. 打开 Chrome 或 Edge 浏览器
2. 地址栏输入 `chrome://extensions/` 并回车
3. 右上角开启「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择以下目录：
   - 生产构建：`build/chrome-mv3-prod`
   - 开发模式：`build/chrome-mv3-dev`

## 🎯 使用方法

### 第一步：启用插件

1. 点击浏览器工具栏右上角的拼图图标
2. 找到「X 互关检测助手」
3. 点击插件图标打开控制面板
4. 确保「启用插件功能」开关是打开状态

### 第二步：访问关注列表

访问你的 X(Twitter) 关注列表页面：

```
https://x.com/你的用户名/following
```

例如：`https://x.com/elonmusk/following`

### 第三步：查看互关状态

插件会自动运行：

- ✅ 页面顶部显示蓝色统计栏：`总关注：XXX | 未互关：YYY`
- 🔴 未互关的用户条目会显示浅红色背景
- 📝 用户名后方显示红色提示文字：`（未关注你）`

### 第四步：导出数据（可选）

如果你想导出完整的关注列表数据：

1. 在关注列表页面，找到右下角的浮动按钮
2. 点击「导出关注列表为 CSV」
3. 插件会自动滚动页面加载所有用户
4. 等待进度显示：`已加载：XXX 人（滚动中...）`
5. 完成后会自动下载 CSV 文件

**提示**：滚动过程中可以随时点击按钮停止导出。

## 📊 CSV 文件说明

导出的 CSV 文件包含以下列：

| 列名 | 说明 | 示例 |
|------|------|------|
| 显示名称 | 用户的显示名称 | Elon Musk |
| 用户名 | 用户的 @ 用户名 | @elonmusk |
| 是否互关 | 是否互相关注 | 是 / 否 |
| 是否蓝V | 是否为认证用户 | 是 / 否 |
| 主页链接 | 用户主页 URL | https://x.com/elonmusk |

文件名格式：`我的关注列表_20260205_143052.csv`

## ⚙️ 常见问题

### Q1: 插件图标不显示？

**解决方法**：
1. 访问 `chrome://extensions/`
2. 找到「X 互关检测助手」
3. 点击图钉图标，将插件固定到工具栏

### Q2: 统计栏不显示？

**检查以下几点**：
- 确保插件已启用（点击插件图标查看状态）
- 确保你在 `https://x.com/*/following` 页面
- 刷新页面重试

### Q3: 导出的 CSV 文件打开乱码？

**解决方法**：
- Excel：打开时选择 UTF-8 编码
- Google Sheets：上传时会自动识别编码
- 或使用记事本打开，另存为时选择 UTF-8 编码

### Q4: 导出功能卡住不动？

**可能原因**：
- 网络加载慢，等待 15 秒后会自动停止
- 点击按钮可手动停止

### Q5: 插件会影响页面性能吗？

不会。插件使用了以下优化措施：
- 仅监听必要的 DOM 变化
- 避免重复处理同一用户
- 导出完成后释放资源

## 🔧 开发调试

### 查看控制台日志

1. 右键点击页面 → 检查
2. 打开 Console 标签页
3. 过滤：输入 `x-mutual` 可查看插件相关日志

### 修改代码后重新加载

开发模式下，Plasmo 支持热重载，无需手动刷新插件。

生产构建后，需要：
1. 访问 `chrome://extensions/`
2. 找到插件
3. 点击刷新图标 🔄

## 📞 获取帮助

遇到问题？

- 📖 查看 [完整文档](README.md)
- 🐛 [提交 Issue](https://github.com/yaolifeng0629/x-mutual-follow-detector/issues)
- 💬 [讨论区](https://github.com/yaolifeng0629/x-mutual-follow-detector/discussions)

## 🎉 开始使用

现在你已经准备好了！访问 X(Twitter) 开始使用吧。

祝你使用愉快！🚀
