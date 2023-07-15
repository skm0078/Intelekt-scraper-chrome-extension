// Background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "logData") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        var activeTab = tabs[0];

        // Log local storage
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            function: logLocalStorage,
          },
          function (results) {
            var localStorageData = results[0].result;

            // Log session storage
            chrome.scripting.executeScript(
              {
                target: { tabId: activeTab.id },
                function: logSessionStorage,
              },
              function (results) {
                var sessionStorageData = results[0].result;

                // Log cookies
                chrome.cookies.getAll(
                  { url: activeTab.url },
                  function (cookies) {
                    // Send the logged data back to the popup script
                    chrome.runtime.sendMessage({
                      action: "logResult",
                      data: {
                        localStorageData: localStorageData,
                        sessionStorageData: sessionStorageData,
                        cookies: cookies,
                      },
                    });
                  }
                );
              }
            );
          }
        );
      }
    });
  }
});

// Function to log local storage in the context of the page
function logLocalStorage() {
  return Object.assign({}, localStorage);
}

// Function to log session storage in the context of the page
function logSessionStorage() {
  return Object.assign({}, sessionStorage);
}

console.log("Background script is running.");
