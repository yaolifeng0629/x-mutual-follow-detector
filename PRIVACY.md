# Privacy Policy for X Mutual Follow Detector

**Last Updated: 2026-02-06**

## Introduction

X Mutual Follow Detector ("we", "our", or "the extension") is committed to protecting your privacy. This privacy policy explains how our browser extension handles data when you use it.

## Our Privacy Commitment

**X Mutual Follow Detector does not collect, store, transmit, or share any of your personal data.**

All processing happens entirely within your browser on your local device. We have designed this extension with privacy as a core principle.

## Single Purpose

X Mutual Follow Detector is designed for a single purpose: **identifying mutual follow status on X (Twitter) and exporting your following list as a CSV file.**
It does not provide any other unrelated functionality.

## Data Collection

### What We DO NOT Collect

- Personal information (name, email, phone number, etc.)
- Browsing history
- Your X (Twitter) account credentials
- Your following list data (except during local, temporary CSV generation)
- User behavior analytics
- Usage statistics
- IP addresses
- Device information
- Cookies or tracking identifiers

### What Data is Processed Locally

The extension processes the following data **only on your local device**:

1. **X (Twitter) Page Content**: When you visit `https://x.com/*/following` pages, the extension reads the DOM to detect mutual follow indicators and display visual tags. This data is processed entirely in your browser's memory. **This data is never stored or transmitted anywhere.**

2. **Following List Data**: When you use the CSV export feature, the extension collects user information (display name, username, mutual status, verified status, profile URL) visible on the page. This data is only used to generate the CSV file downloaded to your device. **It is not stored by the extension.**

3. **User Preferences**: Only one setting is stored locally: whether the extension is enabled or disabled. This is saved using `chrome.storage.local` and never leaves your device.

## Permissions Explained

The extension requests the following permissions, and here's exactly why:

### `storage`

- **Purpose**: Save your preferences locally in your browser
- **Usage**: Store whether the extension is enabled or disabled
- **Privacy**: Data is stored only on your device and is never synchronized or transmitted

### `tabs`

- **Purpose**: Check the URL of the active tab
- **Usage**: Detect if you are on an X (Twitter) "Following" page (`https://x.com/*/following`) to activate the extension's functionality
- **Privacy**: Only reads the tab URL to determine when to run; does not monitor or track your browsing activity on other pages

### `https://x.com/*` (Host Permission)

- **Purpose**: Access the X (Twitter) domain to interact with the page
- **Usage**: Read the DOM of the "Following" page to detect mutual follow indicators and collect user information for CSV export
- **Privacy**: The extension **only interacts with X (Twitter) pages** and **only reads publicly visible information** already displayed on the page. This permission is restricted to `https://x.com/*` only.

## Third-Party Services

X Mutual Follow Detector **does not use any third-party services**, including:

- No analytics platforms (Google Analytics, etc.)
- No crash reporting services
- No advertising networks
- No social media integrations
- No external APIs or servers
- No communication with X (Twitter) APIs

## Data Storage

All data storage is local to your browser:

- **Browser Storage**: User preferences are stored using the Chrome Storage API (`chrome.storage.local`)
- **No Cloud Storage**: We do not use any cloud storage or remote servers
- **No Databases**: We do not maintain any databases of user information
- **No Remote Transmission**: No data is ever sent to external servers

## Data Sharing

We do **NOT** share any data because we do not collect any data in the first place.

## Security

All processing happens locally in your browser's secure sandbox using standard browser APIs. The extension source code is open source and can be reviewed for transparency.

## Open Source

X Mutual Follow Detector is open source software. You can review the complete source code to verify our privacy claims:

**GitHub Repository**: https://github.com/yaolifeng0629/x-mutual-follow-detector

We encourage security researchers and privacy advocates to audit our code.

## Changes to This Privacy Policy

If this policy changes, we will update the "Last Updated" date and publish the new version in this repository.

## Contact Information

If you have questions or concerns about privacy:

- **GitHub Issues**: https://github.com/yaolifeng0629/x-mutual-follow-detector/issues
- **Author**: yaolifeng0629 (https://github.com/yaolifeng0629)

## Summary

**TL;DR**: X Mutual Follow Detector is a privacy-focused browser extension that:

- ✅ Works entirely offline and locally in your browser
- ✅ Does not collect any personal data
- ✅ Does not track your browsing activity
- ✅ Does not communicate with any external servers
- ✅ Only reads X (Twitter) page content when you visit following pages
- ✅ Only stores a single enable/disable preference on your local device
- ✅ Does not store your following list or account data
- ✅ Is open source and auditable

Your privacy is our priority. If you have any questions, please don't hesitate to reach out.

---

**License**: This privacy policy is provided under the same MIT License as the X Mutual Follow Detector extension.
