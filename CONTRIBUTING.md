# 贡献指南

感谢你考虑为 X(Twitter) 互关检测助手做出贡献！本文档提供了如何参与项目开发的详细指南。

## 🤝 如何贡献

### 报告 Bug

如果你发现了 Bug，请：

1. 先在 [Issues](https://github.com/yaolifeng0629/x-mutual-follow-detector/issues) 中搜索，确认问题尚未被报告
2. 创建新 Issue，包含以下信息：
   - **标题**: 简洁明了的描述
   - **环境**: 浏览器版本、操作系统、插件版本
   - **复现步骤**: 详细的操作步骤
   - **期望行为**: 你期望发生什么
   - **实际行为**: 实际发生了什么
   - **截图**: 如果可能，提供截图或视频
   - **错误日志**: 浏览器控制台的错误信息

### 提出功能建议

有新想法？我们欢迎你的建议！

1. 在 [Discussions](https://github.com/yaolifeng0629/x-mutual-follow-detector/discussions) 中发起讨论
2. 描述你的想法：
   - 为什么需要这个功能？
   - 它将如何改善用户体验？
   - 可能的实现方式
3. 等待社区和维护者的反馈

### 提交代码

#### 准备工作

1. **Fork 仓库**

   点击 GitHub 页面右上角的 Fork 按钮

2. **克隆到本地**

   ```bash
   git clone https://github.com/你的用户名/x-mutual-follow-detector.git
   cd x-mutual-follow-detector
   ```

3. **添加上游仓库**

   ```bash
   git remote add upstream https://github.com/yaolifeng0629/x-mutual-follow-detector.git
   ```

4. **安装依赖**

   ```bash
   npm install
   ```

#### 开发流程

1. **同步最新代码**

   ```bash
   git fetch upstream
   git checkout master
   git merge upstream/master
   ```

2. **创建功能分支**

   ```bash
   git checkout -b feature/amazing-feature
   ```

   分支命名规范：
   - `feature/xxx` - 新功能
   - `fix/xxx` - Bug 修复
   - `docs/xxx` - 文档更新
   - `refactor/xxx` - 代码重构
   - `test/xxx` - 测试相关

3. **开发与测试**

   ```bash
   # 启动开发模式
   npm run dev

   # 在浏览器中测试
   # 加载 build/chrome-mv3-dev 目录
   ```

4. **提交更改**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   提交信息规范参考 [Conventional Commits](https://www.conventionalcommits.org/)

5. **推送分支**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **创建 Pull Request**

   - 访问你的 Fork 仓库
   - 点击 "New Pull Request"
   - 填写 PR 描述（参考下方模板）
   - 提交 PR

#### Pull Request 模板

```markdown
## 📝 更改说明

简要描述这个 PR 做了什么。

## 🔗 相关 Issue

Closes #123

## ✅ 更改类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 测试更新

## 📋 测试清单

- [ ] 已在 Chrome 中测试
- [ ] 已在 Edge 中测试
- [ ] 已测试所有功能正常
- [ ] 没有引入新的 Bug
- [ ] 代码符合项目规范

## 📸 截图（如适用）

在此处添加截图或 GIF

## 💬 其他说明

需要补充的其他信息
```

## 📜 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 进行开发
- 遵循 ESLint 配置
- 使用 2 空格缩进
- 使用分号
- 使用双引号（字符串）

示例：

```typescript
// ✅ 好
function processUserCell(cell: Element): void {
  const username = cell.getAttribute("data-username")
  if (!username) {
    return
  }
  // ...
}

// ❌ 不好
function processUserCell(cell) {
  const username = cell.getAttribute('data-username')
  if(!username)return
  // ...
}
```

### React 组件

- 使用函数组件 + Hooks
- 组件命名使用 PascalCase
- Props 使用 TypeScript 类型定义

示例：

```typescript
interface PopupProps {
  enabled: boolean
  onToggle: () => void
}

function Popup({ enabled, onToggle }: PopupProps) {
  return (
    <div>
      <button onClick={onToggle}>
        {enabled ? "禁用" : "启用"}
      </button>
    </div>
  )
}
```

### CSS

- 使用 BEM 命名规范或 CSS Modules
- 避免使用 `!important`
- 使用语义化的类名

示例：

```css
/* ✅ 好 */
.popup-container {
  display: flex;
}

.popup-container__header {
  font-size: 20px;
}

/* ❌ 不好 */
.container {
  display: flex !important;
}

.h1 {
  font-size: 20px;
}
```

### 提交信息

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关

示例：

```
feat(export): 添加导出进度条

在导出过程中显示详细的进度信息，包括已加载用户数和预计剩余时间。

Closes #42
```

## 🧪 测试要求

### 功能测试

在提交 PR 前，请确保：

1. **基础功能**
   - [ ] 视觉标记正常显示
   - [ ] 统计信息实时更新
   - [ ] 导出功能正常工作
   - [ ] Popup 开关正常

2. **边界情况**
   - [ ] 关注列表为空时正常工作
   - [ ] 网络加载慢时不崩溃
   - [ ] 用户快速滚动时正常

3. **浏览器兼容性**
   - [ ] Chrome 测试通过
   - [ ] Edge 测试通过（可选）

### 代码审查清单

提交前自我审查：

- [ ] 代码遵循项目规范
- [ ] 没有调试用的 console.log
- [ ] 没有注释掉的代码
- [ ] 变量和函数命名清晰
- [ ] 添加了必要的注释
- [ ] 没有敏感信息（API Key、密码等）

## 📚 开发资源

### 有用的链接

- [Plasmo 官方文档](https://docs.plasmo.com/)
- [Chrome Extension 开发指南](https://developer.chrome.com/docs/extensions/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [React 文档](https://react.dev/)

### 项目架构

```
src/
├── contents/
│   └── following-detector.tsx    # 核心内容脚本
│       ├── 视觉标记逻辑
│       ├── 统计信息展示
│       └── 数据导出功能
├── popup/
│   ├── index.tsx                 # Popup 主组件
│   └── popup.css                 # Popup 样式
```

### 关键实现

#### 1. DOM 监听

使用 `MutationObserver` 监听动态加载的用户条目：

```typescript
const observer = new MutationObserver((mutations) => {
  // 处理新增的用户条目
})

observer.observe(document.body, {
  childList: true,
  subtree: true
})
```

#### 2. 数据收集

基于稳定的 `data-testid` 选择器：

```typescript
const cells = document.querySelectorAll('[data-testid="UserCell"]')
const followsYou = cell.querySelector('[data-testid="userFollowIndicator"]')
```

#### 3. 状态持久化

使用 `chrome.storage.local`：

```typescript
// 保存
await chrome.storage.local.set({ enabled: true })

// 读取
const { enabled } = await chrome.storage.local.get(["enabled"])
```

## 🎯 当前需要帮助的领域

我们特别欢迎在以下方面的贡献：

1. **功能增强**
   - 添加过滤/排序功能
   - 支持批量操作
   - 数据可视化

2. **性能优化**
   - 减少内存占用
   - 优化大列表渲染
   - 加快导出速度

3. **用户体验**
   - 改进 UI 设计
   - 添加动画效果
   - 多语言支持

4. **文档完善**
   - 添加更多示例
   - 翻译文档
   - 录制视频教程

## 🏆 贡献者

感谢所有为项目做出贡献的人！

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- 这里会自动生成贡献者列表 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## 📞 联系方式

如有问题，可以通过以下方式联系：

- 📧 提交 Issue
- 💬 参与 Discussions
- 🐛 报告 Bug

## 📄 许可证

通过贡献代码，你同意你的贡献将在 [MIT License](LICENSE) 下发布。

---

再次感谢你的贡献！🎉
