const STAGES = {
  INSPECT_START: "INSPECT_START",
  INSPECT_END: "INSPECT_END",
};

document.addEventListener(
  "DOMContentLoaded",
  function () {
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");

    inspectionEventHandler(startButton, STAGES.INSPECT_START);
    inspectionEventHandler(stopButton, STAGES.INSPECT_END);
  },
  false
);

function inspectionEventHandler(element, stage) {
  // to be able to start inspection
  element.addEventListener(
    "click",
    function () {
      // send the message to start inspection
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (stage === STAGES.INSPECT_START) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: MESSAGE_EVENTS.INSPECT_START,
          });
        } else if (stage === STAGES.INSPECT_END) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: MESSAGE_EVENTS.INSPECT_END,
          });
        }
      });
      console.log("popup");
      // close the extension popup
      // window.close();
    },
    false
  );
}
