const customAlert = document.createElement("div");
customAlert.id = "custom-alert";
customAlert.className = "hidden";

document.body.appendChild(customAlert);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request.data);
  switch (request.action) {
    case MESSAGE_EVENTS.SHOW_ALERT:
      customAlert.innerHTML = `
  <div class="custom-alert-content">
  ${request.data}
    <button id="custom-alert-close">Close</button>
    </div>
`;
      customAlert.classList.remove("hidden");
      const closeAlertButton = document.getElementById("custom-alert-close");

      closeAlertButton.addEventListener("click", () => {
        customAlert.classList.add("hidden");
      });

      setTimeout(() => {
        closeAlertButton.removeEventListener("click", () => {
          customAlert.classList.add("hidden");
        });
        customAlert.classList.add("hidden");
      }, 5000);
      break;
    default:
      break;
  }
});
