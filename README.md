# X(Twitter) 互关检测助手

一个简洁实用的浏览器扩展，帮助你在 X(Twitter) 平台快速识别互关状态，并支持导出关注数据。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Plasmo](https://img.shields.io/badge/built%20with-Plasmo-blueviolet)

## ✨ 核心功能

### 1. 互关状态可视化
- 🔴 **自动标记未互关用户** - 使用浅红色背景高亮显示
- 📝 **添加文字提示** - 在用户名后方显示 "（未关注你）"
- 📊 **实时统计信息** - 页面顶部显示总关注数和未互关人数

### 2. 数据导出
- 📥 **一键导出 CSV** - 点击浮动按钮即可导出完整关注列表
- 🤖 **智能滚动加载** - 自动模拟真人滚动，避免触发风控
- 📋 **完整数据记录** - 包含显示名称、用户名、互关状态、蓝V标识、主页链接

### 3. 隐私与安全
- 🔒 **完全本地运行** - 不发送任何网络请求
- 🚫 **不收集数据** - 仅存储插件配置信息
- ✅ **开源透明** - 代码完全公开，欢迎审查

## 📸 功能演示

### 视觉标记
在关注列表页面，未互关的用户会自动显示红色背景和提示文字：

```
用户名后方显示：（未关注你）
用户条目背景：浅红色（rgba(255, 68, 68, 0.15)）
```

### 统计信息栏
页面顶部固定显示：

```
总关注：256 | 未互关：42
```

### 导出功能
右下角浮动按钮，点击后自动滚动并导出 CSV 文件：

```
已加载：256 人（滚动中...）
```

## 🚀 快速开始

### 安装方法

#### 方法 1：从源码构建（推荐）

1. **克隆仓库**
   ```bash
   git clone https://github.com/yaolifeng0629/x-mutual-follow-detector.git
   cd x-mutual-follow-detector
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者使用 pnpm
   pnpm install
   ```

3. **构建插件**
   ```bash
   npm run build
   # 或开发模式
   npm run dev
   ```

4. **加载到浏览器**
   - 打开 Chrome/Edge 浏览器
   - 访问 `chrome://extensions/`
   - 开启「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择 `build/chrome-mv3-prod` 目录（生产构建）或 `build/chrome-mv3-dev` 目录（开发模式）

#### 方法 2：直接下载（即将支持）

从 [Releases](https://github.com/yaolifeng0629/x-mutual-follow-detector/releases) 页面下载最新版本的 `.zip` 文件，解压后按照上述第 4 步加载。

## 📖 使用指南

### 1. 启用插件

- 点击浏览器工具栏中的插件图标
- 确保「启用插件功能」开关处于开启状态

### 2. 查看互关状态

1. 访问你的 X(Twitter) 关注列表页面：
   ```
   https://x.com/{你的用户名}/following
   ```

2. 插件会自动标记未互关的用户
3. 页面顶部显示统计信息

### 3. 导出关注数据

1. 点击页面右下角的「导出关注列表为 CSV」按钮
2. 插件会自动滚动页面，加载所有关注用户
3. 滚动完成后自动下载 CSV 文件
4. 文件名格式：`我的关注列表_YYYYMMDD_HHMMSS.csv`

### CSV 文件格式

| 显示名称 | 用户名 | 是否互关 | 是否蓝V | 主页链接 |
|---------|--------|---------|--------|---------|
| 张三 | @zhangsan | 是 | 否 | https://x.com/zhangsan |
| 李四 | @lisi | 否 | 是 | https://x.com/lisi |

## ⚙️ 配置选项

### Popup 控制面板

点击插件图标打开控制面板，可以：

- ✅ 启用/禁用插件功能
- 📖 查看功能说明
- 📚 阅读使用方法
- 🔗 访问 GitHub 仓库

### 存储说明

插件仅使用 `chrome.storage.local` 存储以下配置：

```javascript
{
  enabled: true  // 插件启用状态
}
```

**不存储任何用户数据或关注列表信息。**

## 🛠️ 技术架构

### 技术栈

- **框架**: [Plasmo](https://www.plasmo.com/) - 现代化的浏览器扩展开发框架
- **语言**: TypeScript + React
- **样式**: CSS Modules
- **构建**: Parcel (Plasmo 内置)

### 项目结构

```
x-mutual-follow-detector/
├── src/
│   ├── contents/
│   │   └── following-detector.tsx    # 内容脚本（核心功能）
│   ├── popup/
│   │   ├── index.tsx                 # Popup 主组件
│   │   └── popup.css                 # Popup 样式
├── assets/
│   └── icon.svg                      # 插件图标
├── .monkeycode/
│   └── specs/
│       └── x-twitter-mutual-follow-detector/
│           └── requirements.md       # 需求文档
├── package.json
├── tsconfig.json
└── README.md
```

### 核心实现

#### 1. 互关检测

使用 `MutationObserver` 监听 DOM 变化：

```typescript
const followsYouIndicator = cell.querySelector('[data-testid="userFollowIndicator"]')
const isMutual = !!followsYouIndicator
```

#### 2. 数据收集

基于稳定的 `data-testid` 选择器：

```typescript
document.querySelectorAll('[data-testid="UserCell"]')
```

#### 3. 导出机制

使用 Blob API 生成 CSV 文件：

```typescript
const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
const url = URL.createObjectURL(blob)
```

## 🔧 开发指南

### 环境要求

- Node.js >= 16
- npm >= 8 或 pnpm >= 8

### 开发模式

```bash
npm run dev
```

Plasmo 会自动启动开发服务器，支持热重载。

### 生产构建

```bash
npm run build
```

构建产物在 `build/chrome-mv3-prod/` 目录。

### 打包发布

```bash
npm run package
```

生成 `.zip` 文件，可直接上传到 Chrome Web Store。

## 📋 需求文档

完整的需求规格说明书（基于 EARS 模式和 INCOSE 质量规则）：

[查看需求文档](.monkeycode/specs/x-twitter-mutual-follow-detector/requirements.md)

包含 10 个核心功能模块：
1. 非互关用户视觉标记
2. 互关统计信息展示
3. 关注数据导出功能
4. 数据收集与解析
5. 用户交互控制
6. 性能与资源管理
7. 安全与隐私保护
8. CSV 文件格式规范
9. 插件功能控制（Popup 面板）
10. 错误处理与容错

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 报告问题

在 [Issues](https://github.com/yaolifeng0629/x-mutual-follow-detector/issues) 页面创建新问题，请包含：

- 浏览器版本
- 插件版本
- 问题描述
- 复现步骤
- 错误截图（如有）

### 提交代码

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Plasmo](https://www.plasmo.com/) - 强大的浏览器扩展开发框架
- [X(Twitter)](https://x.com/) - 提供平台
- 所有贡献者和使用者

## 📞 联系方式

- **作者**: yaolifeng0629
- **GitHub**: [@yaolifeng0629](https://github.com/yaolifeng0629)
- **项目主页**: [x-mutual-follow-detector](https://github.com/yaolifeng0629/x-mutual-follow-detector)

## ⚠️ 免责声明

本插件仅供学习和个人使用，请遵守 X(Twitter) 的使用条款。使用本插件产生的任何后果由用户自行承担。

## 🔄 更新日志

### v1.0.0 (2026-02-05)

- 🎉 首次发布
- ✅ 实现互关状态可视化
- ✅ 实现数据导出功能
- ✅ 添加 Popup 控制面板
- ✅ 完善隐私保护机制

---

**如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！**
