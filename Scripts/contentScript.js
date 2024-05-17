
function add_score(textscore) {
    var existing_score = document.querySelector('.ai_score');
      if (existing_score) {
        existing_score.remove();
        var existing_message = document.querySelector('.ai_message');
        if (existing_message) {
          existing_message.remove();
        }
      }
      var score = document.createElement('span');
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
    }
function MatchResumeToJob(Authorization_token , jobDescription){
    jQuery.ajax({
        url: 'http://127.0.0.1:8000/api/resume-analyze',
        type: 'POST',
        data: {
            jobDescription: jobDescription
        },
        headers: {
            Authorization: 'Bearer ' + Authorization_token
        },
        success: function(response){
            console.log(response);
            jQuery('#score').text(response.score);
            add_score(response.score);
            return response;
        },
        error: function(error){
            console.log(error);
            return error;
        }
    });
}

function get_score(Authorization_token){

    const jobTitle = document.querySelector('.job-details-jobs-unified-top-card__job-title').innerText;
    // const spans = document.querySelectorAll('.jobs-description-content__text span');
    // const spanTexts = Array.from(spans, span => span.innerText.trim()).join('\n');
    console.log(jobTitle);
    const jd = document.querySelector('.jobs-description-content__text').innerText;
    const score = MatchResumeToJob(Authorization_token, jd);

}




function handleJobCardClick(event) {
    const initStorageCache = chrome.storage.sync.get();
    var Authorization_token = null;
    console.log('Init storage cache: ', initStorageCache);
    initStorageCache.then((data) => {
        Authorization_token = data.Authorization_token;
    }).then(() => {
        if (Authorization_token == null || Authorization_token == "" || Authorization_token == "undefined" || Authorization_token == "null") {
            console.log('Authorization token not found');
            return;
        }else{
            console.log('Authorization token found');
            get_score(Authorization_token);
        }
    });
}
// Function to attach event listeners to job cards
function attachJobCardListeners() {
    const jobCards = document.querySelectorAll('.job-card-container--clickable');
    jobCards.forEach(jobCard => {
      jobCard.addEventListener('click', handleJobCardClick);
    });
  }
  
  // Initial attachment of event listeners
  attachJobCardListeners();
  
  // MutationObserver to detect when new job cards are added
  const observer = new MutationObserver((mutationsList, observer) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        attachJobCardListeners();
      }
    }
  });
  
  // Start observing the document for added job cards
  observer.observe(document.body, { childList: true, subtree: true });