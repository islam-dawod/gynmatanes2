/* =========================================================
   EMX — video lightbox (stays on-site, lazy, keyboard-accessible)
   Works for homepage library cards and inline topic-page cards.
   ========================================================= */
(function () {
  "use strict";

  function buildLightbox() {
    var lb = document.createElement("div");
    lb.className = "emx-lb";
    lb.innerHTML =
      '<div class="emx-lb-box" role="dialog" aria-modal="true">' +
      '  <button class="emx-lb-close" aria-label="סגירה">&times;</button>' +
      '  <video controls playsinline preload="none"></video>' +
      '  <div class="emx-lb-info">' +
      '    <h3></h3><p></p>' +
      '    <a class="emx-lb-more" href="#">מידע נוסף בנושא &larr;</a>' +
      '  </div>' +
      '</div>';
    document.body.appendChild(lb);
    return lb;
  }

  var lb = null, video = null, elTitle = null, elDesc = null, elMore = null;

  function ensure() {
    if (lb) return;
    lb = buildLightbox();
    video = lb.querySelector("video");
    elTitle = lb.querySelector(".emx-lb-info h3");
    elDesc = lb.querySelector(".emx-lb-info p");
    elMore = lb.querySelector(".emx-lb-more");
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("emx-lb-close")) close();
    });
  }

  function open(card) {
    ensure();
    var src = card.getAttribute("data-video");
    var title = card.getAttribute("data-title") || "";
    var desc = card.getAttribute("data-desc") || "";
    var more = card.getAttribute("data-more") || "";
    video.src = src;                 // lazy: source assigned only on open
    elTitle.textContent = title;
    elDesc.textContent = desc;
    if (more) { elMore.href = more; elMore.style.display = ""; }
    else { elMore.style.display = "none"; }
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }

  function close() {
    if (!lb) return;
    lb.classList.remove("open");
    document.body.style.overflow = "";
    try { video.pause(); video.removeAttribute("src"); video.load(); } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var card = e.target.closest ? e.target.closest(".emx-card") : null;
    if (card && card.getAttribute("data-video")) { e.preventDefault(); open(card); }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });

  // keyboard: allow Enter/Space to open a focused card
  document.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ")) {
      var a = document.activeElement;
      if (a && a.classList && a.classList.contains("emx-card") && a.getAttribute("data-video")) {
        e.preventDefault(); open(a);
      }
    }
  });
})();
