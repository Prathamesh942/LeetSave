// content.js

// Function to extract the current page URL
function extractPostURL() {
  return window.location.href;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractPostURL") {
    const postURL = extractPostURL();
    sendResponse({ url: postURL });
  }
});
