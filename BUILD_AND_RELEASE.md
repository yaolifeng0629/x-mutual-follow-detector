# 构建与发布指南

本文档介绍如何构建和发布 X(Twitter) 互关检测助手插件。

## 📦 构建步骤

### 1. 开发模式

开发模式支持热重载，代码修改后会自动刷新插件：

```bash
npm run dev
```

构建产物位于：`build/chrome-mv3-dev/`

### 2. 生产构建

生产构建会进行代码压缩和优化：

```bash
npm run build
```

构建产物位于：`build/chrome-mv3-prod/`

### 3. 打包发布

生成可分发的 `.zip` 文件：

```bash
npm run package
```

生成的文件位于：`build/chrome-mv3-prod.zip`

## 🧪 测试清单

在发布前，请完成以下测试：

### 功能测试

- [ ] **视觉标记**
  - [ ] 未互关用户显示红色背景
  - [ ] 用户名后显示 "（未关注你）" 文字
  - [ ] 互关用户无标记

- [ ] **统计信息**
  - [ ] 页面顶部显示统计栏
  - [ ] 统计数据实时更新
  - [ ] 滚动加载新用户时自动更新

- [ ] **导出功能**
  - [ ] 点击按钮开始自动滚动
  - [ ] 显示实时进度信息
  - [ ] 自动停止并下载 CSV
  - [ ] CSV 文件格式正确
  - [ ] 文件可被 Excel/Google Sheets 正常打开

- [ ] **Popup 面板**
  - [ ] 点击插件图标打开面板
  - [ ] 开关控件正常工作
  - [ ] 状态持久化（刷新页面后保持）

- [ ] **错误处理**
  - [ ] 网络加载慢时正常工作
  - [ ] 页面结构变化时不崩溃
  - [ ] CSV 导出失败时显示友好提示

### 浏览器兼容性测试

- [ ] Chrome (v120+)
- [ ] Edge (v120+)
- [ ] Brave
- [ ] Opera

### 性能测试

- [ ] 大量用户（500+）时页面不卡顿
- [ ] 内存使用正常（< 100MB）
- [ ] 导出过程中可以正常停止

## 📝 发布流程

### 发布到 GitHub Releases

1. **更新版本号**

   编辑 `package.json`：
   ```json
   {
     "version": "1.1.0"
   }
   ```

2. **提交版本更新**

   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.1.0"
   git push origin master
   ```

3. **创建 Git Tag**

   ```bash
   git tag -a v1.1.0 -m "Release v1.1.0"
   git push origin v1.1.0
   ```

4. **生成发布包**

   ```bash
   npm run package
   ```

5. **创建 GitHub Release**

   访问: https://github.com/yaolifeng0629/x-mutual-follow-detector/releases/new

   - Tag: `v1.1.0`
   - Title: `v1.1.0`
   - Description: 参考下方模板
   - 上传 `build/chrome-mv3-prod.zip`

### Release 描述模板

```markdown
## 🎉 新功能

- 新增 XXX 功能
- 改进 YYY 体验

## 🐛 Bug 修复

- 修复 ABC 问题
- 解决 DEF 崩溃

## 📝 其他更新

- 更新依赖包
- 优化性能

## 📥 安装方法

1. 下载 `chrome-mv3-prod.zip`
2. 解压文件
3. 打开 Chrome/Edge 浏览器
4. 访问 `chrome://extensions/`
5. 开启「开发者模式」
6. 点击「加载已解压的扩展程序」
7. 选择解压后的目录

完整文档: [README.md](../README.md)
```

### 发布到 Chrome Web Store（可选）

1. **准备材料**

   - 插件 ZIP 包（`build/chrome-mv3-prod.zip`）
   - 图标：`assets/icon.svg` （需转换为多尺寸 PNG）
   - 截图：至少 1 张，最多 5 张
   - 宣传图（可选）：1280x800px
   - 详细描述（参考 README.md）

2. **访问开发者控制台**

   https://chrome.google.com/webstore/devconsole

3. **创建新项目**

   - 上传 ZIP 包
   - 填写基本信息
   - 上传图标和截图
   - 填写描述和隐私政策

4. **审核周期**

   通常需要 1-3 个工作日

## 🔄 版本管理

### 语义化版本规范

遵循 [Semantic Versioning 2.0.0](https://semver.org/)：

- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向下兼容的功能性新增
- **修订号 (PATCH)**: 向下兼容的问题修正

示例：
- `1.0.0` → `2.0.0`: 重大更新，可能不兼容
- `1.0.0` → `1.1.0`: 新增功能
- `1.0.0` → `1.0.1`: Bug 修复

### 提交信息规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/)：

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
feat(export): 添加自动重试机制

当网络不稳定时，自动重试最多 3 次

Closes #123
```

## 🐛 调试技巧

### 查看控制台日志

1. 打开 X(Twitter) 页面
2. 按 F12 打开开发者工具
3. 切换到 Console 标签
4. 过滤日志：输入 `x-mutual`

### 调试 Popup

1. 右键点击插件图标
2. 选择「检查弹出内容」
3. 在新窗口中查看 Popup 的控制台

### 调试 Background Script（如有）

1. 访问 `chrome://extensions/`
2. 找到插件
3. 点击「Service Worker」或「背景页」

### 清除存储数据

```javascript
// 在 Console 中执行
chrome.storage.local.clear(() => {
  console.log('存储已清除')
})
```

## 📊 构建产物说明

### 目录结构

```
build/
├── chrome-mv3-dev/          # 开发构建
│   ├── manifest.json        # 插件清单
│   ├── popup.html           # Popup 页面
│   ├── contents/            # 内容脚本
│   └── assets/              # 静态资源
├── chrome-mv3-prod/         # 生产构建
│   └── (同上，代码已压缩)
└── chrome-mv3-prod.zip      # 打包文件
```

### 文件大小参考

- 开发构建：~500KB
- 生产构建：~200KB
- ZIP 包：~100KB

## 🔐 安全检查

发布前确保：

- [ ] 没有硬编码的 API Key 或密钥
- [ ] 没有 console.log 调试代码（生产环境）
- [ ] 权限请求最小化
- [ ] 符合 Chrome Web Store 政策
- [ ] 隐私政策完整

## 📞 支持

如有问题，请：

- 📖 查看 [README.md](README.md)
- 🐛 [提交 Issue](https://github.com/yaolifeng0629/x-mutual-follow-detector/issues)
- 💬 [参与讨论](https://github.com/yaolifeng0629/x-mutual-follow-detector/discussions)
