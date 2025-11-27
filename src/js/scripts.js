import $ from "jquery";
import "slick-carousel";
import "slick-carousel/slick/slick.css";
import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";

import "../scss/styles.scss";

/* JS Toggle */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[toggle-target]");
  if (!btn) return;

  const raw = btn.getAttribute("toggle-target") || "";
  const id = raw.startsWith("#") ? raw.slice(1) : raw;
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;
  target.classList.toggle("show");
});

/* Countdown timer */
(function () {
  "use strict";

  const COUNTDOWN_ELEMENT = document.getElementById("countdown");
  if (!COUNTDOWN_ELEMENT) return;

  const TARGET_DATE = new Date("2025-12-01T00:00:00");

  const daysElement = document.getElementById("cd-days");
  const hoursElement = document.getElementById("cd-hours");
  const minutesElement = document.getElementById("cd-minutes");
  const secondsElement = document.getElementById("cd-seconds");

  function updateCountdown() {
    const now = new Date();
    const timeRemaining = TARGET_DATE - now;

    if (timeRemaining <= 0) {
      COUNTDOWN_ELEMENT.hidden = true;
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    daysElement.textContent = days.toString().padStart(2, "0");
    hoursElement.textContent = hours.toString().padStart(2, "0");
    minutesElement.textContent = minutes.toString().padStart(2, "0");
    secondsElement.textContent = seconds.toString().padStart(2, "0");

    requestAnimationFrame(updateCountdown);
  }

  updateCountdown();
})();

/* Tabs component */
(() => {
  const container = document.getElementById("tabs");
  if (!container) return;

  const nav = container.querySelector('[role="tablist"]');
  const tabs = Array.from(nav.querySelectorAll('[role="tab"]'));
  const panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));

  const activateTab = (tab, setFocus = true) => {
    const targetId = tab.getAttribute("aria-controls");
    const targetPanel = container.querySelector(`#${CSS.escape(targetId)}`);

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle("tabs__nav-item--active", isActive);
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panels.forEach((p) => {
      p.hidden = p !== targetPanel;
    });

    if (setFocus) tab.focus();
  };

  const getEnabledIndex = (idx) => {
    const len = tabs.length;
    for (let i = 0; i < len; i++) {
      const j = (idx + i + len) % len;
      if (!tabs[j].hasAttribute("disabled")) return j;
    }
    return -1;
  };

  nav.addEventListener("click", (e) => {
    const tab = e.target.closest('[role="tab"]');
    if (!tab || tab.hasAttribute("disabled")) return;
    activateTab(tab, true);
  });

  nav.addEventListener("keydown", (e) => {
    const key = e.key;
    const current = document.activeElement;
    if (!current || current.getAttribute("role") !== "tab") return;

    let idx = tabs.indexOf(current);
    if (idx === -1) return;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      const next = getEnabledIndex(idx + 1);
      if (next !== -1) activateTab(tabs[next], true);
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      const prev = getEnabledIndex(idx - 1);
      if (prev !== -1) activateTab(tabs[prev], true);
    } else if (key === "Home") {
      e.preventDefault();
      const first = getEnabledIndex(0);
      if (first !== -1) activateTab(tabs[first], true);
    } else if (key === "End") {
      e.preventDefault();
      const last = getEnabledIndex(tabs.length - 1);
      if (last !== -1) activateTab(tabs[last], true);
    } else if (key === "Enter" || key === " ") {
      e.preventDefault();
      activateTab(current, true);
    }
  });

  const ensureAriaRelationships = () => {
    tabs.forEach((t) => {
      const controls = t.getAttribute("aria-controls");
      if (controls) {
        const panel = container.querySelector(`#${CSS.escape(controls)}`);
        if (panel) panel.setAttribute("aria-labelledby", t.id);
      }
    });
  };

  const initialTab = tabs.find((t) => t.getAttribute("aria-selected") === "true") || tabs[0];
  ensureAriaRelationships();
  activateTab(initialTab, false);
})();

/* Slick slider */
document.addEventListener("DOMContentLoaded", () => {
  const sliders = $(".image-slider");

  if (sliders.length === 0) return;

  sliders.slick({
    dots: true,
    infinite: true,
    slidesToShow: 1,
    prevArrow: `<button class="pull-left slick-prev"type=button><svg class=size-6 fill=none stroke=currentColor stroke-width=1.5 viewBox="0 0 24 24"xmlns=http://www.w3.org/2000/svg><path d="M15.75 19.5 8.25 12l7.5-7.5"stroke-linecap=round stroke-linejoin=round /></svg></button>`,
    nextArrow: `<button class="pull-right slick-next"type=button><svg class=size-6 fill=none stroke=currentColor stroke-width=1.5 viewBox="0 0 24 24"xmlns=http://www.w3.org/2000/svg><path d="m8.25 4.5 7.5 7.5-7.5 7.5"stroke-linecap=round stroke-linejoin=round /></svg></button>`,
    responsive: [
      {
        breakpoint: 1023.98,
        settings: {
          dots: false,
        },
      },
    ],
  });
});

/* Initialize Masonry with imagesloaded */
document.addEventListener("DOMContentLoaded", () => {
  const allGrids = document.querySelectorAll(".masonry__grid");

  if (allGrids.length === 0) return;

  allGrids.forEach((grid) => {
    const msnry = new Masonry(grid, {
      itemSelector: ".masonry__item",
      columnWidth: ".masonry__sizer",
      percentPosition: true,
    });

    imagesLoaded(grid).on("progress", () => {
      msnry.layout();
    });
  });
});
