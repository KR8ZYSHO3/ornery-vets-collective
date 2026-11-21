(function () {
  "use strict";

  var PANELS = ["home", "events", "help", "involved", "contact"];

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function currentPanel() {
    var hash = (location.hash || "#home").replace(/^#/, "").toLowerCase();
    return PANELS.indexOf(hash) === -1 ? "home" : hash;
  }

  function showPanel(name, opts) {
    if (PANELS.indexOf(name) === -1) name = "home";
    $all("[data-panel]").forEach(function (panel) {
      var on = panel.getAttribute("data-panel") === name;
      panel.hidden = !on;
      panel.classList.toggle("is-active", on);
    });
    $all("[data-nav]").forEach(function (link) {
      var on = link.getAttribute("data-nav") === name;
      link.classList.toggle("is-active", on);
      if (link.classList.contains("tab")) {
        if (on) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      }
    });
    if (!opts || !opts.skipHash) {
      var next = "#" + name;
      if (location.hash !== next) {
        if (opts && opts.replace) history.replaceState(null, "", next);
        else location.hash = next;
      }
    }
    if (!opts || !opts.preserveScroll) {
      window.scrollTo(0, 0);
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isSafeHttpUrl(url) {
    try {
      var u = new URL(url, location.href);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch (e) {
      return false;
    }
  }

  function messengerUrl(facebookUrl) {
    try {
      var u = new URL(facebookUrl);
      var parts = u.pathname.replace(/\/+$/, "").split("/").filter(Boolean);
      if (!parts.length) return "";
      var handle = parts[0];
      if (handle === "profile.php") {
        var id = u.searchParams.get("id");
        return id ? "https://m.me/" + encodeURIComponent(id) : "";
      }
      if (handle === "pages" && parts.length >= 2) {
        handle = parts[parts.length - 1];
      }
      return "https://m.me/" + encodeURIComponent(handle);
    } catch (e) {
      return "";
    }
  }

  function eventIsPast(evt, today) {
    if (evt.recurring) return false;
    if (!evt.endDate && !evt.startDate) return false;
    var raw = evt.endDate || evt.startDate;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return false;
    return raw < today;
  }

  function todayISO() {
    var d = new Date();
    var m = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + m + "-" + day;
  }

  function renderEvents(data) {
    var list = $("#events-list");
    var events = (data && data.events) || [];
    var today = todayISO();
    var visible = events.filter(function (evt) {
      return !eventIsPast(evt, today);
    });

    if (!visible.length) {
      list.innerHTML =
        '<article class="card"><p>No upcoming events are listed right now. Check back soon, or ask the organization for the latest gathering times.</p></article>';
    } else {
      list.innerHTML = visible
        .map(function (evt) {
          var title = escapeHtml(evt.title || "Event");
          var when = evt.when ? escapeHtml(evt.when) : "";
          var loc = evt.location ? escapeHtml(evt.location) : "";
          var desc = evt.description ? "<p>" + escapeHtml(evt.description) + "</p>" : "";
          var maps = "";
          if (evt.mapsUrl && isSafeHttpUrl(evt.mapsUrl)) {
            maps =
              '<p><a class="btn btn--ghost" href="' +
              escapeHtml(evt.mapsUrl) +
              '" rel="noopener noreferrer" target="_blank">Directions</a></p>';
          }
          return (
            '<article class="card">' +
            "<h2>" +
            title +
            "</h2>" +
            (when ? '<p class="event-when"><strong>' + when + "</strong></p>" : "") +
            (loc ? '<p class="event-loc">' + loc + "</p>" : "") +
            desc +
            maps +
            "</article>"
          );
        })
        .join("");
    }

    renderFacebook((data && data.facebookUrl) || "");
  }

  function renderFacebook(url) {
    var slots = $all("#facebook-slot, #contact-facebook-slot");
    var html;
    if (url && isSafeHttpUrl(url)) {
      var safe = escapeHtml(url);
      var msg = messengerUrl(url);
      html =
        "<p>Find the group on Facebook for updates and messages.</p>" +
        '<p><a class="btn btn--navy" href="' +
        safe +
        '" rel="noopener noreferrer" target="_blank">Open Facebook page</a></p>' +
        (msg
          ? '<p><a class="btn btn--ghost" href="' +
            escapeHtml(msg) +
            '" rel="noopener noreferrer" target="_blank">Message on Messenger</a></p>'
          : "");
    } else {
      html =
        "<p>The official Facebook page URL still needs to be added in Site settings.</p>";
    }
    slots.forEach(function (slot) {
      slot.innerHTML = html;
    });
  }

  function looksLikeEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function looksLikePhone(value) {
    var digits = String(value).replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 15;
  }

  function renderSite(site, facebookUrl) {
    site = site || {};

    var mission = $("#mission-copy");
    var paragraphs = site.missionParagraphs || [];
    if (mission && paragraphs.length) {
      mission.innerHTML = paragraphs
        .filter(function (p) { return String(p).trim(); })
        .map(function (p) { return "<p>" + escapeHtml(p) + "</p>"; })
        .join("");
    }

    var vol = $("#volunteer-copy");
    if (vol) {
      var intro = site.volunteerIntro
        ? "<p>" + escapeHtml(site.volunteerIntro) + "</p>"
        : "";
      var contact = (site.volunteerContact || "").trim();
      var contactHtml = "";
      if (contact) {
        if (looksLikeEmail(contact)) {
          contactHtml = '<p><a href="mailto:' + escapeHtml(contact) + '">' + escapeHtml(contact) + "</a></p>";
        } else if (looksLikePhone(contact)) {
          var tel = contact.replace(/[^\d+]/g, "");
          contactHtml = '<p><a href="tel:' + escapeHtml(tel) + '">' + escapeHtml(contact) + "</a></p>";
        } else {
          contactHtml = "<p>" + escapeHtml(contact) + "</p>";
        }
      } else {
        contactHtml = '<p class="placeholder-note">Volunteer contact is not set yet.</p>';
      }
      vol.innerHTML = intro + contactHtml;
    }

    var don = $("#donate-copy");
    if (don) {
      var dIntro = site.donateIntro
        ? "<p>" + escapeHtml(site.donateIntro) + "</p>"
        : "";
      var url = (site.donateUrl || "").trim();
      var dExtra = "";
      if (url && isSafeHttpUrl(url)) {
        dExtra = '<p><a class="btn btn--navy" href="' + escapeHtml(url) + '" rel="noopener noreferrer" target="_blank">Donate</a></p>';
      } else {
        dExtra = '<p class="placeholder-note">Donation details are not set yet.</p>';
      }
      don.innerHTML = dIntro + dExtra;
    }

    var addr = $("#contact-address");
    if (addr) {
      var line1 = escapeHtml(site.addressLine1 || "520 W Union St");
      var line2 = escapeHtml(site.addressLine2 || "Athens, OH 45701");
      var maps = site.mapsUrl && isSafeHttpUrl(site.mapsUrl) ? site.mapsUrl : "";
      var note = site.addressNote
        ? '<p class="muted">' + escapeHtml(site.addressNote) + "</p>"
        : "";
      var mapsBtn = maps
        ? '<p><a class="btn btn--navy" href="' + escapeHtml(maps) + '" rel="noopener noreferrer" target="_blank">Open in Google Maps</a></p>'
        : "";
      addr.innerHTML = "<p>" + line1 + "<br>" + line2 + "</p>" + mapsBtn + note;
    }

    var direct = $("#contact-direct");
    if (direct) {
      var email = (site.contactEmail || "").trim();
      var phone = (site.contactPhone || "").trim();
      var parts = [];
      if (email) {
        parts.push('<p>Email: <a href="mailto:' + escapeHtml(email) + '">' + escapeHtml(email) + "</a></p>");
      }
      if (phone) {
        var tel2 = phone.replace(/[^\d+]/g, "");
        parts.push('<p>Phone: <a href="tel:' + escapeHtml(tel2) + '">' + escapeHtml(phone) + "</a></p>");
      }
      if (!parts.length) {
        parts.push('<p class="placeholder-note">A public email and phone number for the Collective have not been added yet.</p>');
      }
      direct.innerHTML = parts.join("");
    }

    renderFacebook(facebookUrl || site.facebookUrl || "");
  }

  function loadContent() {
    return Promise.all([
      fetch("events.json", { cache: "no-cache" }).then(function (res) {
        if (!res.ok) throw new Error("Could not load events");
        return res.json();
      }),
      fetch("site.json", { cache: "no-cache" }).then(function (res) {
        if (!res.ok) return {};
        return res.json();
      }).catch(function () { return {}; })
    ])
      .then(function (pair) {
        var eventsData = pair[0] || {};
        var site = pair[1] || {};
        var eventList = Array.isArray(eventsData) ? eventsData : eventsData.events || [];
        var facebook = site.facebookUrl || eventsData.facebookUrl || "";
        renderEvents({ events: eventList, facebookUrl: facebook });
        renderSite(site, facebook);
      })
      .catch(function () {
        $("#events-list").innerHTML =
          '<article class="card"><p>Events could not be loaded right now. If you are offline, try again when you have a connection, or check Facebook once the page link is added.</p></article>';
      });
  }

  /* Install / add to home screen */
  var deferredPrompt = null;

  function setupInstall() {
    var installBtn = $("#install-btn");
    var howBtn = $("#install-how-btn");
    var sheet = $("#install-sheet");

    if (isStandalone()) {
      document.body.classList.add("is-standalone");
    }

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn && !isStandalone()) installBtn.hidden = false;
    });

    if (installBtn) {
      installBtn.addEventListener("click", function () {
        if (!deferredPrompt) {
          openSheet();
          return;
        }
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null;
          installBtn.hidden = true;
        });
      });
    }

    if (howBtn) howBtn.addEventListener("click", openSheet);

    function openSheet() {
      sheet.hidden = false;
      var close = $(".sheet .sheet__close, .sheet__close");
      if (close) close.focus();
    }

    function closeSheet() {
      sheet.hidden = true;
    }

    $all("[data-close-sheet]", sheet).forEach(function (el) {
      el.addEventListener("click", closeSheet);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !sheet.hidden) closeSheet();
    });
  }

  function setupNav() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-nav]");
      if (!link) return;
      var name = link.getAttribute("data-nav");
      if (PANELS.indexOf(name) === -1) return;
      e.preventDefault();
      showPanel(name);
    });

    window.addEventListener("hashchange", function () {
      showPanel(currentPanel(), { skipHash: true });
    });

    showPanel(currentPanel(), { replace: true, skipHash: location.hash === "#" + currentPanel() });
  }

  function registerWorker() {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function () {
      /* Offline support is optional; the app still works online. */
    });
  }

  function syncTopOffset() {
    var stack = document.querySelector(".top-stack");
    if (!stack) return;
    document.body.style.paddingTop = stack.offsetHeight + 16 + "px";
  }
  window.addEventListener("resize", syncTopOffset);
  syncTopOffset();

  /* Netlify injects a "Powered by Netlify" badge on Free-plan public sites
     (/.netlify/scripts/hud). It sits at the bottom-right and can cover the tab bar.
     When the badge frame is present, lift the nav so every tab stays tappable. */
  function syncNetlifyBadgeOffset() {
    var frame = document.getElementById("nl-badge-frame");
    var extra = 0;
    if (frame) {
      var h = Math.ceil(frame.getBoundingClientRect().height);
      extra = Math.max(h, 92);
    }
    document.documentElement.style.setProperty("--netlify-badge", extra + "px");
  }
  syncNetlifyBadgeOffset();
  if (window.MutationObserver) {
    var badgeWatch = new MutationObserver(syncNetlifyBadgeOffset);
    badgeWatch.observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener("resize", syncNetlifyBadgeOffset);
  setTimeout(syncNetlifyBadgeOffset, 400);
  setTimeout(syncNetlifyBadgeOffset, 1600);

  setupNav();
  setupInstall();
  loadContent();
  registerWorker();
})();
