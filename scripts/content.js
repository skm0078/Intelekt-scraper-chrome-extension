const recordedElements = [];
const paginationElement = {
  type: "",
  element: "",
};
let IS_STEP_FINAL = false;

/** 
The code `window.theRoom.configure({...})` is configuring the behavior of an inspection tool called
"theRoom".
 */
window.theRoom.configure({
  blockRedirection: true,
  createInspector: true,
  excludes: [],
  click: onClickElementOnInspection,
});

/* The code block is creating a `<link>` element dynamically and appending it to the `<head>` of the
HTML document. This `<link>` element is used to add a CSS stylesheet to the page. */
(() => {
  // inspector element styles
  const linkElement = document.createElement("link");
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
})();

/**
 * The function creates a form element with input fields for name and a submit button, and adds event
 * listeners to handle form submission and validation.
 * @param elementId - The `elementId` parameter is a string that represents the ID of the form element
 * that will be created.
 * @param popover - The `popover` parameter is the element that will display the popover content. It
 * can be any valid HTML element, such as a `<div>` or a `<span>`. The content of the popover will be
 * replaced with the name entered by the user in the form.
 * @param selectedElement - The `selectedElement` parameter is the HTML element that the user has
 * selected or interacted with. It could be any valid HTML element such as a div, span, input, etc.
 * @returns a dynamically created HTML form element.
 */
function createPopoverContent(elementId, popover, selectedElement) {
  stopInspection();
  const form = document.createElement("form");

  form.id = elementId;
  form.innerHTML = `
      <div class="form-group">
        <label class="form-label" for="name">Name:</label>
        <input class="form-input" type="text" id="name" name="name" required>
      </div>
      <button class="form-button" type="submit">Submit</button>
   `;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());

    // Basic validation
    if (!formDataObject.name) {
      alert("Please fill in all fields.");
      return;
    }
    const payload = {
      id: generateUniqueId(),
      name: formDataObject.name,
      element: selectedElement.outerHTML,
    };
    payload.overlay = selectedElement;
    recordedElements.push(payload);

    // replace the popover form with name added by the user
    popover.innerHTML = formDataObject.name;

    //restart inspection once element is registered
    startInspection();
  });
  return form;
}

/**
 * The function `registerComponents` creates and positions an overlay and popover element over a
 * selected element on the page.
 * @param id - The id parameter is a string that represents the unique identifier for the overlay
 * element.
 * @param selectedElement - The `selectedElement` parameter is the element that the overlay will be
 * positioned over. It is used to calculate the position and size of the overlay.
 */
function registerComponents(id, selectedElement) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  overlay.classList.add(INTELKET_UNIQUE_TOKEN);
  overlay.id = id;

  // Position the overlay over the selected element
  const elementRect = selectedElement.getBoundingClientRect();
  overlay.style.top = `${window.scrollY + elementRect.top}px`;
  overlay.style.left = `${elementRect.left}px`;
  overlay.style.width = `${elementRect.width}px`;
  overlay.style.height = `${elementRect.height}px`;

  const popover = document.createElement("div");
  popover.className = "popover";
  const popoverTop = window.scrollY + elementRect.bottom;
  const popoverLeft = elementRect.left;

  popover.style.position = "absolute";
  popover.style.top = `${popoverTop}px`;
  popover.style.left = `${popoverLeft}px`;
  if (IS_STEP_FINAL) {
    document.body.appendChild(overlay);
    paginationElement.type = PAGINATION_TYPE.NEXT_PAGE;
    paginationElement.element = selectedElement.outerHTML;
    stopInspection();
    handleAfterFinalStepDone();
    return;
  }
  const popoverContent = createPopoverContent(id, popover, selectedElement);
  popover.appendChild(popoverContent);

  document.body.appendChild(popover);
  document.body.appendChild(overlay);
}

/**
 * The function "startInspection" starts the inspection of a room.
 */
function startInspection() {
  window.theRoom.start();
}

/**
 * The function "stopInspection" stops the inspection of a room and creates a modal if it is not the
 * final step.
 */
function stopInspection(userInduced = false) {
  window.theRoom.stop(true);
  console.log(userInduced, IS_STEP_FINAL);
  if (userInduced && !IS_STEP_FINAL) {
    IS_STEP_FINAL = true;
    createModal();
  }
}

/**
 * The function prevents the default behavior of an event, checks if an element is already selected,
 * generates a unique ID, and registers components with the generated ID.
 * @param element - The element parameter represents the HTML element that was clicked on or inspected.
 * It could be any valid HTML element such as a div, button, input, etc.
 * @param event - The event parameter is the event object that is passed to the event handler function.
 * It contains information about the event that occurred, such as the type of event, the target
 * element, and any additional data associated with the event. In this case, the event parameter is
 * used to prevent the default behavior of
 * @returns The function does not explicitly return anything.
 */
function onClickElementOnInspection(element, event) {
  event.preventDefault();

  if (isElementAlreadySelected(element)) return;
  const idForSelection = generateUniqueId();

  registerComponents(idForSelection, element);
}

/**
 * The function checks if an element already has a specific class.
 * @param element - The `element` parameter is the HTML element that you want to check if it has a
 * specific class.
 * @returns a boolean value indicating whether the given element has a class of
 * "INTELKET_UNIQUE_TOKEN".
 */
function isElementAlreadySelected(element) {
  return element.classList.contains(INTELKET_UNIQUE_TOKEN);
}

function createModal() {
  const modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "modal";
  modal.innerHTML = `
  <div class="modal-content">
      <h2>Choose an Pagination type: </h2>
      <form id="modalForm">
          <label>
              <input type="radio" name="option" value=${PAGINATION_TYPE.SINGLE}> Single page
          </label>
          <label>
              <input type="radio" name="option" value=${PAGINATION_TYPE.NEXT_PAGE}> Page with next/load more button
          </label>
          <label>
              <input type="radio" name="option" value=${PAGINATION_TYPE.INFINITE_SCROLL}> Page with infinite scroll
          </label>
          <br>
          <button type="submit">Submit</button>
      </form>
  </div>
`;
  document.body.appendChild(modal);

  const modalForm = document.getElementById("modalForm");

  // Handle form submission
  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Validate the form
    const selectedOption = document.querySelector(
      '#modalForm input[name="option"]:checked'
    );

    if (!selectedOption)
      return sendMessage(MESSAGE_EVENTS.SHOW_ALERT, "Please select an option!");
    if (selectedOption.value === PAGINATION_TYPE.NEXT_PAGE) {
      sendMessage(
        MESSAGE_EVENTS.SHOW_ALERT,
        "Please select the next page element!"
      );

      startInspection();
      modal.style.display = "none";
    } else {
      paginationElement.type = selectedOption.value;
      handleAfterFinalStepDone();
      modal.style.display = "none";
    }
  });
}

function handleAfterFinalStepDone() {
  sendMessage(MESSAGE_EVENTS.INSPECTED_DATA, {
    recordedElements,
    paginationElement,
  });
  sendMessage(MESSAGE_EVENTS.GET_STORAGE_DATA, {
    localStorage,
    sessionStorage,
  });
  sendMessage(MESSAGE_EVENTS.SHOW_ALERT, "Please check console for data!");
}

/* The code snippet `chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
... })` is registering an event listener for incoming messages from the Chrome extension runtime. */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case MESSAGE_EVENTS.INSPECT_START:
      startInspection();
      break;
    case MESSAGE_EVENTS.INSPECT_END:
      stopInspection(true);
      break;
    default:
      break;
  }
});
