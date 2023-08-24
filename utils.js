const MESSAGE_EVENTS = {
  GET_STORAGE_DATA: "GET_STORAGE_DATA",
  INSPECTED_DATA: "INSPECTED_DATA",
  INSPECT_START: "INSPECT_START",
  INSPECT_END: "INSPECT_END",
  SHOW_ALERT: "SHOW_ALERT",
};

const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return tabs[0];
};

const sendMessage = (messageEvent, payload) => {
  chrome.runtime.sendMessage({
    action: messageEvent,
    data: payload,
  });
};

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000); // You can adjust the range as needed
  return `${timestamp}-${randomPart}`;
}

const INTELKET_UNIQUE_TOKEN = "INTELKET_UNIQUE_TOKEN";

const INTELEKT_BUTTONS_IDS = {
  SUBMIT: "INTELEKT_BUTTON_SUBMIT",
  CANCEL: "INTELEKT_BUTTON_CANCEL",
};

const PAGINATION_TYPE = {
  SINGLE: "SINGLE",
  NEXT_PAGE: "NEXT_PAGE",
  INFINITE_SCROLL: "INFINITE_SCROLL",
};
