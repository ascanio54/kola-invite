const revealItems = document.querySelectorAll('.reveal');
const form = document.querySelector('#rsvp-form');
const formStatus = document.querySelector('#form-status');
const familyMembersContainer = document.querySelector('#family-members');
const addFamilyMemberButton = document.querySelector('#add-family-member');
const familyTemplate = document.querySelector('#family-member-template');
const guestLimitNote = document.querySelector('#guest-limit-note');

const FAMILY_LIMIT = 10;

const showStatus = (message, type = 'default') => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.remove('is-success', 'is-error');

  if (type === 'success') formStatus.classList.add('is-success');
  if (type === 'error') formStatus.classList.add('is-error');
};

const getFamilyMemberCount = () =>
  familyMembersContainer ? familyMembersContainer.querySelectorAll('.family-member-row').length : 0;

const updateFamilyControls = () => {
  if (!familyMembersContainer || !addFamilyMemberButton || !guestLimitNote) return;

  const count = getFamilyMemberCount();
  const remaining = FAMILY_LIMIT - count;

  addFamilyMemberButton.disabled = count >= FAMILY_LIMIT;
  addFamilyMemberButton.setAttribute('aria-disabled', String(count >= FAMILY_LIMIT));

  if (count === 0) {
    guestLimitNote.textContent = `Можно добавить до ${FAMILY_LIMIT} дополнительных гостей.`;
    return;
  }

  if (remaining > 0) {
    guestLimitNote.textContent = `Добавлено гостей: ${count}. Можно добавить ещё ${remaining}.`;
    return;
  }

  guestLimitNote.textContent = 'Достигнут лимит: 10 дополнительных гостей.';
};

const createFamilyMember = () => {
  if (!familyTemplate || !familyMembersContainer) return;
  if (getFamilyMemberCount() >= FAMILY_LIMIT) {
    updateFamilyControls();
    return;
  }

  const fragment = familyTemplate.content.cloneNode(true);
  const row = fragment.querySelector('.family-member-row');
  const input = fragment.querySelector('input');
  const label = fragment.querySelector('label');
  const removeButton = fragment.querySelector('.remove-family-member');
  const nextIndex = getFamilyMemberCount() + 2;

  if (input) {
    input.id = `family-member-${nextIndex}`;
  }

  if (label) {
    label.setAttribute('for', `family-member-${nextIndex}`);
    label.textContent = `Имя и фамилия гостя ${nextIndex}`;
  }

  if (removeButton) {
    removeButton.addEventListener('click', () => {
      row?.remove();
      renumberFamilyMembers();
      updateFamilyControls();
    });
  }

  familyMembersContainer.appendChild(fragment);
  updateFamilyControls();
};

const renumberFamilyMembers = () => {
  if (!familyMembersContainer) return;

  const rows = familyMembersContainer.querySelectorAll('.family-member-row');
  rows.forEach((row, index) => {
    const number = index + 2;
    const input = row.querySelector('input');
    const label = row.querySelector('label');

    if (input) {
      input.id = `family-member-${number}`;
    }

    if (label) {
      label.setAttribute('for', `family-member-${number}`);
      label.textContent = `Имя и фамилия гостя ${number}`;
    }
  });
};

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (addFamilyMemberButton) {
  addFamilyMemberButton.addEventListener('click', createFamilyMember);
  updateFamilyControls();
}

if (form) {
  form.addEventListener('submit', async (event) => {
    const mode = form.dataset.mode || 'demo';
    const testEmail = form.dataset.testEmail || '';
    const formData = new FormData(form);
    const primaryGuestName = String(formData.get('primary_guest_name') || '').trim();
    const attendance = String(formData.get('attendance') || '').trim();

    if (!primaryGuestName) {
      event.preventDefault();
      showStatus('Пожалуйста, укажите имя и фамилию.', 'error');
      form.querySelector('#guest-name')?.focus();
      return;
    }

    if (!attendance) {
      event.preventDefault();
      showStatus('Пожалуйста, выберите, получится ли прийти.', 'error');
      return;
    }

    if (mode === 'demo') {
      event.preventDefault();
      const suffix = testEmail ? ` Тестовый email для будущей отправки: ${testEmail}.` : '';
      showStatus(`Черновой режим: форма локально проверена.${suffix}`, 'success');
      form.reset();
      if (familyMembersContainer) {
        familyMembersContainer.innerHTML = '';
      }
      updateFamilyControls();
      return;
    }

    showStatus('Отправляем ответ…');
  });
}
