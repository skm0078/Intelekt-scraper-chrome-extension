// Popup script
document.addEventListener("DOMContentLoaded", function () {
  var logButton = document.getElementById("logButton");
  logButton.addEventListener("click", function () {
    // Send a message to the background script requesting storage and cookies data
    chrome.runtime.sendMessage({ action: "logData" });
  });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "logResult") {
    console.log("Local Storage:", request.data.localStorageData);
    console.log("Session Storage:", request.data.sessionStorageData);
    console.log("Cookies:", request.data.cookies);
  }
});
