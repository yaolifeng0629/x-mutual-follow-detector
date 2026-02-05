# Chrome Extension Permission Justification

When submitting your extension to the Chrome Web Store, you may be asked to justify the permissions you have requested in your `manifest.json`. Below are the standard justifications for the permissions used in this project (`x-mutual-follow-detector`).

## 1. `storage` Permission

**Usage:**
This permission is used to save user preferences (such as the enabled/disabled state of the extension) and to locally cache the list of followed users to improve performance and reduce network requests.

**Justification for Chrome Web Store:**

> "The extension uses the `storage` permission to save user preferences (such as the enabled/disabled state of the extension) and to locally cache the list of followed users. This improves performance by reducing necessary network requests and provides a seamless user experience across browser sessions."

## 2. `tabs` Permission

**Usage:**
The extension needs to access the current tab's URL to determine if the user is on the specific X (Twitter) "Following" page (`https://x.com/*/following`). The extension's core functionality is only activated when this specific URL pattern is detected.

**Justification for Chrome Web Store:**

> "The `tabs` permission is required to check the URL of the active tab. This allows the extension to automatically detect if the user is on the specific 'Following' page of X (Twitter). The extension only activates its main functionality when it detects this specific URL pattern, ensuring it remains unobtrusive on other pages."

## 3. Host Permission (`https://x.com/*`)

**Usage:**
The extension requires access to the X (Twitter) domain to interact with the DOM of the "Following" page. This allows it to analyze the list of users, identify mutual follows, and visually tag users directly on the page.

**Justification for Chrome Web Store:**

> "The extension requires access to `https://x.com/*` to interact with the web page's DOM. This is essential for the core functionality: analyzing the user's following list directly on the page and visually tagging users who are not following back. All processing operates locally within the browser context."
