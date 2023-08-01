document.addEventListener("DOMContentLoaded", function () {
  const currentSpeedElement = document.getElementById("currentSpeed");
  let currentSpeed = 1.0; // Initialize with the default speed (1.0x)

  // Function to send a speed request to content script
  function setVideoSpeed(speed) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "setSpeed", speed: speed }, function (response) {
        if (response.success) {
          currentSpeed = speed; // Update the current speed when changed successfully
          updateSpeedDisplay(currentSpeed);
        } else {
          currentSpeedElement.textContent = "Error: " + response.error;
        }
      });
    });
  }

  // Function to update the speed display in the extension popup
  function updateSpeedDisplay(speed) {
    const formattedSpeed = speed === 1.0 ? "1x" : speed.toFixed(2) + "x";
    currentSpeedElement.textContent = "" + formattedSpeed;
  }

  // Function to fetch the current speed from the YouTube player
  function getCurrentSpeedFromYouTube() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getCurrentSpeed" }, function (response) {
        if (response.success) {
          currentSpeed = response.currentSpeed; // Update the current speed from the YouTube video
          updateSpeedDisplay(currentSpeed); // Update the display in the extension popup
        } else {
          currentSpeedElement.textContent = "Error: " + response.error;
        }
      });
    });
  }

  // Function to increase the video speed
  function increaseSpeed() {
    setVideoSpeed(currentSpeed + 0.25);
  }

  // Function to decrease the video speed
  function decreaseSpeed() {
    setVideoSpeed(currentSpeed - 0.25);
  }

  // Function to handle keydown events
  function handleKeyDown(event) {
    // Check if the event occurred when the popup is focused
    if (event.target === document.body) {
      if (event.key === "ArrowUp") {
        // Increase speed when the "ArrowUp" key is pressed
        increaseSpeed();
      } else if (event.key === "ArrowDown") {
        // Decrease speed when the "ArrowDown" key is pressed
        decreaseSpeed();
      }
    }
  }

  // Attach the keydown event listener to the document
  document.addEventListener("keydown", handleKeyDown);

  // Call getCurrentSpeedFromYouTube when the popup is opened to get the current speed from YouTube
  getCurrentSpeedFromYouTube();

  // Increase speed button
  document.getElementById("increaseSpeedButton").addEventListener("click", function () {
    setVideoSpeed(currentSpeed + 0.25);
  });

  // Reset speed button
  document.getElementById("resetSpeedButton").addEventListener("click", function () {
    setVideoSpeed(1.0);
  });

  // Decrease speed button
  document.getElementById("decreaseSpeedButton").addEventListener("click", function () {
    setVideoSpeed(currentSpeed - 0.25);
  });

  // Handle speed selection from the dropdown menu
  const dropdownItems = document.querySelectorAll(".dropdown-content a");
  for (const item of dropdownItems) {
    item.addEventListener("click", function (event) {
      const selectedSpeed = parseFloat(event.target.getAttribute("data-speed"));
      setVideoSpeed(selectedSpeed);
    });
  }

  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "updateSpeed") {
      const speed = message.speed;
      currentSpeed = speed; // Update the current speed in the popup script
      updateSpeedDisplay(currentSpeed); // Update the display in the extension popup
    }
  });
});
