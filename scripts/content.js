window.theRoom.configure({
  blockRedirection: true,
  createInspector: true,
  excludes: [],
  click: function (element, event) {
    event.preventDefault();

    sendMessage(MESSAGE_EVENTS.INSPECTED_DATA, element.outerHTML);

    // stop inspection
    window.theRoom.stop(true);
  },
});

// inspector element styles
var linkElement = document.createElement("link");
linkElement.setAttribute("rel", "stylesheet");
linkElement.setAttribute("type", "text/css");
linkElement.setAttribute(
  "href",
  "data:text/css;charset=UTF-8," +
    encodeURIComponent(
      ".inspector-element { position: absolute; pointer-events: none;  transition: all 200ms; background-color:rgb(11 48 251 / 15%); }"
    )
);
document.head.appendChild(linkElement);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case MESSAGE_EVENTS.INSPECT_ON:
      window.theRoom.start();
      break;
    default:
      break;
  }
});

sendMessage(MESSAGE_EVENTS.GET_STORAGE_DATA, {
  localStorage,
  sessionStorage,
});
