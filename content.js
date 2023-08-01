// Function to set the video speed on the YouTube page
function setVideoSpeed(speed) {
  const video = document.querySelector("video");
  if (video && typeof speed === "number" && !isNaN(speed)) {
    video.playbackRate = speed;
    // Send a message to the popup script indicating the speed update
    chrome.runtime.sendMessage({ action: "updateSpeed", speed: speed });
    return { success: true, currentSpeed: speed };
  } else {
    return { success: false, error: "Invalid speed value." };
  }
}

// Function to send the current speed back to the popup script
function getCurrentSpeed() {
  const video = document.querySelector("video");
  if (video) {
    const currentSpeed = video.playbackRate;
    return { success: true, currentSpeed: currentSpeed };
  } else {
    return { success: false, error: "Video not found." };
  }
}

// Listen for changes in video speed and send the updated speed to the popup script
const video = document.querySelector("video");
if (video) {
  video.addEventListener("ratechange", function () {
    const currentSpeed = video.playbackRate;
    // Send a message to the popup script indicating the speed update
    chrome.runtime.sendMessage({ action: "updateSpeed", speed: currentSpeed });
  });
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "setSpeed") {
    const response = setVideoSpeed(message.speed);
    sendResponse(response);
  } else if (message.action === "getCurrentSpeed") {
    const response = getCurrentSpeed();
    sendResponse(response);
  }
});

// Call getCurrentSpeed when the content script is injected into the page to get the initial speed
getCurrentSpeed();
