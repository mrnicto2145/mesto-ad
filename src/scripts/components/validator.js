function showInputError(
  formElement,
  inputElement,
  errorMessage,
  currentSettings
) {
  const errorElement = formElement.querySelector(
    currentSettings.getErrorId(inputElement)
  );
  errorElement.textContent = errorMessage;
  errorElement.classList.add(currentSettings.errorClass);
}

function hideInputError(formElement, inputElement, currentSettings) {
  const errorElement = formElement.querySelector(
    currentSettings.getErrorId(inputElement)
  );
  errorElement.classList.remove(currentSettings.errorClass);
  errorElement.textContent = "";
}

function checkInputValidity(
  formElement,
  inputElement,
  validator,
  currentSettings
) {
  const errorNum = validator(inputElement);
  if (errorNum === 0) {
    hideInputError(formElement, inputElement, currentSettings);
  } else if (errorNum === 1) {
    showInputError(
      formElement,
      inputElement,
      inputElement.getAttribute(currentSettings.errorMessage),
      currentSettings
    );
  } else {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      currentSettings
    );
  }
}

function hasInvalidInput(formElement, currentSettings) {
  let inputElements = Array.from(
    formElement.querySelectorAll(currentSettings.inputSelector)
  );
  for (let i = 0; i < inputElements.length; i++) {
    if (currentSettings.validators[i](inputElements[i]) !== 0) {
      return true;
    }
  }
  return false;
}

function disableSubmitButton(buttonElement, inactiveButtonClass) {
  buttonElement.setAttribute("disabled", "");
  buttonElement.classList.add(inactiveButtonClass);
}

function enableSubmitButton(buttonElement, inactiveButtonClass) {
  if (buttonElement.hasAttribute("disabled")) {
    buttonElement.removeAttribute("disabled");
  }
  buttonElement.classList.remove(inactiveButtonClass);
}

function toggleButtonState(formElement, currentSettings) {
  const buttonElement = formElement.querySelector(
    currentSettings.submitButtonSelector
  );
  if (hasInvalidInput(formElement, currentSettings)) {
    disableSubmitButton(buttonElement, currentSettings.inactiveButtonClass);
  } else {
    enableSubmitButton(buttonElement, currentSettings.inactiveButtonClass);
  }
}

function clearValidation(formElement, currentSettings) {
  let inputElements = Array.from(
    formElement.querySelectorAll(currentSettings.inputSelector)
  );
  for (let i = 0; i < inputElements.length; i++) {
    let hideSettings = {
      inputErrorClass: currentSettings.inputErrorClass[i],
      errorClass: currentSettings.errorClass[i],
      getErrorId: currentSettings.getErrorId,
    };
    hideInputError(formElement, inputElements[i], hideSettings);
  }
  let button = formElement.querySelector(currentSettings.submitButtonSelector);
  disableSubmitButton(button, currentSettings.inactiveButtonClass);
}

function setEventListeners(formElement, currentSettings) {
  let inputElements = Array.from(
    formElement.querySelectorAll(currentSettings.inputSelector)
  );
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].addEventListener("input", (evt) => {
      checkInputValidity(
        formElement,
        inputElements[i],
        currentSettings.validators[i],
        currentSettings
      );
      toggleButtonState(formElement, currentSettings);
    });
  }
}

function enableValidation(validationSettings) {
  const formElements = Array.from(
    document.querySelectorAll(validationSettings.formSelector)
  );
  for (let i = 0; i < validationSettings.formsCount; i++) {
    let formSettings = {
      formSelector: validationSettings.formSelector,
      inputSelector: validationSettings.inputSelector,
      submitButtonSelector: validationSettings.submitButtonSelector,
      inactiveButtonClass: validationSettings.inactiveButtonClass,
      inputErrorClass: validationSettings.inputErrorClass,
      errorClass: validationSettings.errorClass,
      validators: validationSettings.validators[i],
      getErrorId: validationSettings.getErrorId,
      errorMessage: validationSettings.errorMessage,
    };
    setEventListeners(formElements[i], formSettings);
  }
}

export { clearValidation, enableValidation };
