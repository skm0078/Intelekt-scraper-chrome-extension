const MESSAGE_EVENTS = {
  GET_STORAGE_DATA: "GET_STORAGE_DATA",
  INSPECTED_DATA: "INSPECTED_DATA",
  INSPECT_ON: "INSPECT_ON",
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
