let data = null;

function fetchData() {
  fetch('https://api.skinpricer.com/lowest_offer.json')
    .then(response => response.json())
    .then(d => {
      data = d;
    })
    .catch(error => console.error('Failed to load data:', error));
}

fetchData();
setInterval(fetchData, 5 * 60 * 1000);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message === 'getData') {
    if (data !== null) {
      sendResponse(data);
    } else {
      const intervalId = setInterval(() => {
        if (data !== null) {
          clearInterval(intervalId);
          sendResponse(data);
        }
      }, 100);
    }
  }
});

