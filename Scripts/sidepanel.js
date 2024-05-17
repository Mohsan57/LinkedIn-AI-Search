// sidepanel.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateSidePanel') {
      document.getElementById('content').innerHTML = `
        <h2>${message.data.title}</h2>
        <p>${message.data.description}</p>
      `;
    }
  });