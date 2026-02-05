import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://x.com/*/following*"],
  all_frames: false,
  run_at: "document_idle"
}

// 全局状态
let isEnabled = true
let totalUsers = 0
let nonMutualUsers = 0
let statsBar: HTMLElement | null = null
let mutationObserver: MutationObserver | null = null

// 从存储中读取启用状态
chrome.storage.local.get(["enabled"], (result) => {
  isEnabled = result.enabled !== false // 默认启用
  if (isEnabled) {
    initPlugin()
  }
})

// 监听存储变化
chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    isEnabled = changes.enabled.newValue
    if (isEnabled) {
      initPlugin()
    } else {
      cleanup()
    }
  }
})

function initPlugin() {
  createStatsBar()
  createExportButton()
  startObserving()
  processExistingUsers()
}

function cleanup() {
  // 移除所有视觉标记
  document.querySelectorAll(".mutual-follow-hint").forEach((el) => el.remove())
  document.querySelectorAll('[data-marked="non-mutual"]').forEach((cell: HTMLElement) => {
    cell.style.background = ""
    cell.removeAttribute("data-marked")
  })

  // 隐藏统计栏
  if (statsBar) {
    statsBar.style.display = "none"
  }

  // 移除导出按钮
  const exportContainer = document.getElementById("x-mutual-export-container")
  if (exportContainer) {
    exportContainer.remove()
  }

  // 停止观察
  if (mutationObserver) {
    mutationObserver.disconnect()
  }
}

function createStatsBar() {
  if (statsBar) {
    statsBar.style.display = "flex"
    return
  }

  statsBar = document.createElement("div")
  statsBar.id = "x-mutual-stats-bar"
  statsBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    background: linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%);
    color: white;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 2px 12px rgba(29, 155, 240, 0.15);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  `

  // 创建统计文字容器
  const statsText = document.createElement("span")
  statsText.className = "stats-text"
  statsText.textContent = "总关注：0 | 未互关：0"
  statsText.style.cssText = `
    font-weight: 600;
    letter-spacing: 0.3px;
  `

  // 创建分隔符
  const separator = document.createElement("span")
  separator.style.cssText = `
    width: 1px;
    height: 16px;
    background: rgba(255, 255, 255, 0.3);
    display: inline-block;
  `

  // 创建提示文字容器
  const hintContainer = document.createElement("span")
  hintContainer.className = "stats-hint"
  hintContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    opacity: 0.95;
    font-weight: 400;
  `

  // 创建向下箭头 SVG 图标
  const arrowIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  arrowIcon.setAttribute("fill", "none")
  arrowIcon.setAttribute("stroke", "currentColor")
  arrowIcon.setAttribute("viewBox", "0 0 24 24")
  arrowIcon.style.cssText = `
    width: 16px;
    height: 16px;
    animation: bounce 2s ease-in-out infinite;
  `

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
  path.setAttribute("stroke-linecap", "round")
  path.setAttribute("stroke-linejoin", "round")
  path.setAttribute("stroke-width", "2")
  path.setAttribute("d", "M19 14l-7 7m0 0l-7-7m7 7V3")
  arrowIcon.appendChild(path)

  const hintText = document.createElement("span")
  hintText.textContent = "向下滚动查看更多用户"

  hintContainer.appendChild(arrowIcon)
  hintContainer.appendChild(hintText)

  statsBar.appendChild(statsText)
  statsBar.appendChild(separator)
  statsBar.appendChild(hintContainer)
  document.body.appendChild(statsBar)

  // 添加动画样式
  const style = document.createElement("style")
  style.textContent = `
    @keyframes bounce {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(4px);
      }
    }
  `
  document.head.appendChild(style)

  // 为页面内容添加顶部间距，避免被遮挡
  const main = document.querySelector('main')
  if (main) {
    const existingPadding = parseInt(window.getComputedStyle(main).paddingTop) || 0
    main.style.paddingTop = `${existingPadding + 54}px`
  }
}

function updateStats() {
  if (statsBar) {
    const statsText = statsBar.querySelector('.stats-text')
    if (statsText) {
      statsText.textContent = `总关注：${totalUsers} | 未互关：${nonMutualUsers}`
    }
  }
}

function processUserCell(cell: Element) {
  // 避免重复处理
  if (cell.hasAttribute("data-marked")) return

  const followsYouIndicator = cell.querySelector('[data-testid="userFollowIndicator"]')
  const isMutual = !!followsYouIndicator

  totalUsers++

  if (!isMutual) {
    nonMutualUsers++

    // 应用红色背景
    ;(cell as HTMLElement).style.background = "rgba(255, 68, 68, 0.15)"
    ;(cell as HTMLElement).style.borderRadius = "8px"
    ;(cell as HTMLElement).style.transition = "background 0.2s ease"

    // 查找用户名元素并添加提示文字
    const nameElement = cell.querySelector('a[role="link"] div[dir="ltr"]')
    if (nameElement && !nameElement.querySelector(".mutual-follow-hint")) {
      const hint = document.createElement("span")
      hint.className = "mutual-follow-hint"
      hint.textContent = "（未关注你）"
      hint.style.cssText = `
        color: #EF4444;
        font-size: 0.85em;
        margin-left: 8px;
        font-weight: 500;
      `
      nameElement.appendChild(hint)
    }
  }

  cell.setAttribute("data-marked", isMutual ? "mutual" : "non-mutual")
  updateStats()
}

function processExistingUsers() {
  const cells = document.querySelectorAll('[data-testid="UserCell"]')
  cells.forEach(processUserCell)
}

function startObserving() {
  if (mutationObserver) {
    mutationObserver.disconnect()
  }

  mutationObserver = new MutationObserver((mutations) => {
    if (!isEnabled) return

    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            // 检查新增的节点是否是 UserCell
            if (element.getAttribute("data-testid") === "UserCell") {
              processUserCell(element)
            }
            // 检查新增节点的子元素中是否有 UserCell
            const cells = element.querySelectorAll('[data-testid="UserCell"]')
            cells.forEach(processUserCell)
          }
        })
      }
    }
  })

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}

// 导出功能
function createExportButton() {
  // 防止重复创建
  if (document.getElementById("x-mutual-export-container")) {
    return
  }

  const container = document.createElement("div")
  container.id = "x-mutual-export-container"
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9998;
    background: white;
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    border: 1px solid rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  `

  // 添加悬停效果
  container.onmouseover = () => {
    container.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.12)"
    container.style.transform = "translateY(-2px)"
  }
  container.onmouseout = () => {
    container.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)"
    container.style.transform = "translateY(0)"
  }

  const button = document.createElement("button")
  button.id = "x-mutual-export-btn"
  button.style.cssText = `
    padding: 12px 20px;
    background: linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 8px rgba(29, 155, 240, 0.3);
    letter-spacing: 0.3px;
  `

  // 创建下载图标 SVG
  const downloadIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  downloadIcon.setAttribute("fill", "none")
  downloadIcon.setAttribute("stroke", "currentColor")
  downloadIcon.setAttribute("viewBox", "0 0 24 24")
  downloadIcon.style.cssText = `
    width: 18px;
    height: 18px;
  `

  const downloadPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
  downloadPath.setAttribute("stroke-linecap", "round")
  downloadPath.setAttribute("stroke-linejoin", "round")
  downloadPath.setAttribute("stroke-width", "2")
  downloadPath.setAttribute("d", "M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z")
  downloadIcon.appendChild(downloadPath)

  const buttonText = document.createElement("span")
  buttonText.textContent = "导出关注列表为 CSV"

  button.appendChild(downloadIcon)
  button.appendChild(buttonText)

  button.onmouseover = () => {
    button.style.background = "linear-gradient(135deg, #1a8cd8 0%, #0d7ec4 100%)"
    button.style.transform = "scale(1.02)"
    button.style.boxShadow = "0 4px 12px rgba(29, 155, 240, 0.4)"
  }
  button.onmouseout = () => {
    button.style.background = "linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%)"
    button.style.transform = "scale(1)"
    button.style.boxShadow = "0 2px 8px rgba(29, 155, 240, 0.3)"
  }

  const progress = document.createElement("div")
  progress.id = "x-mutual-export-progress"
  progress.textContent = "就绪"
  progress.style.cssText = `
    margin-top: 10px;
    font-size: 12px;
    color: #64748b;
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.2px;
  `

  container.appendChild(button)
  container.appendChild(progress)
  document.body.appendChild(container)

  // 数据收集相关
  const collectedUsers = new Map<string, any>()
  let scrolling = false
  let scrollTimer: any
  let noNewTimer: any

  const collectUsers = () => {
    const cells = document.querySelectorAll('[data-testid="UserCell"]')
    let newAdded = 0

    cells.forEach((cell: any) => {
      try {
        const linkEl = cell.querySelector('a[role="link"][href^="/"]')
        if (!linkEl) return

        const username = linkEl.getAttribute("href").slice(1)
        if (collectedUsers.has(username)) return

        const displayNameEl = cell.querySelector('div[dir="ltr"] span')
        const displayName = displayNameEl?.textContent || "未知"

        const followsYou = !!cell.querySelector('[data-testid="userFollowIndicator"]')
        const isBlueVerified = !!cell.querySelector('[data-testid="icon-verified"]')

        collectedUsers.set(username, {
          displayName,
          username: `@${username}`,
          mutual: followsYou ? "是" : "否",
          blueV: isBlueVerified ? "是" : "否",
          link: `https://x.com/${username}`
        })
        newAdded++
      } catch (error) {
        console.error("Error collecting user data:", error)
      }
    })

    progress.textContent = `已加载：${collectedUsers.size} 人${scrolling ? "（滚动中...）" : ""}`
    return newAdded
  }

  const scrollAndCollect = () => {
    window.scrollBy(0, window.innerHeight * 1.5)
    const newAdded = collectUsers()

    clearTimeout(noNewTimer)
    if (newAdded === 0) {
      noNewTimer = setTimeout(stopAndExport, 15000)
    } else {
      noNewTimer = setTimeout(stopAndExport, 15000)
    }
  }

  const stopAndExport = () => {
    scrolling = false
    clearInterval(scrollTimer)
    clearTimeout(noNewTimer)

    // 更新按钮状态为成功
    buttonText.textContent = "导出完成！"
    button.disabled = true
    button.style.background = "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    button.style.cursor = "not-allowed"
    button.style.boxShadow = "0 2px 8px rgba(16, 185, 129, 0.3)"

    exportCSV()

    // 3秒后恢复按钮
    setTimeout(() => {
      button.disabled = false
      button.style.cursor = "pointer"
      buttonText.textContent = "导出关注列表为 CSV"
      button.style.background = "linear-gradient(135deg, #1d9bf0 0%, #1a8cd8 100%)"
      button.style.boxShadow = "0 2px 8px rgba(29, 155, 240, 0.3)"
      progress.textContent = "就绪"
      progress.style.color = "#64748b"
    }, 3000)
  }

  const exportCSV = () => {
    if (collectedUsers.size === 0) {
      alert("未收集到任何用户数据")
      return
    }

    try {
      let csv = "显示名称,用户名,是否互关,是否蓝V,主页链接\n"
      collectedUsers.forEach((u) => {
        csv += `"${u.displayName}","${u.username}","${u.mutual}","${u.blueV}","${u.link}"\n`
      })

      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "").replace("T", "_")
      a.download = `我的关注列表_${timestamp}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      alert("CSV 文件生成失败")
      console.error("CSV generation error:", error)
    }
  }

  button.onclick = () => {
    if (scrolling) {
      stopAndExport()
      return
    }

    scrolling = true
    buttonText.textContent = "滚动中...点击停止"
    button.style.background = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
    button.style.boxShadow = "0 2px 8px rgba(245, 158, 11, 0.3)"
    progress.textContent = "开始加载..."
    progress.style.color = "#f59e0b"
    collectedUsers.clear()
    collectUsers()

    const randomDelay = () => 3000 + Math.random() * 3000
    scrollTimer = setInterval(scrollAndCollect, randomDelay())
    noNewTimer = setTimeout(stopAndExport, 15000)
  }
}

export default function Content() {
  return null
}
