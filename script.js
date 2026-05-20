document.body.classList.add("loader-active");

const loader = document.querySelector(".kola-loader");
const revealItems = document.querySelectorAll("[data-reveal]");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if (loader) {
  const loaderDelay = reducedMotion ? 250 : 7600;

  window.setTimeout(() => {
    loader.classList.add("is-hidden");
    document.body.classList.remove("loader-active");
  }, loaderDelay);
}

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
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
    revealObserver.observe(item);
  });
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

const radioCards = document.querySelectorAll(".radio-card");

radioCards.forEach((card) => {
  const input = card.querySelector('input[type="radio"]');

  input?.addEventListener("change", () => {
    radioCards.forEach((item) => item.classList.remove("is-selected"));

    if (input.checked) {
      card.classList.add("is-selected");
    }
  });
});

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
      submitButton.textContent = "Отправить";
    }

    form.reset();

    radioCards.forEach((item) => item.classList.remove("is-selected"));

    if (familyMembers) {
      familyMembers.innerHTML = "";
    }

    updateAddFamilyButtonState();

    if (successBox) {
      successBox.hidden = false;
      successBox.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  });
}

updateAddFamilyButtonState();

// Kola local fix: interactive dress v1
const lookCard = document.querySelector(".look-card");
const toneButtons = document.querySelectorAll(".tone-button");

toneButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tone = button.dataset.tone;
    if (!lookCard || !tone) return;

    lookCard.dataset.tone = tone;
    lookCard.classList.add("is-changing");

    toneButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    window.setTimeout(() => {
      lookCard.classList.remove("is-changing");
    }, 260);
  });
});
// End Kola local fix: interactive dress v1

// Kola local fix: GSAP invite loader v1
(function setupGsapInviteLoader() {
  const loader = document.querySelector(".invite-loader--variant-a");

  if (!loader) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    loader.classList.add("is-hidden");
    document.body.classList.remove("loader-active");
    return;
  }

  if (!window.gsap) {
    console.warn("GSAP is not loaded. Falling back to CSS loader animation.");
    return;
  }

  document.body.classList.add("gsap-loader-enabled");
  document.body.classList.add("loader-active");

  const gsap = window.gsap;

  const note = loader.querySelector(".invite-note");
  const decorLines = loader.querySelectorAll(".invite-decor__line");
  const envelopeWrap = loader.querySelector(".invite-envelope-wrap");
  const flap = loader.querySelector(".invite-env-flap");
  const front = loader.querySelector(".invite-env-front");
  const back = loader.querySelector(".invite-env-back");
  const liner = loader.querySelector(".invite-env-liner");

  const seal = loader.querySelector(".invite-seal");
  const sealMain = loader.querySelector(".invite-seal-main");
  const sealCracks = loader.querySelector(".invite-seal-cracks");
  const crackPaths = loader.querySelectorAll(".invite-seal-cracks path");
  const sealFragments = loader.querySelectorAll(".invite-seal-fragments, .invite-seal-fragments span");

  const card = loader.querySelector(".invite-photo-card");
  const photo = loader.querySelector(".invite-photo-frame img");
  const cardShine = loader.querySelector(".invite-photo-card::before");
  const cardText = loader.querySelectorAll(".invite-card-kicker, .invite-card-title, .invite-card-names, .invite-card-date");

  const status = loader.querySelector(".invite-opening-status");
  const branchLines = loader.querySelectorAll(".invite-branch-main, .invite-branch-side");
  const leaves = loader.querySelectorAll(".invite-branch-leaf");

  gsap.set(note, {
    autoAlpha: 0,
    xPercent: -50,
    y: -28,
    scale: 0.94,
    filter: "blur(6px)"
  });

  gsap.set(decorLines, {
    strokeDasharray: 260,
    strokeDashoffset: 260,
    autoAlpha: 0
  });

  gsap.set(envelopeWrap, {
    autoAlpha: 0,
    xPercent: -50,
    yPercent: -50,
    y: 30,
    scale: 0.93,
    rotation: -1.3
  });

  gsap.set(flap, {
    transformOrigin: "50% 0%",
    rotationX: 0,
    y: 0,
    autoAlpha: 1
  });

  gsap.set([front, back, liner], {
    autoAlpha: 1,
    y: 0
  });

  gsap.set(seal, {
    autoAlpha: 1,
    scale: 1,
    filter: "blur(0px)"
  });

  gsap.set(sealMain, {
    autoAlpha: 1,
    scale: 1,
    filter: "blur(0px)"
  });

  gsap.set(sealCracks, {
    autoAlpha: 0
  });

  gsap.set(crackPaths, {
    strokeDasharray: 90,
    strokeDashoffset: 90
  });

  gsap.set(sealFragments, {
    autoAlpha: 0,
    display: "none"
  });

  gsap.set(card, {
    autoAlpha: 0,
    xPercent: -50,
    yPercent: -50,
    y: 42,
    scale: 0.92,
    rotation: -1.4,
    filter: "blur(12px)",
    clipPath: "inset(47% 10% 47% 10% round 28px)"
  });

  gsap.set(photo, {
    scale: 1.08,
    filter: "blur(5px)"
  });

  gsap.set(cardText, {
    autoAlpha: 0,
    y: 12,
    filter: "blur(5px)"
  });

  gsap.set(status, {
    autoAlpha: 0,
    xPercent: -50,
    y: 14
  });

  gsap.set(branchLines, {
    strokeDasharray: 320,
    strokeDashoffset: 320
  });

  gsap.set(leaves, {
    autoAlpha: 0,
    scale: 0.55,
    transformOrigin: "50% 50%"
  });

  const tl = gsap.timeline({
    defaults: {
      ease: "power3.out"
    },
    onComplete() {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loader-active");
    }
  });

  tl.to(note, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    duration: 0.75
  }, 0.12);

  tl.to(note, {
    autoAlpha: 0,
    y: -22,
    scale: 0.98,
    filter: "blur(5px)",
    duration: 0.55
  }, 1.9);

  tl.to(decorLines, {
    autoAlpha: 0.9,
    strokeDashoffset: 0,
    duration: 1.6,
    stagger: 0.08
  }, 1.0);

  tl.to(envelopeWrap, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    rotation: 0,
    duration: 1.0
  }, 1.25);

  tl.to(sealMain, {
    scale: 1.07,
    duration: 0.18,
    yoyo: true,
    repeat: 1
  }, 2.75);

  tl.to(sealCracks, {
    autoAlpha: 1,
    duration: 0.12
  }, 3.02);

  tl.to(crackPaths, {
    strokeDashoffset: 0,
    duration: 0.48,
    stagger: 0.035
  }, 3.05);

  tl.to(sealMain, {
    autoAlpha: 0,
    scale: 0.82,
    filter: "blur(5px)",
    duration: 0.62
  }, 3.36);

  tl.to(sealCracks, {
    autoAlpha: 0,
    duration: 0.4
  }, 3.58);

  tl.to(seal, {
    autoAlpha: 0,
    duration: 0.3
  }, 3.85);

  tl.to(flap, {
    rotationX: -128,
    y: -18,
    autoAlpha: 0,
    duration: 0.95,
    ease: "power4.inOut"
  }, 3.72);

  tl.to(front, {
    y: 16,
    scaleY: 0.94,
    autoAlpha: 0,
    duration: 0.78
  }, 3.95);

  tl.to([back, liner], {
    autoAlpha: 0,
    duration: 0.7,
    stagger: 0.03
  }, 4.2);

  tl.to(card, {
    autoAlpha: 1,
    y: -40,
    scale: 1,
    rotation: 0.45,
    filter: "blur(0px)",
    clipPath: "inset(0% 0% 0% 0% round 27px)",
    duration: 1.15,
    ease: "power4.out"
  }, 4.0);

  tl.to(photo, {
    scale: 1,
    filter: "blur(0px)",
    duration: 0.95
  }, 4.45);

  tl.to(cardText, {
    autoAlpha: 1,
    y: 0,
    filter: "blur(0px)",
    duration: 0.52,
    stagger: 0.08
  }, 4.72);

  tl.to(status, {
    autoAlpha: 1,
    y: 0,
    duration: 0.55
  }, 5.25);

  tl.to(branchLines, {
    strokeDashoffset: 0,
    duration: 0.75,
    stagger: 0.06
  }, 5.42);

  tl.to(leaves, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.38,
    stagger: 0.05
  }, 5.86);

  tl.to({}, {
    duration: 0.75
  });
})();
// End Kola local fix: GSAP invite loader v1

/* === KOLA HERO SLIDESHOW START AFTER LOADER V33 START === */
/*
  Starts hero slideshow only after the invite loader is gone.
  This prevents the first hero slideshow from running invisibly behind the loader.
*/
(() => {
  const readyClass = "hero-slideshow-ready";
  const body = document.body;

  if (!body) return;

  body.classList.remove(readyClass);

  let started = false;

  const startHeroSlideshow = () => {
    if (started) return;
    started = true;

    /*
      Restart CSS animations from the beginning:
      1) ensure class is absent;
      2) force reflow;
      3) add class on next animation frame.
    */
    body.classList.remove(readyClass);

    const hero = document.querySelector(".hero-clean-slideshow");
    if (hero) {
      void hero.offsetWidth;
    }

    requestAnimationFrame(() => {
      body.classList.add(readyClass);
    });
  };

  const getLoader = () =>
    document.querySelector(".kola-loader, .invite-loader");

  const isLoaderHidden = (loader) => {
    if (!loader) return true;

    const styles = window.getComputedStyle(loader);

    return (
      loader.classList.contains("is-hidden") ||
      styles.display === "none" ||
      styles.visibility === "hidden" ||
      Number(styles.opacity) <= 0.01
    );
  };

  const arm = () => {
    const loader = getLoader();

    if (!loader) {
      startHeroSlideshow();
      return;
    }

    if (isLoaderHidden(loader)) {
      setTimeout(startHeroSlideshow, 80);
      return;
    }

    loader.addEventListener(
      "transitionend",
      (event) => {
        if (
          event.propertyName === "opacity" ||
          event.propertyName === "visibility"
        ) {
          setTimeout(startHeroSlideshow, 80);
        }
      },
      { once: true },
    );

    const observer = new MutationObserver(() => {
      if (isLoaderHidden(loader)) {
        observer.disconnect();
        setTimeout(startHeroSlideshow, 80);
      }
    });

    observer.observe(loader, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    /*
      Safety fallbacks:
      - normal CSS loader cycle is ~6.4s;
      - emergency hide is ~8.2s in CSS;
      - this guarantees slideshow eventually starts even if transitionend is missed.
    */
    setTimeout(() => {
      if (isLoaderHidden(loader) || !body.classList.contains("loader-active")) {
        startHeroSlideshow();
      }
    }, 6900);

    setTimeout(startHeroSlideshow, 8600);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arm, { once: true });
  } else {
    arm();
  }
})();
/* === KOLA HERO SLIDESHOW START AFTER LOADER V33 END === */

