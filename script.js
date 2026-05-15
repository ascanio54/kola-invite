const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const form = document.querySelector("#rsvp-form");
const addFamilyButton = document.querySelector("#add-family-member");
const familyMembers = document.querySelector("#family-members");
const submitButton = form?.querySelector('button[type="submit"]');
const successBox = document.querySelector("[data-form-success]");
const errorBox = document.querySelector("[data-form-error]");
const iframe = document.querySelector("#rsvp_target");

const MAX_EXTRA_GUESTS = 10;
let submitInProgress = false;

function hideFormMessages() {
  if (successBox) successBox.hidden = true;
  if (errorBox) errorBox.hidden = true;
}

function getExtraGuestCount() {
  return familyMembers
    ? familyMembers.querySelectorAll(".family-member").length
    : 0;
}

function updateAddFamilyButtonState() {
  if (!addFamilyButton) return;

  const isLimitReached = getExtraGuestCount() >= MAX_EXTRA_GUESTS;
  addFamilyButton.disabled = isLimitReached;
}

function createFamilyMemberField() {
  if (!familyMembers) return;

  if (getExtraGuestCount() >= MAX_EXTRA_GUESTS) {
    updateAddFamilyButtonState();
    return;
  }

  const fieldId = `family-member-${Date.now()}`;

  const wrapper = document.createElement("div");
  wrapper.className = "family-member";

  const input = document.createElement("input");
  input.type = "text";
  input.name = "family";
  input.id = fieldId;
  input.placeholder = "Имя и фамилия";
  input.autocomplete = "name";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-family-member";
  removeButton.setAttribute("aria-label", "Удалить гостя");
  removeButton.textContent = "×";

  removeButton.addEventListener("click", () => {
    wrapper.remove();
    updateAddFamilyButtonState();
  });

  wrapper.append(input, removeButton);
  familyMembers.append(wrapper);

  input.focus();
  updateAddFamilyButtonState();
}

addFamilyButton?.addEventListener("click", createFamilyMemberField);

if (form && iframe) {
  hideFormMessages();

  form.addEventListener("submit", () => {
    hideFormMessages();
    submitInProgress = true;

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Отправляем...";
    }
  });

  iframe.addEventListener("load", () => {
    if (!submitInProgress) return;

    submitInProgress = false;

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Отправить ответ";
    }

    form.reset();

    if (familyMembers) {
      familyMembers.innerHTML = "";
    }

    updateAddFamilyButtonState();

    if (successBox) {
      successBox.hidden = false;
      successBox.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  });
}

updateAddFamilyButtonState();
