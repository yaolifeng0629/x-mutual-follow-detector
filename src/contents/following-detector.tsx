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
    statsBar.style.display = "block"
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
    background: linear-gradient(135deg, #1DA1F2 0%, #0D8BD9 100%);
    color: white;
    padding: 12px 20px;
    text-align: center;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
  `

  // 创建统计文字
  const statsText = document.createElement("span")
  statsText.className = "stats-text"
  statsText.textContent = "总关注：0 | 未互关：0"

  // 创建提示文字
  const hintText = document.createElement("span")
  hintText.className = "stats-hint"
  hintText.textContent = " 👇 向下滚动查看更多用户"
  hintText.style.cssText = `
    margin-left: 16px;
    font-size: 12px;
    opacity: 0.9;
    font-weight: 400;
  `

  statsBar.appendChild(statsText)
  statsBar.appendChild(hintText)
  document.body.appendChild(statsBar)

  // 为页面内容添加顶部间距，避免被遮挡
  const main = document.querySelector('main')
  if (main) {
    const existingPadding = parseInt(window.getComputedStyle(main).paddingTop) || 0
    main.style.paddingTop = `${existingPadding + 48}px`
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
    bottom: 20px;
    right: 20px;
    z-index: 9998;
    background: #000;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  `

  const button = document.createElement("button")
  button.id = "x-mutual-export-btn"
  button.textContent = "导出关注列表为 CSV"
  button.style.cssText = `
    padding: 10px 16px;
    background: #1DA1F2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background 0.2s ease;
  `
  button.onmouseover = () => {
    button.style.background = "#0D8BD9"
  }
  button.onmouseout = () => {
    button.style.background = "#1DA1F2"
  }

  const progress = document.createElement("div")
  progress.id = "x-mutual-export-progress"
  progress.textContent = "就绪"
  progress.style.cssText = `
    margin-top: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
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
    button.textContent = "导出完成！"
    button.disabled = true
    button.style.background = "#10B981"
    exportCSV()

    // 3秒后恢复按钮
    setTimeout(() => {
      button.disabled = false
      button.textContent = "导出关注列表为 CSV"
      button.style.background = "#1DA1F2"
      progress.textContent = "就绪"
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
    button.textContent = "滚动中...点击停止"
    progress.textContent = "开始加载..."
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
