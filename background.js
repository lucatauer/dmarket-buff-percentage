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
    sendResponse(data);
  }
});
