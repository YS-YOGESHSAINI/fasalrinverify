const firstButtonSelector = '.btn.btn-btn.edit-greenbtn';
const secondButtonSelector = '.btn.genGreenBtn.ms-3';
const thirdButtonSelector = '.btn.btn-btn.mt-3.ms-md-3.green-btn';
const fourthButtonSelector = '.btn.btn-btn.mt-3.ms-md-3.green-btn';

let currentStep = 1;
let currentIteration = 1;
let maxIterations = 10;
let autoClicker = null;
let isRunning = false;

function updatePanelStatus(status) {
  chrome.runtime.sendMessage({
    action: 'updateStatus',
    status: status,
    currentLoop: currentIteration,
    maxLoops: maxIterations
  }).catch(() => {}); // Safely ignore if side panel is closed
}

function startAutoClicker(userMaxLoops) {
  if (isRunning) return;
  
  isRunning = true;
  currentStep = 1;
  currentIteration = 1;
  maxIterations = userMaxLoops || 10;
  
  updatePanelStatus('Running...');
  console.log(`Starting auto-clicker: Loop 1 of ${maxIterations}`);

  autoClicker = setInterval(() => {
    if (currentStep === 1) {
      const firstBtn = document.querySelector(firstButtonSelector);
      if (firstBtn) {
        firstBtn.click();
        console.log(`[Loop ${currentIteration}/${maxIterations}] First button clicked!`);
        currentStep = 2;
      }
    } else if (currentStep === 2) {
      const secondBtn = document.querySelector(secondButtonSelector);
      if (secondBtn) {
        secondBtn.click();
        console.log(`[Loop ${currentIteration}/${maxIterations}] Second button clicked!`);
        currentStep = 3;
      }
    } else if (currentStep === 3) {
      const thirdBtn = document.querySelector(thirdButtonSelector);
      if (thirdBtn) {
        thirdBtn.click();
        console.log(`[Loop ${currentIteration}/${maxIterations}] Third button clicked!`);
        currentStep = 4;
      }
    } else if (currentStep === 4) {
      const fourthBtn = document.querySelector(fourthButtonSelector);
      if (fourthBtn) {
        fourthBtn.click();
        console.log(`[Loop ${currentIteration}/${maxIterations}] Fourth button clicked!`);
        
        if (currentIteration >= maxIterations) {
          console.log("All loops completed!");
          stopAutoClicker(`Completed (${maxIterations}/${maxIterations})`);
        } else {
          currentIteration++;
          currentStep = 1;
          updatePanelStatus(`Running... (Loop ${currentIteration})`);
        }
      }
    }
  }, 1000);
}

function stopAutoClicker(statusText = 'Stopped') {
  if (autoClicker) {
    clearInterval(autoClicker);
    autoClicker = null;
  }
  isRunning = false;
  updatePanelStatus(statusText);
  console.log("Auto-clicker stopped.");
}

// Listen for commands from the side panel
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'start') {
    startAutoClicker(request.maxLoops);
  } else if (request.action === 'stop') {
    stopAutoClicker('Stopped by user');
  }
});