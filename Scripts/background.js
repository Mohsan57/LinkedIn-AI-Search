// background.js
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.setPanelBehavior({
    tabId: tab.id,
    behavior: 'new'
  });
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['/Scripts/content.js']
  });
  chrome.tabs.executeScript({
    code: 'var div=document.createElement("div"); document.body.appendChild(div); div.innerText="test123";'

  });
  chrome.runtime.executeScript({
    files: ['/Scripts/content.js']
  });
});
