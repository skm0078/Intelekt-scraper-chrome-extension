document.addEventListener(
  "DOMContentLoaded",
  function () {
    var selectElementButton = document.getElementById("inspect");

    // to be able to start inspection
    selectElementButton.addEventListener(
      "click",
      function () {
        // send the message to start inspection
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: MESSAGE_EVENTS.INSPECT_ON,
            });
          }
        );
        console.log("popup");
        // close the extension popup
        // window.close();
      },
      false
    );
  },
  false
);
