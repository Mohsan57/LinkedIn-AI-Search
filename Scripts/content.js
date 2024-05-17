
// // content.js
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === 'scrapeJob') {
//         const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title').innerText;
//         const spans = document.querySelectorAll('.jobs-description-content__text span');
//         const spanTexts = Array.from(spans, span => span.innerText.trim()).join('\n');
//         sendResponse({title: jobTitle, description: spanTexts});
//         }
//     });


// content.js


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'scrapeJob') {
      const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title').innerText;
      // const spans = document.querySelectorAll('.jobs-description-content__text span');
      // const spanTexts = Array.from(spans, span => span.innerText.trim()).join('\n');
      const jd = document.querySelector('.jobs-description-content__text').innerText;
      sendResponse({title: jobTitle, description: jd});
    }
    else if (message.action === 'addscore') {
      var existing_score = document.querySelector('.ai_score');
      if (existing_score) {
        existing_score.remove();
        var existing_message = document.querySelector('.ai_message');
        if (existing_message) {
          existing_message.remove();
        }
      }
      var score = document.createElement('span');
      var textscore = message.score;
      textscore = textscore.toFixed(0);
      score.innerText = `${textscore}% Match`;
      score.setAttribute('class', 'ai_score');
      var style = document.createAttribute('style');
      style.value = 'color: #ff0000; font-size: 20px; margin-left: 10px;';
      score.setAttributeNode(style);
      var _error = "adding score to job:";
      var message_text = document.createElement('span');
      var message_style = document.createAttribute('style');
      message_style.value = 'font-size: 20px; margin-left: 10px;';
      message_text.setAttributeNode(message_style);
      try {
        if(textscore > 73) {
          score.style.color = '#00ff00';
          message_text.innerHTML = `(<b>Please apply</b>)`;
          message_text.style.color = '#00ff00';
        }else{
          score.style.color = '#ff0000';
          message_text.innerHTML = `(<b>Don't apply</b>)`;
          message_text.style.color = '#ff0000';
        }
        message_text.setAttribute('class', 'ai_message');
        document.querySelector('.job-details-jobs-unified-top-card__job-title').appendChild(score);
        // document.querySelector('.job-details-jobs-unified-top-card__job-title').appendChild(message_text);
        
        _error = "adding score to job description:"
      } catch (error) {
        console.error('Error adding score to job:', error);
        _error = error;
      }
      sendResponse({error: _error});
      // document.querySelector('.job-details-jobs-unified-top-card__job-title').appendChild(document.createElement('span')).innerText = `Score: ${message.score}`;
    }else if (message.action === 'getCurrentTab') {
      console.log('Received message to get current tab');
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        sendResponse({ tab: tabs[0] });
      });
      return true; // Keep the message channel open for sendResponse
    }
  });