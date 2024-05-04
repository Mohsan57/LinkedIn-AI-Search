// popup.js
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('matchBtn').addEventListener('click', function() {
      document.getElementById('result').innerText = 'Loading...';
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'scrapeJob'}, async function(response) {
          if (response) {
            // Send job data to OpenAI for resume comparison and display the result

          }
        });
      });
    });
  });