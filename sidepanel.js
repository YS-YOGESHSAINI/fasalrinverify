document.getElementById('startBtn').addEventListener('click', () => {
  const maxLoops = parseInt(document.getElementById('loopInput').value) || 10;
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { 
      action: 'start',
      maxLoops: maxLoops 
    });
  });
});

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' });
  });
});

// Listen for status updates from the content script
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'updateStatus') {
    document.getElementById('statusText').innerText = request.status;
    document.getElementById('loopCount').innerText = `${request.currentLoop} / ${request.maxLoops}`;
  }
});