const sendMessage = (messageEvent, payload) => {
  chrome.runtime.sendMessage({
    action: messageEvent,
    data: payload,
  });
};

window.theRoom.configure({
  blockRedirection: true,
  createInspector: true,
  excludes: [],
  click: function (element, event) {
    event.preventDefault();

    // get the unique css selector of the clicked element
    // and then copy it to clipboard
    console.log(element);

    // so far so good
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
    case MESSAGE_EVENTS.LOG_STORAGE_DATA:
      console.log(request.data);
    default:
      break;
  }
});

sendMessage(MESSAGE_EVENTS.GET_STORAGE_DATA, {
  localStorage,
  sessionStorage,
});
