// ====== EDIT THESE ======
const WHATSAPP_NUMBER = "254700000000"; // country code + number, no "+" or spaces
// ========================
 
const waUrl = (text) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
 
// All elements with data-wa open WhatsApp with a prefilled message
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = waUrl(el.dataset.wa);
  el.target = "_blank";
  el.rel = "noopener";
});
 
// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});
 
// Contact form -> WhatsApp (only on pages that have it)
const form = document.getElementById("contact-form");
if (form) {
  const note = document.getElementById("form-note");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    [form.name, form.phone].forEach((f) => f.classList.toggle("invalid", !f.value.trim()));
    if (!name || !phone) {
      note.textContent = "Please enter your name and phone number so we can reply.";
      return;
    }
    note.textContent = "";
    const msg =
      `Hello Peak Properties, my name is ${name}.\n` +
      `I want to: ${form.intent.value}.\n` +
      `Phone: ${phone}\n` +
      (form.message.value.trim() ? `Message: ${form.message.value.trim()}` : "");
    window.open(waUrl(msg), "_blank", "noopener");
    form.reset();
  });
}
 
// Property filters (properties page). Also supports links like properties.html?type=land
const chips = document.querySelectorAll(".chip");
if (chips.length) {
  const cards = document.querySelectorAll(".card[data-type]");
  const empty = document.getElementById("empty");
  const applyFilter = (type) => {
    let shown = 0;
    chips.forEach((c) => c.classList.toggle("active", c.dataset.filter === type));
    cards.forEach((card) => {
      // a card can belong to several categories, e.g. data-type="sale land"
      const show = type === "all" || card.dataset.type.split(" ").includes(type);
      card.hidden = !show;
      if (show) shown++;
    });
    empty.hidden = shown > 0;
  };
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      applyFilter(chip.dataset.filter);
      history.replaceState(null, "", chip.dataset.filter === "all" ? location.pathname : `?type=${chip.dataset.filter}`);
    })
  );
  const wanted = new URLSearchParams(location.search).get("type");
  if (wanted && [...chips].some((c) => c.dataset.filter === wanted)) applyFilter(wanted);
}
 
document.getElementById("year").textContent = new Date().getFullYear();
 
// Smooth page transitions: fade the page out, then follow the link
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || reduceMotion) return;
  const url = new URL(a.href, location.href);
  const sameSite = url.origin === location.origin && /\.html?$|\/$/.test(url.pathname);
  const samePage = url.pathname === location.pathname;
  if (!sameSite || samePage || a.target === "_blank" || a.hasAttribute("download") ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  document.body.classList.add("leaving");
  setTimeout(() => (location.href = url.href), 280);
});
// Restore the page if the visitor comes back with the browser's back button
window.addEventListener("pageshow", () => document.body.classList.remove("leaving"));