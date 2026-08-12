/* =========================================================
   EMX — video lightbox (on-site, lazy, keyboard-accessible)
   Adds an on-site logo watermark over the player.
   ========================================================= */
(function () {
  "use strict";

  var lb, video, wmark, elTitle, elDesc, elMore;

  function build() {
    lb = document.createElement("div");
    lb.className = "emx-lb";
    lb.innerHTML =
      '<div class="emx-lb-box" role="dialog" aria-modal="true">' +
      '  <button class="emx-lb-close" aria-label="סגירה">&times;</button>' +
      '  <div class="emx-lb-media">' +
      '    <video controls playsinline preload="none"></video>' +
      '    <img class="emx-lb-logo" alt="" />' +
      '  </div>' +
      '  <div class="emx-lb-info"><h3></h3><p></p>' +
      '    <a class="emx-lb-more" href="#">מידע נוסף בנושא &larr;</a></div>' +
      '</div>';
    document.body.appendChild(lb);
    video = lb.querySelector("video");
    wmark = lb.querySelector(".emx-lb-logo");
    elTitle = lb.querySelector(".emx-lb-info h3");
    elDesc = lb.querySelector(".emx-lb-info p");
    elMore = lb.querySelector(".emx-lb-more");
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("emx-lb-close")) close();
    });
  }

  function open(card) {
    if (!lb) build();
    video.src = card.getAttribute("data-video");
    elTitle.textContent = card.getAttribute("data-title") || "";
    elDesc.textContent = card.getAttribute("data-desc") || "";
    var more = card.getAttribute("data-more");
    if (more) { elMore.href = more; elMore.style.display = ""; } else { elMore.style.display = "none"; }
    // watermark: reuse the card's own (already path-resolved) logo
    var cl = card.querySelector(".emx-logo");
    if (cl) { wmark.src = cl.getAttribute("src"); wmark.style.display = ""; } else { wmark.style.display = "none"; }
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    var p = video.play(); if (p && p.catch) p.catch(function () {});
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
    if (e.key === "Escape") { close(); return; }
    if (e.key === "Enter" || e.key === " ") {
      var a = document.activeElement;
      if (a && a.classList && a.classList.contains("emx-card") && a.getAttribute("data-video")) { e.preventDefault(); open(a); }
    }
  });
})();
