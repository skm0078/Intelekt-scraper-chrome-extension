try {
  importScripts("utils.js");
} catch (e) {
  console.error(e);
}

// // Background script
chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  switch (request.action) {
    case MESSAGE_EVENTS.GET_STORAGE_DATA:
      getStorage(request.data);
      break;
    case MESSAGE_EVENTS.INSPECTED_DATA:
      console.log(request.data);
      break;
    default:
      break;
  }
});

const getStorage = async (storage) => {
  const { localStorage, sessionStorage } = storage;
  try {
    const activeTab = await getActiveTab();

    const payload = {
      localStorage: Object.assign({}, localStorage),
      sessionStorage: Object.assign({}, sessionStorage),
      cookies: await chrome.cookies.getAll({ url: activeTab.url }),
    };
    console.log(payload);
    // sendMessage(MESSAGE_EVENTS.LOG_STORAGE_DATA, payload);
  } catch (error) {
    console.log(error.message);
  }
};

console.log("Background script is running.");
