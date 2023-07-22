const MESSAGE_EVENTS = {
  GET_STORAGE_DATA: "GET_STORAGE_DATA",
  LOG_STORAGE_DATA: "LOG_STORAGE_DATA",
  INSPECT_ON: "INSPECT_ON",
};

const getActiveTab = async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });

  return tabs[0];
};

// Background script
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  switch (request.action) {
    case MESSAGE_EVENTS.GET_STORAGE_DATA:
      getStorage(request.data);
      break;
    default:
      break;
  }
});

const getStorage = async (storage) => {
  const { localStorage, sessionStorage } = storage;
  try {
    // const activeTab = await getActiveTab();

    const payload = {
      localStorage: Object.assign({}, localStorage),
      sessionStorage: Object.assign({}, sessionStorage),
      // cookies: chrome.cookies.getAll({ url: activeTab.url }),
    };
    chrome.runtime.sendMessage({
      action: MESSAGE_EVENTS.LOG_STORAGE_DATA,
      data: payload,
    });
  } catch (error) {
    console.log(error.message);
  }
};

console.log("Background script is running.");
