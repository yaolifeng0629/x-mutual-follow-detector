import { useEffect, useState } from "react"
import "./popup.css"

function IndexPopup() {
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [isOnFollowingPage, setIsOnFollowingPage] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    // 从存储中读取当前状态
    chrome.storage.local.get(["enabled"], (result) => {
      setEnabled(result.enabled !== false)
      setLoading(false)
    })

    // 检查当前页面是否是关注列表页面
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        const url = tabs[0].url
        setCurrentUrl(url)
        setIsOnFollowingPage(/^https:\/\/x\.com\/[^/]+\/following/.test(url))
      }
    })
  }, [])

  const handleToggle = async () => {
    const newState = !enabled
    setEnabled(newState)

    // 保存到存储
    await chrome.storage.local.set({ enabled: newState })
  }

  const handleOpenFollowingPage = () => {
    // 尝试从当前 URL 提取用户名
    const match = currentUrl.match(/^https:\/\/x\.com\/([^/]+)/)
    if (match) {
      const username = match[1]
      chrome.tabs.update({ url: `https://x.com/${username}/following` })
    } else {
      // 如果无法提取用户名,让用户手动输入或打开 X 首页
      chrome.tabs.create({ url: "https://x.com/home" })
    }
  }

  if (loading) {
    return (
      <div className="popup-container">
        <div className="loading">
          <div className="loading-spinner" />
          <div className="loading-text">加载中...</div>
        </div>
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
          <p className="version">v1.1.1</p>
        </div>
        <p className="description">
          在 X(Twitter) 关注列表页面快速识别互关状态，支持导出数据到 CSV 文件
        </p>
      </div>

      {!isOnFollowingPage && (
        <div className="page-notice">
          <div className="notice-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="notice-content">
            <p className="notice-title">请先打开关注列表页面</p>
            <p className="notice-text">
              插件需要在「正在关注」页面才能工作
            </p>
            <button className="open-page-btn" onClick={handleOpenFollowingPage}>
              前往关注列表
            </button>
          </div>
        </div>
      )}

      {isOnFollowingPage && enabled && (
        <div className="page-success">
          <div className="success-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="success-text">已在关注列表页面，插件正在运行</p>
        </div>
      )}

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
          {enabled ? "功能已启用" : "功能已禁用"}
        </p>
      </div>

      <div className="features">
        <h2 className="features-title">功能说明</h2>
        <ul className="features-list">
          <li>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>实时显示互关统计信息</span>
          </li>
          <li>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>标记未互关的用户</span>
          </li>
          <li>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>一键导出关注列表到 CSV</span>
          </li>
          <li>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>完全本地运行，保护隐私</span>
          </li>
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
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          本插件仅在本地运行，不收集或上传任何数据
        </p>
        <a
          href="https://github.com/yaolifeng0629/x-mutual-follow-detector"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          GitHub 仓库
        </a>
      </footer>
    </div>
  )
}

export default IndexPopup
