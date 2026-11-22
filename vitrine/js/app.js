(function () {
  "use strict";

  var D = window.MPIA_DATA;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STORAGE_KEY = "mpia-ca-me-parle";

  /* ---------- Icônes ---------- */
  var ICONS = {
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 1.8 1.8.7-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7z"/>',
    plug: '<path d="M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    pause: '<rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    lightbulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    hand: '<path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V11M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L3.6 15a1.5 1.5 0 0 1 2.5-1.7L7 14.5"/>',
    sprout: '<path d="M12 21v-9M12 12c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2.5-5-7-5 0 3 2.5 5 7 5z"/>',
    handshake: '<path d="M4 8h16v11H4zM9 8V5h6v3M4 13h16"/>',
    megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1zM17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    chart: '<path d="M3 20h18M7 16v-4M12 16V8M17 16v-7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    mic: '<path d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };

  function icon(name, cls) {
    return '<svg class="ico ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function avatar(p, extra) {
    return '<span class="avatar ' + (extra || "") + '" style="--c:' + p.color + '">' + esc(p.initials) + "</span>";
  }

  // Icônes déclaratives dans le HTML statique
  $all("[data-icon]").forEach(function (el) { el.innerHTML = icon(el.getAttribute("data-icon")); });

  /* ---------- État ---------- */
  var state = { cat: "all", persona: "all" };
  var liked = loadLiked();

  function loadLiked() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }
  function saveLiked() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(liked)); } catch (e) { /* stockage indisponible */ }
  }
  function isLiked(id) { return liked.indexOf(id) !== -1; }
  function toggleLike(id) {
    if (isLiked(id)) liked.splice(liked.indexOf(id), 1); else liked.push(id);
    saveLiked();
    var on = isLiked(id);
    $all('[data-like="' + id + '"]').forEach(function (b) {
      b.classList.toggle("is-liked", on);
      b.setAttribute("aria-pressed", on);
    });
    renderPicked();
  }

  function filtered() {
    return D.useCases.filter(function (u) {
      return (state.cat === "all" || u.cat === state.cat) && (state.persona === "all" || u.persona === state.persona);
    });
  }

  /* ---------- Hero : téléphone animé ---------- */
  var heroScenes = [
    {
      persona: "julien", sub: "Martin Peinture · Nantes",
      items: [
        { icon: "mail", kicker: "À valider", text: "4 devis attendent une réponse depuis 10 jours. J’ai préparé les relances.", actions: ["Voir", "Tout valider"] },
        { icon: "calendar", kicker: "Prévu", text: "Visite chez M. Leroy jeudi 18 h. Ses photos sont dans son dossier." },
        { icon: "check", kicker: "Fait", text: "Mme Durand a accepté son devis 🎉" }
      ]
    },
    {
      persona: "sophie", sub: "Le Petit Comptoir · Lyon",
      items: [
        { icon: "star", kicker: "À valider", text: "3 nouveaux avis ce week-end. Les réponses sont prêtes.", actions: ["Voir", "Publier"] },
        { icon: "camera", kicker: "Prévu", text: "Publication du plat du jour à 11 h 30." },
        { icon: "check", kicker: "Fait", text: "7 factures rangées pour votre comptable." }
      ]
    },
    {
      persona: "claire", sub: "Claire Lefèvre Conseil · Bordeaux",
      items: [
        { icon: "mic", kicker: "À valider", text: "Le compte rendu Nova Industrie est prêt à envoyer.", actions: ["Relire", "Envoyer"] },
        { icon: "chart", kicker: "À noter", text: "1 facture en retard de 18 jours. Une relance est prête." },
        { icon: "check", kicker: "Fait", text: "Post LinkedIn programmé lundi 8 h." }
      ]
    }
  ];
  var heroIndex = 0;
  var heroTimer = null;

  function renderHeroTabs() {
    $("#hero-personas").innerHTML = heroScenes.map(function (s, i) {
      var p = D.personas[s.persona];
      return '<button type="button" role="tab" class="hero-tab' + (i === heroIndex ? " is-active" : "") + '" aria-selected="' + (i === heroIndex) + '" data-i="' + i + '">' +
        avatar(p, "xs") + "<span>" + esc(p.name) + " <small>" + esc(p.role) + "</small></span></button>";
    }).join("");
  }

  function renderHeroScene() {
    var s = heroScenes[heroIndex];
    var p = D.personas[s.persona];
    $("#hero-sub").textContent = s.sub;
    var html = '<p class="feed-greet">Bonjour ' + esc(p.name) + ' 👋<br><span>Voici ce que j’ai préparé pour vous.</span></p>';
    html += s.items.map(function (it, i) {
      return '<div class="feed-card k-' + it.kicker.replace(/[^a-z]/gi, "").toLowerCase() + '" style="--d:' + (i * 140 + 120) + 'ms">' +
        '<span class="feed-ico">' + icon(it.icon) + "</span>" +
        '<div><p class="feed-kicker">' + esc(it.kicker) + "</p><p>" + esc(it.text) + "</p>" +
        (it.actions ? '<div class="feed-actions"><span class="pill">' + esc(it.actions[0]) + '</span><span class="pill pill-primary">' + esc(it.actions[1]) + "</span></div>" : "") +
        "</div></div>";
    }).join("");
    var feed = $("#hero-feed");
    feed.innerHTML = html;
    renderHeroTabs();
  }

  function startHeroRotation() {
    if (reduceMotion) return;
    stopHeroRotation();
    heroTimer = setInterval(function () {
      heroIndex = (heroIndex + 1) % heroScenes.length;
      renderHeroScene();
    }, 6500);
  }
  function stopHeroRotation() { if (heroTimer) clearInterval(heroTimer); heroTimer = null; }

  $("#hero-personas").addEventListener("click", function (e) {
    var b = e.target.closest(".hero-tab");
    if (!b) return;
    heroIndex = +b.getAttribute("data-i");
    renderHeroScene();
    startHeroRotation();
  });

  /* ---------- Hero : « Je perds du temps sur… » ---------- */
  var painLabels = {
    commercial: "mes devis et relances",
    communication: "ma communication",
    administratif: "l’administratif",
    organisation: "mon organisation",
    gestion: "mes chiffres"
  };
  $("#hero-pains").innerHTML = Object.keys(painLabels).map(function (k) {
    return '<button type="button" class="chip" data-cat="' + k + '">' + icon(D.categories[k].icon) + esc(painLabels[k]) + "</button>";
  }).join("");
  $("#hero-pains").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b) return;
    state.cat = b.getAttribute("data-cat");
    state.persona = "all";
    renderFilters();
    renderGrid();
    $("#exemples").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Filtres (métier & domaine) ---------- */
  function renderFilters() {
    $("#persona-filters").innerHTML = '<span class="filter-label">Exemples :</span>' + Object.keys(D.personas).map(function (k) {
      var p = D.personas[k];
      var active = state.persona === k;
      return '<button type="button" class="chip chip-persona' + (active ? " is-active" : "") + '" aria-pressed="' + active + '" data-persona="' + k + '" style="--c:' + p.color + '">' +
        avatar(p, "xs") + esc(p.name) + ' <small>' + esc(p.role.toLowerCase()) + "</small></button>";
    }).join("");

    var base = D.useCases.filter(function (u) { return state.persona === "all" || u.persona === state.persona; });
    var chips = [{ k: "all", label: "Tout", n: base.length }].concat(Object.keys(D.categories).map(function (k) {
      return { k: k, label: D.categories[k].label, n: base.filter(function (u) { return u.cat === k; }).length, icon: D.categories[k].icon };
    }));
    $("#cat-filters").innerHTML = chips.map(function (c) {
      var active = state.cat === c.k;
      return '<button type="button" class="chip chip-filter cat-' + c.k + (active ? " is-active" : "") + '" aria-pressed="' + active + '" data-cat="' + c.k + '"' + (c.n === 0 ? " disabled" : "") + ">" +
        (c.icon ? icon(c.icon) : "") + esc(c.label) + ' <span class="chip-n">' + c.n + "</span></button>";
    }).join("");
  }

  $("#persona-filters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-persona]");
    if (!b) return;
    var k = b.getAttribute("data-persona");
    state.persona = state.persona === k ? "all" : k;
    if (state.cat !== "all" && !filtered().length) state.cat = "all";
    renderFilters();
    renderGrid();
  });

  $("#cat-filters").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]");
    if (!b || b.disabled) return;
    state.cat = b.getAttribute("data-cat");
    renderFilters();
    renderGrid();
  });

  /* ---------- Carrousel des cas d'usage ---------- */
  var track = $("#usecase-grid");

  // Aperçu concret du travail préparé : la première carte du scénario.
  function previewHtml(u) {
    var card = u.scenario.filter(function (s) { return s.t === "card"; })[0];
    var ev = u.scenario.filter(function (s) { return s.t === "event"; })[0];
    if (!card) return "";
    var cta = card.actions[card.actions.length - 1];
    var when = "";
    if (ev) {
      var t = /\d{1,2} h \d{2}/.exec(ev.text);
      when = /^(Lundi|Mardi|Mercredi|Jeudi|Vendredi|Samedi|Dimanche)/.test(ev.text) ? ev.text.split("·")[0].trim() : t ? t[0] : "";
    }
    return '<div class="uc-notif">' +
      '<div class="uc-notif-head"><span class="brand-mark xs" aria-hidden="true"></span><span>Votre partenaire</span>' +
      (when ? '<span class="uc-notif-time">' + esc(when) + "</span>" : "") + "</div>" +
      '<p class="uc-notif-title">' + esc(card.title) + "</p>" +
      (card.meta ? '<p class="uc-notif-meta">' + esc(card.meta) + "</p>" : "") +
      '<span class="pill pill-primary">' + esc(cta) + "</span></div>";
  }

  function renderGrid() {
    var list = filtered();
    var parts = [];
    if (state.persona !== "all") parts.push("avec " + D.personas[state.persona].name);
    if (state.cat !== "all") parts.push("en " + D.categories[state.cat].label.toLowerCase());
    $("#results-count").textContent = list.length + " situation" + (list.length > 1 ? "s" : "") + (parts.length ? " " + parts.join(", ") : "");

    track.innerHTML = list.map(function (u, i) {
      var p = D.personas[u.persona];
      var c = D.categories[u.cat];
      var l = isLiked(u.id);
      return '<article class="uc-card cat-' + u.cat + '" style="--i:' + i + '">' +
        '<button type="button" class="uc-open" data-open="' + u.id + '" aria-label="Voir le scénario : ' + esc(u.title) + '"></button>' +
        '<div class="uc-visual"><span class="uc-visual-icon" aria-hidden="true">' + icon(c.icon) + "</span>" + previewHtml(u) + "</div>" +
        '<div class="uc-content">' +
        '<div class="uc-card-top"><span class="tag">' + icon(c.icon) + esc(c.label) + "</span>" +
        '<button type="button" class="like' + (l ? " is-liked" : "") + '" data-like="' + u.id + '" aria-pressed="' + l + '" aria-label="Ça me parle : ' + esc(u.title) + '"><span aria-hidden="true">♥</span></button></div>' +
        "<h3>" + esc(u.title) + "</h3>" +
        '<p class="uc-card-hook">' + esc(u.hook) + "</p>" +
        '<p class="uc-card-benefit">' + icon("sprout") + esc(u.benefit) + "</p>" +
        '<div class="uc-card-foot"><span class="uc-card-persona">' + avatar(p, "xs") + esc(p.name) + ", " + esc(p.role.toLowerCase()) + "</span>" +
        '<span class="uc-card-cta">Voir ' + icon("arrow") + "</span></div>" +
        "</div></article>";
    }).join("");
    track.scrollLeft = 0;
    updateCarousel();
  }

  function updateCarousel() {
    var max = track.scrollWidth - track.clientWidth;
    var ratio = max > 0 ? track.scrollLeft / max : 1;
    var visible = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
    var bar = $("#uc-progress");
    bar.style.width = Math.max(visible, 0.08) * 100 + "%";
    bar.style.marginLeft = ratio * (1 - Math.min(visible, 1)) * 100 + "%";
    $("#uc-prev").disabled = track.scrollLeft <= 4;
    $("#uc-next-page").disabled = track.scrollLeft >= max - 4;
    $("#uc-carousel").classList.toggle("at-end", track.scrollLeft >= max - 4);
    $("#uc-carousel").classList.toggle("at-start", track.scrollLeft <= 4);
  }

  function pageCarousel(dir) {
    var card = $(".uc-card", track);
    var step = card ? card.getBoundingClientRect().width + 20 : 320;
    var n = Math.max(1, Math.floor(track.clientWidth / step));
    track.scrollBy({ left: dir * step * n, behavior: reduceMotion ? "auto" : "smooth" });
  }

  track.addEventListener("scroll", updateCarousel, { passive: true });
  window.addEventListener("resize", updateCarousel);
  $("#uc-prev").addEventListener("click", function () { pageCarousel(-1); });
  $("#uc-next-page").addEventListener("click", function () { pageCarousel(1); });
  track.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); pageCarousel(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pageCarousel(-1); }
  });

  track.addEventListener("click", function (e) {
    var like = e.target.closest("[data-like]");
    if (like) { toggleLike(like.getAttribute("data-like")); return; }
    var open = e.target.closest("[data-open]");
    if (open) openUseCase(open.getAttribute("data-open"), open);
  });

  /* ---------- Fenêtres modales ---------- */
  var lastFocus = null;
  var openModalEl = null;

  function openModal(el, trigger) {
    lastFocus = trigger || document.activeElement;
    el.hidden = false;
    document.documentElement.classList.add("no-scroll");
    openModalEl = el;
    requestAnimationFrame(function () {
      el.classList.add("is-open");
      $(".modal-panel", el).focus();
    });
    stopHeroRotation();
  }

  function closeModal() {
    if (!openModalEl) return;
    var el = openModalEl;
    el.classList.remove("is-open");
    document.documentElement.classList.remove("no-scroll");
    openModalEl = null;
    stopPlayer();
    if (el.id === "bs-modal") bsOnClose();
    setTimeout(function () { el.hidden = true; }, reduceMotion ? 0 : 220);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    if (/^#(cas-|brainstorm$)/.test(location.hash) && history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    startHeroRotation();
  }

  $all(".modal").forEach(function (m) {
    m.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });
  });

  document.addEventListener("keydown", function (e) {
    if (!openModalEl) return;
    if (e.key === "Escape") { closeModal(); return; }
    if (e.key === "Tab") {
      var f = $all('button:not([disabled]), [href], input, textarea, [tabindex]:not([tabindex="-1"])', openModalEl).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Détail d'un cas d'usage ---------- */
  var currentUc = null;
  var mq = window.matchMedia("(max-width: 899px)");

  function placePlayer() {
    var player = $("#uc-player");
    var target = mq.matches ? $("#uc-mobile-slot") : $("#uc-desktop-slot");
    if (player.parentNode !== target) target.appendChild(player);
  }
  if (mq.addEventListener) mq.addEventListener("change", placePlayer); else mq.addListener(placePlayer);

  function openUseCase(id, trigger) {
    var u = D.useCases.filter(function (x) { return x.id === id; })[0];
    if (!u) return;
    currentUc = u;
    var p = D.personas[u.persona];
    var c = D.categories[u.cat];
    var modal = $("#uc-modal");
    modal.className = "modal cat-" + u.cat + (modal.classList.contains("is-open") ? " is-open" : "");

    $("#uc-tag").innerHTML = icon(c.icon) + esc(c.label);
    $("#uc-title").textContent = u.title;
    $("#uc-hook").textContent = u.hook;
    $("#uc-persona").innerHTML = avatar(p) + "<div><strong>" + esc(p.name) + ", " + esc(p.role.toLowerCase()) + "</strong><span>" + esc(p.company) + " · " + esc(p.place) + " · " + esc(p.team) + "</span></div>";
    $("#uc-how").innerHTML = u.how.map(function (h) { return "<li>" + esc(h) + "</li>"; }).join("");
    $("#uc-control").innerHTML = u.control.map(function (h) { return "<li>" + icon("check") + esc(h) + "</li>"; }).join("");
    $("#uc-benefit").textContent = u.benefit;
    $("#uc-needs").innerHTML = u.needs.map(function (h) { return "<li>" + icon("plug") + esc(h) + "</li>"; }).join("");
    $("#player-sub").textContent = p.company + " · " + p.place;
    updateLikeButton();
    placePlayer();

    if (!openModalEl) openModal(modal, trigger);
    $(".modal-body", modal).scrollTop = 0;
    playScenario(u);
  }

  function updateLikeButton() {
    var b = $("#uc-like");
    var l = isLiked(currentUc.id);
    b.classList.toggle("is-liked", l);
    b.setAttribute("aria-pressed", l);
    $(".like-label", b).textContent = l ? "Ça me parle ✓" : "Ça me parle";
  }

  $("#uc-like").addEventListener("click", function () {
    toggleLike(currentUc.id);
    updateLikeButton();
  });

  $("#uc-next").addEventListener("click", function () {
    var list = filtered();
    if (list.indexOf(currentUc) === -1) list = D.useCases;
    var i = list.indexOf(currentUc);
    openUseCase(list[(i + 1) % list.length].id);
  });

  /* ---------- Lecteur de scénario (réutilisable) ---------- */
  function stepHtml(step, p) {
    switch (step.t) {
      case "event":
        return '<div class="msg msg-event">' + icon(step.icon || "clock") + esc(step.text) + "</div>";
      case "partner":
        return '<div class="msg msg-partner"><span class="brand-mark xs" aria-hidden="true"></span><p>' + esc(step.text) + "</p></div>";
      case "user":
        return '<div class="msg msg-user" style="--c:' + p.color + '"><p>' + esc(step.text) + "</p>" + avatar(p, "xs") + "</div>";
      case "card":
        return '<div class="msg msg-card">' +
          '<p class="mc-title">' + esc(step.title) + "</p>" +
          (step.meta ? '<p class="mc-meta">' + esc(step.meta) + "</p>" : "") +
          (step.applied ? '<p class="mc-applied">' + icon("sprout") + esc(step.applied) + "</p>" : "") +
          '<p class="mc-body">' + esc(step.body) + "</p>" +
          '<div class="mc-actions">' + step.actions.map(function (a, i) {
            return '<span class="pill' + (i === step.actions.length - 1 ? " pill-primary" : "") + '">' + esc(a) + "</span>";
          }).join("") + "</div>" +
          (step.validated ? '<span class="stamp" aria-hidden="true">' + icon("check") + esc(step.validated) + "</span>" : "") +
          "</div>";
      case "scan":
        return '<div class="msg msg-scan"><p class="scan-title">' + icon("search") + esc(step.title) + "</p><ul>" +
          step.items.map(function (it, i) { return '<li style="--i:' + i + '">' + icon("check") + "<span>" + esc(it) + "</span></li>"; }).join("") +
          "</ul></div>";
      case "edit":
        return '<div class="msg msg-edit" style="--c:' + p.color + '"><p class="edit-label">' + icon("hand") + "Votre correction</p>" +
          '<p class="edit-before">' + esc(step.before) + '</p><p class="edit-after">' + esc(step.after) + "</p></div>";
      case "rule":
        return '<div class="msg msg-rule">' + icon("sprout") + '<div><p class="rule-kicker">Je retiens</p><p>' + esc(step.text) + "</p></div></div>";
      case "done":
        return '<div class="msg msg-done">' + icon("check") + "<p>" + esc(step.text) + "</p></div>";
    }
    return "";
  }

  function stepWait(step) {
    switch (step.t) {
      case "event": return 500;
      case "user": return 1100;
      case "card": return 1300;
      case "scan": return 900 + step.items.length * 450;
      case "done": return 1200;
      case "rule": return 1100;
      default: return 1000;
    }
  }

  function markValidated(feed) {
    $all(".msg-card .stamp", feed).forEach(function (s) { s.parentNode.classList.add("is-validated"); });
  }

  // onMem(step) est appelé quand une étape enrichit la fiche entreprise.
  function createPlayer(feed, onMem) {
    var token = 0;
    var timers = [];

    function stop() {
      token++;
      timers.forEach(clearTimeout);
      timers = [];
    }

    function scrollFeed() {
      feed.scrollTo({ top: feed.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
    }

    function addMemo(step) {
      if (onMem) onMem(step);
      var keys = [];
      step.mem.forEach(function (m) {
        var k = m.op === "rule" ? "une nouvelle règle" : m.key;
        if (keys.indexOf(k) === -1) keys.push(k);
      });
      var memo = document.createElement("div");
      memo.className = "msg msg-memo";
      memo.innerHTML = icon("plus") + "Noté dans votre fiche : " + esc(keys.join(", "));
      feed.appendChild(memo);
    }

    function show(step, p, animated) {
      var wrap = document.createElement("div");
      wrap.innerHTML = stepHtml(step, p);
      feed.appendChild(wrap.firstChild);
      if (!step.mem) return;
      // Pour un scan animé, la fiche se met à jour une fois toutes les lignes affichées.
      if (animated && step.t === "scan") {
        var my = token;
        timers.push(setTimeout(function () {
          if (my !== token) return;
          addMemo(step);
          scrollFeed();
        }, step.items.length * 450 + 300));
      } else {
        addMemo(step);
      }
    }

    function play(steps, p, instant, onReset) {
      stop();
      var my = token;
      feed.innerHTML = "";
      if (onReset) onReset();

      if (instant || reduceMotion) {
        steps.forEach(function (s) { show(s, p); });
        markValidated(feed);
        feed.scrollTop = 0;
        return;
      }

      var delay = 350;
      steps.forEach(function (step, i) {
        var showTyping = step.t === "partner" || step.t === "card" || step.t === "rule";
        var typingAt = delay;
        delay += stepWait(step);
        var at = delay;

        if (showTyping) {
          timers.push(setTimeout(function () {
            if (my !== token) return;
            var t = document.createElement("div");
            t.className = "msg msg-typing";
            t.innerHTML = '<span class="brand-mark xs" aria-hidden="true"></span><span class="dots"><i></i><i></i><i></i></span>';
            feed.appendChild(t);
            scrollFeed();
          }, typingAt + 150));
        }

        timers.push(setTimeout(function () {
          if (my !== token) return;
          $all(".msg-typing", feed).forEach(function (n) { n.remove(); });
          if (step.t === "user" || step.t === "done") markValidated(feed);
          show(step, p, true);
          scrollFeed();
          if (i === steps.length - 1) markValidated(feed);
        }, at));
      });
    }

    return { play: play, stop: stop };
  }

  var modalPlayer = createPlayer($("#player-feed"));
  function stopPlayer() { modalPlayer.stop(); }
  function playScenario(u, instant) { modalPlayer.play(u.scenario, D.personas[u.persona], instant); }

  $("#player-replay").addEventListener("click", function () { if (currentUc) playScenario(currentUc); });
  $("#player-skip").addEventListener("click", function () { if (currentUc) playScenario(currentUc, true); });

  /* ---------- Il apprend : découverte & corrections ---------- */
  var learnKey = "discovery";
  var learnStarted = false;
  var fiche = { rows: [], rules: [] };

  function resetFiche() {
    var init = D.learning[learnKey].initial;
    fiche = {
      rows: init.rows.map(function (r) { return { key: r.key, value: r.value, src: r.src, fresh: false }; }),
      rules: init.rules.map(function (t) { return { text: t, fresh: false }; })
    };
    renderFiche();
  }

  function applyMem(step) {
    fiche.rows.forEach(function (r) { r.fresh = false; });
    fiche.rules.forEach(function (r) { r.fresh = false; });
    step.mem.forEach(function (m) {
      if (m.op === "rule") { fiche.rules.push({ text: m.text, fresh: true }); return; }
      var row = fiche.rows.filter(function (r) { return r.key === m.key; })[0];
      if (row) { row.value = m.value; row.src = m.src; row.fresh = true; }
      else fiche.rows.push({ key: m.key, value: m.value, src: m.src, fresh: true });
    });
    renderFiche();
  }

  function renderFiche() {
    var sc = D.learning[learnKey];
    var p = D.personas[sc.persona];
    var n = fiche.rows.length;
    var ok = fiche.rows.filter(function (r) { return r.src === "ok"; }).length;
    var sub = n
      ? n + " information" + (n > 1 ? "s" : "") + " · " + ok + " confirmée" + (ok > 1 ? "s" : "") + " par vous"
      : "Je ne sais encore rien de vous";

    var html = '<div class="memory-head">' + avatar(p) +
      '<div><p class="memory-title">Ce que je sais de ' + esc(sc.company) + '</p><p class="memory-sub">' + esc(sub) + "</p></div></div>";

    if (n) html += '<div class="memory-meter" aria-hidden="true"><span style="width:' + Math.round((ok / n) * 100) + '%"></span></div>';

    if (fiche.rules.length) {
      html += '<div class="memory-rules"><p class="mk">Vos règles de travail</p><ul>' + fiche.rules.map(function (r) {
        return '<li class="' + (r.fresh ? "is-new" : "") + '">' + icon("sprout") + "<span>" + esc(r.text) + "</span></li>";
      }).join("") + "</ul></div>";
    }

    if (n) {
      html += '<ul class="memory-list">' + fiche.rows.map(function (r) {
        var s = D.sources[r.src];
        return '<li class="' + (r.fresh ? "is-new" : "") + '"><span class="mk">' + esc(r.key) + '</span><span class="mv">' + esc(r.value) +
          '</span><span class="src ' + s.cls + '">' + esc(s.label) + "</span></li>";
      }).join("") + "</ul>";
    } else {
      html += '<div class="memory-empty">' + icon("search") + "<p>Donnez-lui simplement le nom de votre entreprise : il commence par ce qui est public.</p></div>";
    }

    $("#fiche").innerHTML = html;
  }

  var learnPlayer = createPlayer($("#learn-feed"), applyMem);

  function playLearn(instant) {
    var sc = D.learning[learnKey];
    learnStarted = true;
    learnPlayer.play(sc.steps, D.personas[sc.persona], instant, resetFiche);
  }

  function setLearnTab(key) {
    learnKey = key;
    $all(".learn-tab").forEach(function (t) {
      var on = t.getAttribute("data-learn") === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
    });
  }

  $(".learn-tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-learn]");
    if (!b) return;
    setLearnTab(b.getAttribute("data-learn"));
    playLearn();
  });
  $("#learn-replay").addEventListener("click", function () { playLearn(); });
  $("#learn-skip").addEventListener("click", function () { playLearn(true); });

  $all("[data-learn-link]").forEach(function (a) {
    a.addEventListener("click", function () {
      setLearnTab(a.getAttribute("data-learn-link"));
      playLearn();
    });
  });

  // Le scénario démarre quand la section devient visible.
  resetFiche();
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !learnStarted) { playLearn(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe($("#learn-player"));
  } else {
    playLearn(true);
  }

  /* ---------- Autonomie ---------- */
  var activities = D.autonomyActivities.map(function (a) { return { label: a.label, level: a.level, locked: !!a.locked }; });

  function renderAutonomy() {
    $("#autonomy-list").innerHTML = activities.map(function (a, i) {
      var lvl = D.autonomyLevels.filter(function (l) { return l.id === a.level; })[0];
      return '<li class="auto-row' + (a.locked ? " is-locked" : "") + '">' +
        '<div class="auto-label">' + (a.locked ? icon("lock") : "") + esc(a.label) + "</div>" +
        '<div class="segmented" role="radiogroup" aria-label="' + esc(a.label) + '">' +
        D.autonomyLevels.map(function (l) {
          var on = l.id === a.level;
          return '<button type="button" role="radio" aria-checked="' + on + '" class="seg seg-' + l.id + (on ? " is-on" : "") + '" data-row="' + i + '" data-level="' + l.id + '"' + (a.locked ? " disabled" : "") + ">" + esc(l.label) + "</button>";
        }).join("") +
        "</div>" +
        '<p class="auto-desc">' + (a.locked ? "Toujours votre décision. Il prépare, vous seul engagez l’entreprise." : esc(lvl.desc)) + "</p>" +
        "</li>";
    }).join("");
  }

  $("#autonomy-list").addEventListener("click", function (e) {
    var b = e.target.closest("[data-level]");
    if (!b || b.disabled) return;
    activities[+b.getAttribute("data-row")].level = b.getAttribute("data-level");
    renderAutonomy();
  });

  $("#earned-actions").addEventListener("click", function (e) {
    var b = e.target.closest("[data-earned]");
    if (!b) return;
    if (b.getAttribute("data-earned") === "yes") {
      activities[0].level = "autonome";
      renderAutonomy();
      this.innerHTML = '<p class="earned-reply">' + icon("check") + "C’est noté. Je m’occupe des relances et je vous fais un résumé chaque soir.</p>";
    } else {
      this.innerHTML = '<p class="earned-reply">' + icon("check") + "Très bien, je continue à vous les soumettre avant envoi.</p>";
    }
  });

  /* ---------- Démarrer ---------- */
  function pickedHtml(intro) {
    if (!liked.length) return "";
    var items = liked.map(function (id) {
      var u = D.useCases.filter(function (x) { return x.id === id; })[0];
      return u ? '<li><span aria-hidden="true">♥</span>' + esc(u.title) + "</li>" : "";
    }).join("");
    return '<div class="picked-box"><p>' + esc(intro) + "</p><ul>" + items + "</ul></div>";
  }

  function renderPicked() {
    var html = pickedHtml(liked.length > 1 ? "Les situations qui vous parlent :" : "La situation qui vous parle :");
    $("#picked").innerHTML = html || '<p class="picked-empty">Astuce : touchez ♥ sur les situations qui vous parlent, votre partenaire partira de là.</p>';
  }

  $all("[data-start]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openBrainstorm(b); });
  });

  /* ---------- Lot 2 : brainstorming scénarisé ---------- */
  var B = window.MPIA_BRAINSTORM;
  var bsPersona = D.personas[B.persona];
  var bsFeed = $("#bs-feed");
  var bsChoicesEl = $("#bs-choices");
  var bsPanel = $("#bs-modal .bs-panel");
  var bsMobile = window.matchMedia("(max-width: 899px)");
  var bs = { started: false, playing: false, interrupted: false, token: 0, timers: [], v: null, last: {}, choices: [], phase: 0, view: "chat", unseen: 0 };

  function bsCtx() {
    return {
      v: bs.v,
      liked: liked.map(function (id) {
        var u = D.useCases.filter(function (x) { return x.id === id; })[0];
        return u ? u.title : null;
      }).filter(Boolean)
    };
  }
  function bsRes(x) { return typeof x === "function" ? x(bsCtx()) : x; }

  function bsStop() {
    bs.token++;
    bs.timers.forEach(clearTimeout);
    bs.timers = [];
    bs.playing = false;
  }
  function bsLater(fn, ms) {
    var my = bs.token;
    bs.timers.push(setTimeout(function () { if (my === bs.token) fn(); }, reduceMotion ? 0 : ms));
  }
  function bsScroll() { bsFeed.scrollTo({ top: bsFeed.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" }); }

  function gauge(label, n, risk) {
    var dots = "";
    for (var i = 1; i <= 3; i++) dots += '<i class="' + (i <= n ? "on" : "") + '"></i>';
    return '<span class="gauge' + (risk ? " risk" : "") + '"><span>' + label + '</span><span class="g-dots" aria-label="' + n + ' sur 3">' + dots + "</span></span>";
  }

  var PISTE_BADGE = { reco: "Recommandé", ok: "Possible", later: "Pas tout de suite", no: "Pas pour moi" };

  function bsStepHtml(step) {
    switch (step.t) {
      case "note":
        return '<div class="msg msg-note">' + icon("lightbulb") + "<p>" + esc(step.text) + "</p></div>";
      case "pistes":
        return '<div class="msg msg-pistes">' + step.items.map(function (p) {
          return '<div class="piste piste-' + p.status + '"><div class="piste-top"><p class="piste-title">' + (p.status === "reco" ? "⭐ " : "") + esc(p.title) + "</p>" +
            '<span class="piste-badge">' + PISTE_BADGE[p.status] + "</span></div>" +
            '<p class="piste-why">' + esc(p.why) + "</p>" +
            (p.gain ? '<div class="gauges">' + gauge("Gain", p.gain) + gauge("Facilité", p.ease) + gauge("Risque", p.risk, true) + "</div>" : "") +
            "</div>";
        }).join("") + "</div>";
      case "photo":
        return '<div class="msg msg-photo" aria-label="Photo d’un devis"><p class="doc-head">DEVIS N° 2026-104</p><p>Martin Peinture · Nantes</p>' +
          "<p>Client : Mme Durand</p><p>Salon + couloir · 2 couches</p><p class=\"doc-total\">Total : 2 480,00 € TTC</p></div>";
      case "ficheLink":
        return '<button type="button" class="msg msg-fichelink btn btn-soft btn-sm" data-bs-view="fiche">' + icon("folder") + "Voir ma fiche</button>";
      case "next":
        return '<div class="msg msg-next"><p class="next-kicker">Prochaine étape</p><p class="next-title">' + esc(step.title) + "</p><p>" + esc(step.text) + "</p></div>";
      case "feedback":
        return '<div class="msg msg-feedback"><p class="fb-title">Une dernière question, pour nous</p><p>Ce que vous venez de voir, ça vous parle ?</p>' +
          '<div class="fb-choices"><button type="button" class="chip" data-fb>Oui 👍</button><button type="button" class="chip" data-fb>Un peu</button><button type="button" class="chip" data-fb>Pas vraiment</button></div>' +
          '<label class="fb-label" for="fb-text">Qu’est-ce qui manque, ou vous gêne ?</label><textarea id="fb-text" rows="2" placeholder="En quelques mots…"></textarea>' +
          '<button type="button" class="btn btn-primary btn-xs" data-fb-send>Envoyer</button><p class="form-note">Maquette : rien n’est envoyé.</p></div>';
    }
    return stepHtml(step, bsPersona);
  }

  function bsAppend(step) {
    var wrap = document.createElement("div");
    wrap.innerHTML = bsStepHtml(step);
    bsFeed.appendChild(wrap.firstChild);
    bsScroll();
  }

  function bsPlay(steps, done) {
    steps = (steps || []).filter(Boolean);
    bs.playing = true;
    (function next(i) {
      if (i >= steps.length) { bs.playing = false; done(); return; }
      var step = steps[i];
      var typing = step.t === "partner" || step.t === "card" || step.t === "pistes" || step.t === "next";
      if (typing) {
        var t = document.createElement("div");
        t.className = "msg msg-typing";
        t.innerHTML = '<span class="brand-mark xs" aria-hidden="true"></span><span class="dots"><i></i><i></i><i></i></span>';
        bsLater(function () { bsFeed.appendChild(t); bsScroll(); }, 150);
        bsLater(function () { t.remove(); bsAppend(step); bsLater(function () { next(i + 1); }, 350); }, step.t === "pistes" ? 1300 : 750);
      } else {
        var after = step.t === "scan" ? step.items.length * 450 + 500 : 350;
        bsLater(function () { bsAppend(step); bsLater(function () { next(i + 1); }, after); }, 250);
      }
    })(0);
  }

  function bsSetPhase(n) {
    bs.phase = n;
    $("#bs-phases").innerHTML = B.phases.map(function (label, i) {
      var cls = i < n ? "is-done" : i === n ? "is-current" : "";
      return '<li class="bs-phase ' + cls + '"' + (i === n ? ' aria-current="step"' : "") + "><i>" + (i < n ? "✓" : i + 1) + "</i><span>" + esc(label) + "</span></li>";
    }).join("");
  }

  function bsApplySet(set) {
    if (!set) return;
    if (typeof set === "function") set(bs.v);
    else Object.keys(set).forEach(function (k) { bs.v[k] = set[k]; });
  }

  function bsSetView(view) {
    bs.view = view;
    bsPanel.setAttribute("data-view", view);
    $all(".bs-tab", bsPanel).forEach(function (t) {
      var on = t.getAttribute("data-bs-view") === view;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on);
    });
    if (view === "fiche") { bs.unseen = 0; bsBadge(); }
    else bsScroll();
  }

  function bsBadge() {
    var b = $("#bs-badge");
    b.hidden = !bs.unseen;
    b.textContent = bs.unseen;
  }

  // Recalcule la fiche, signale dans l'échange les rubriques qui viennent d'être remplies.
  function bsUpdateFiche(silent) {
    var fresh = [];
    var fields = B.fiche.map(function (f) {
      var val = f.value(bs.v);
      var sig = JSON.stringify(val);
      var isFresh = val !== null && bs.last[f.key] !== sig;
      bs.last[f.key] = sig;
      if (isFresh) fresh.push(f.label);
      return { f: f, val: val, fresh: isFresh && !silent };
    });
    bsRenderFiche(fields);
    if (silent || !fresh.length) return;
    var memo = document.createElement("div");
    memo.className = "msg msg-memo";
    memo.innerHTML = icon("plus") + "Noté dans votre fiche : " + esc(fresh.join(", "));
    bsFeed.appendChild(memo);
    bsScroll();
    if (bsMobile.matches && bs.view === "chat") { bs.unseen += fresh.length; bsBadge(); }
  }

  function bsValueHtml(val) {
    if (Array.isArray(val)) return "<ul>" + val.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    return "<p>" + esc(val) + "</p>";
  }

  function bsRenderFiche(fields) {
    var core = fields.filter(function (x) { return x.f.core; });
    var filled = core.filter(function (x) { return x.val !== null; }).length;
    var titleField = fields.filter(function (x) { return x.f.title; })[0];
    var title = titleField && titleField.val ? "« " + titleField.val + " »" : "Votre premier sujet";

    var html = '<div class="bsf-card"><div class="bsf-head">' +
      '<p class="bsf-kicker">Fiche de cas d’usage</p>' +
      '<h3 class="bsf-title' + (titleField && titleField.fresh ? " is-new" : "") + '">' + esc(title) + "</h3>" +
      '<div class="bsf-progress" aria-hidden="true"><span style="width:' + Math.round((filled / core.length) * 100) + '%"></span></div>' +
      '<p class="bsf-count">' + filled + " / " + core.length + " rubriques · elle se remplit pendant l’échange</p></div>" +
      '<ul class="bsf-list">' + core.filter(function (x) { return !x.f.title; }).map(function (x) {
        var tag = x.val !== null && x.f.tag ? '<span class="bsf-tag">' + esc(x.f.tag(bs.v)) + "</span>" : "";
        return '<li class="' + (x.val === null ? "is-empty" : "") + (x.fresh ? " is-new" : "") + '">' +
          '<p class="bsf-label">' + esc(x.f.label) + tag + "</p>" +
          (x.val === null ? '<p class="bsf-empty">À définir ensemble</p>' : bsValueHtml(x.val)) + "</li>";
      }).join("") + "</ul></div>";

    fields.filter(function (x) { return x.f.aside && x.val !== null; }).forEach(function (x) {
      html += '<div class="bsf-aside bsf-' + x.f.aside + (x.fresh ? " is-new" : "") + '"><p class="bsf-label">' + esc(x.f.label) + "</p>" + bsValueHtml(x.val) + "</div>";
    });

    $("#bs-fiche").innerHTML = html;
    var first = $("#bs-fiche .is-new");
    if (first && !bsMobile.matches) {
      var box = $("#bs-fiche");
      box.scrollTo({ top: Math.max(0, first.offsetTop - box.offsetTop - 60), behavior: reduceMotion ? "auto" : "smooth" });
    }
  }

  function bsGoto(id) {
    if (id === "__restart") { bsStart(); return; }
    var node = B.nodes[id];
    if (node.phase !== undefined) bsSetPhase(node.phase);
    bsApplySet(node.set);
    bsPlay(bsRes(node.say), function () {
      if (node.set) bsUpdateFiche();
      var choices = bsRes(node.choices);
      if (choices && choices.length) bsShowChoices(choices);
      else if (node.next) bsGoto(bsRes(node.next));
    });
  }

  function bsShowChoices(list) {
    bs.choices = list;
    bsChoicesEl.innerHTML = list.map(function (c, i) {
      return '<button type="button" class="bs-choice' + (c.reco ? " is-reco" : "") + '" data-choice="' + i + '" style="--d:' + i * 70 + 'ms">' + esc(c.label) + "</button>";
    }).join("");
    bsScroll();
  }

  bsChoicesEl.addEventListener("click", function (e) {
    var b = e.target.closest("[data-choice]");
    if (!b) return;
    var c = bs.choices[+b.getAttribute("data-choice")];
    bs.choices = [];
    bsChoicesEl.innerHTML = "";
    if (c.reply !== null) bsAppend({ t: "user", text: c.reply || c.label.replace(/^⭐\s*/, "") });
    bsApplySet(c.set);
    bsUpdateFiche();
    bsPlay(bsRes(c.then), function () { bsGoto(bsRes(c.next)); });
  });

  function bsStart() {
    bsStop();
    bs.v = B.initVars();
    bs.last = {};
    bs.unseen = 0;
    bs.started = true;
    bs.interrupted = false;
    bsFeed.innerHTML = "";
    bsChoicesEl.innerHTML = "";
    bsBadge();
    bsSetView("chat");
    bsUpdateFiche(true);
    bsGoto(B.start);
  }

  function openBrainstorm(trigger) {
    openModal($("#bs-modal"), trigger);
    if (!bs.started || bs.interrupted) bsStart();
  }

  // Fermer en plein enchaînement interrompt la séquence : on repartira de zéro à la réouverture.
  function bsOnClose() {
    if (bs.playing) { bsStop(); bs.interrupted = true; }
  }

  $("#bs-restart").addEventListener("click", bsStart);
  bsPanel.addEventListener("click", function (e) {
    var v = e.target.closest("[data-bs-view]");
    if (v) bsSetView(v.getAttribute("data-bs-view"));
  });

  bsFeed.addEventListener("click", function (e) {
    var fb = e.target.closest("[data-fb]");
    if (fb) {
      $all("[data-fb]", bsFeed).forEach(function (x) { x.classList.toggle("is-selected", x === fb); });
      return;
    }
    var send = e.target.closest("[data-fb-send]");
    if (send) {
      send.closest(".msg-feedback").innerHTML = '<p class="fb-thanks">' + icon("check") + "Merci, c’est précieux pour nous !</p>";
    }
  });

  /* ---------- En-tête au défilement & bouton collant (mobile) ---------- */
  var header = $(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Le bouton collant n'apparaît que lorsque les autres « Commencer » sont hors de l'écran.
  var sticky = $("#sticky-cta");
  if ("IntersectionObserver" in window) {
    var seen = {};
    var ctaObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { seen[en.target.id] = en.isIntersecting; });
      var show = !seen["hero-cta"] && !seen["inline-cta"] && !seen.demarrer && window.scrollY > 200;
      sticky.classList.toggle("is-visible", show);
      document.documentElement.classList.toggle("sticky-on", show);
      sticky.setAttribute("aria-hidden", !show);
      $("a", sticky).tabIndex = show ? 0 : -1;
    }, { threshold: 0 });
    ctaObs.observe($("#hero-cta"));
    ctaObs.observe($("#inline-cta"));
    ctaObs.observe($("#demarrer"));
  }

  /* ---------- Liens directs : #cas-<id>, #brainstorm ---------- */
  function openFromHash() {
    if (location.hash === "#brainstorm") { openBrainstorm(); return; }
    var m = /^#cas-(.+)$/.exec(location.hash);
    if (m) openUseCase(decodeURIComponent(m[1]));
  }
  window.addEventListener("hashchange", openFromHash);

  /* ---------- Initialisation ---------- */
  renderHeroScene();
  startHeroRotation();
  renderFilters();
  renderGrid();
  renderAutonomy();
  renderPicked();
  onScroll();
  openFromHash();
})();
