import { useEffect, useState } from 'react';
import './popup.css';

function IndexPopup() {
    const [enabled, setEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const [isOnFollowingPage, setIsOnFollowingPage] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('');

    useEffect(() => {
        // 从存储中读取当前状态
        chrome.storage.local.get(['enabled'], result => {
            setEnabled(result.enabled !== false);
            setLoading(false);
        });

        // 检查当前页面是否是关注列表页面
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0]?.url) {
                const url = tabs[0].url;
                setCurrentUrl(url);
                setIsOnFollowingPage(/^https:\/\/x\.com\/[^/]+\/following/.test(url));
            }
        });
    }, []);

    const handleToggle = async () => {
        const newState = !enabled;
        setEnabled(newState);

        // 保存到存储
        await chrome.storage.local.set({ enabled: newState });
    };

    const handleOpenFollowingPage = () => {
        // 尝试从当前 URL 提取用户名
        const match = currentUrl.match(/^https:\/\/x\.com\/([^/]+)/);
        if (match) {
            const username = match[1];
            chrome.tabs.update({ url: `https://x.com/${username}/following` });
        } else {
            // 如果无法提取用户名,让用户手动输入或打开 X 首页
            chrome.tabs.create({ url: 'https://x.com/home' });
        }
    };

    if (loading) {
        return (
            <div className="popup-container">
                <div className="loading">
                    <div className="loading-spinner" />
                    <div className="loading-text">加载中...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="popup-container">
            <div className="header">
                <div className="header-content">
                    <div className="title-row">
                        <svg
                            className="icon-small"
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
                        <h1 className="title">X 互关检测助手</h1>
                        <span className="version">v1.1.1</span>
                    </div>
                </div>
            </div>

            <div className="content-body">
                <div className="status-section">
                    {isOnFollowingPage ? (
                        <div className={`status-card ${enabled ? 'active' : 'inactive'}`}>
                            <div className="status-icon">
                                {enabled ? <div className="pulse-ring"></div> : null}
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {enabled ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                                        />
                                    )}
                                </svg>
                            </div>
                            <div className="status-info">
                                <span className="status-label">{enabled ? '检测功能已运行' : '检测功能已暂停'}</span>
                                <span className="status-sub">{enabled ? '正在自动标记列表' : '点击下方开关开启'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="status-card warning">
                            <div className="status-icon">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <div className="status-info">
                                <span className="status-label">请前往关注列表页</span>
                                <span className="status-sub">插件仅在 Following 页面生效</span>
                            </div>
                            <button className="action-btn" onClick={handleOpenFollowingPage}>
                                跳转
                            </button>
                        </div>
                    )}
                </div>

                <div className="control-section">
                    <div className="control-row">
                        <span className="control-label">启用插件功能</span>
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
                </div>
            </div>

            <footer className="footer">
                <a
                    href="https://github.com/yaolifeng0629/x-mutual-follow-detector"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                >
                    <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                    </svg>
                    GitHub
                </a>
            </footer>
        </div>
    );
}

export default IndexPopup;
