
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
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'addscore', score: response.score}, async function(_error) {
                    console.log(_error);
                });
            });

            return response;
        },
        error: function(error){
            console.log(error);
            return error;
        }
    });
}

function get_score(Authorization_token){
    // chrome.runtime.sendMessage({ action: 'getCurrentTab' }, (response) => {
        // console.log(response);
        // if (response.tab) {
            chrome.runtime.sendMessage({action: 'scrapeJob'}, async function(response) {
                if (response) {
                    // Send job data to OpenAI for resume comparison and display the result
                    console.log(response);
                    var jobDescription = `title: ${response.title} \n JD: ${response.description}`;
                    console.log(jobDescription);
                    var jd_score = await MatchResumeToJob(Authorization_token, jobDescription);
                }
            });
        // }
    // });
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