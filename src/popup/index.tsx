import { useEffect, useState } from "react"
import "./popup.css"

function IndexPopup() {
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从存储中读取当前状态
    chrome.storage.local.get(["enabled"], (result) => {
      setEnabled(result.enabled !== false)
      setLoading(false)
    })
  }, [])

  const handleToggle = async () => {
    const newState = !enabled
    setEnabled(newState)

    // 保存到存储
    await chrome.storage.local.set({ enabled: newState })
  }

  if (loading) {
    return (
      <div className="popup-container">
        <div className="loading">加载中...</div>
      </div>
    )
  }

  return (
    <div className="popup-container">
      <div className="header">
        <div className="icon-wrapper">
          <svg
            className="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div className="header-text">
          <h1 className="title">X 互关检测助手</h1>
          <p className="version">v1.0.0</p>
        </div>
      </div>

      <p className="description">
        在 X(Twitter) 关注列表页面快速识别互关状态，支持导出数据到 CSV 文件。
      </p>

      <div className="control-section">
        <div className="control-header">
          <label htmlFor="enable-toggle" className="control-label">
            启用插件功能
          </label>
          <div className="toggle-wrapper">
            <input
              type="checkbox"
              id="enable-toggle"
              className="toggle-input"
              checked={enabled}
              onChange={handleToggle}
            />
            <label htmlFor="enable-toggle" className="toggle-label">
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <p className="control-hint">
          {enabled ? "✓ 功能已启用" : "✗ 功能已禁用"}
        </p>
      </div>

      <div className="features">
        <h2 className="features-title">功能说明</h2>
        <ul className="features-list">
          <li>📊 实时显示互关统计信息</li>
          <li>🔴 标记未互关的用户</li>
          <li>📥 一键导出关注列表到 CSV</li>
          <li>🔒 完全本地运行，保护隐私</li>
        </ul>
      </div>

      <div className="usage">
        <h2 className="usage-title">使用方法</h2>
        <ol className="usage-list">
          <li>访问 X(Twitter) 的「正在关注」页面</li>
          <li>插件会自动标记未互关的用户</li>
          <li>点击右下角按钮可导出完整数据</li>
        </ol>
      </div>

      <footer className="footer">
        <p className="footer-text">
          🔒 本插件仅在本地运行，不收集或上传任何数据
        </p>
        <a
          href="https://github.com/yaolifeng0629/x-mutual-follow-detector"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub 仓库
        </a>
      </footer>
    </div>
  )
}

export default IndexPopup
