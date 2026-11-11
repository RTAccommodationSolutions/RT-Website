// Mobile menu, footer year and the contact form. That's all the JS the site needs.
(function () {
  // Where enquiries from the contact form go. Replace with RT's real address.
  var CONTACT_EMAIL = "admin@rtaccomodationsolutions.co.za";
  // Google Sheet web app link (ends in /exec, see _setup/contact-form-google-sheet.txt). Paste it between the
  // quotes to save enquiries to the Sheet and email them to CONTACT_EMAIL. Leave it empty and the form opens
  // the visitor's email app instead.
  var SHEET_URL = "https://script.google.com/macros/s/AKfycbycPMW8WuC3Zb0MomwIHzcbjwChgNEKzVdJj2ELVXmb9cQjeBym3aPFL438Q9iws61rdg/exec";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  var form = document.getElementById("enquiry");
  var pageOpened = Date.now();                                   // the Sheet script ignores forms sent in under 3 seconds (bots)
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var f = form.elements;
      var hint = document.getElementById("enquiry-hint");
      if (!f.name.value.trim() || !f.email.value.trim()) {
        hint.textContent = "Please add your name and email so we can reply.";
        (f.name.value.trim() ? f.email : f.name).focus();
        return;
      }
      var body = [
        "Name: " + f.name.value,
        "Company: " + f.company.value,
        "Phone: " + f.phone.value,
        "Email: " + f.email.value,
        "Unit: " + f.unit.value,
        "Number of people: " + f.people.value,
        "",
        f.message.value
      ].join("\n");
      var subject = "Accommodation enquiry" + (f.company.value ? " from " + f.company.value : "");
      function openEmailApp(lead) {
        window.location.href = "mailto:" + CONTACT_EMAIL +
          "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        hint.textContent = (lead || "") + "Your email app should open now. If it doesn't, email us at " + CONTACT_EMAIL + ".";
      }
      if (!SHEET_URL) { openEmailApp(); return; }
      if (f.botcheck && f.botcheck.checked) return;              // spam bots tick the hidden box
      var btn = form.querySelector("button[type=submit]");
      btn.disabled = true; hint.textContent = "Sending…";
      fetch(SHEET_URL, {                                        // sent as plain text so Google accepts it from another site
        method: "POST",
        credentials: "omit",                                    // never send the visitor's Google login, or Google answers 401 to signed-in visitors
        redirect: "follow",
        body: JSON.stringify({
          subject: subject,
          name: f.name.value, email: f.email.value, company: f.company.value, phone: f.phone.value,
          unit: f.unit.value, people: f.people.value, message: f.message.value,
          elapsed: Date.now() - pageOpened, botcheck: f.botcheck && f.botcheck.checked ? "1" : ""
        })
      }).then(function (r) {
        return r.text().then(function (t) {
          try { return JSON.parse(t); } catch (x) { throw new Error("Not JSON (HTTP " + r.status + "): " + t.slice(0, 300)); }
        });
      }).then(function (res) {
        if (!res.success) throw new Error("Script said: " + res.message);
        form.reset();
        hint.textContent = "Thanks, your enquiry has been sent. We'll get back to you soon.";
      }).catch(function (err) {
        if (window.console) console.warn("Enquiry form could not send:", err && err.message ? err.message : err);
        openEmailApp("We couldn't send that from here. ");
      }).then(function () { btn.disabled = false; });
    });
    if (SHEET_URL) document.getElementById("enquiry-hint").textContent = "We'll get back to you by email or phone.";
  }
})();

// Crew planner (home and containers pages) and pre-filling the contact form from a plan.
(function () {
  var form = document.getElementById("planner-form");
  if (form) {
    var rows = [].slice.call(form.querySelectorAll(".pl-row"));
    var yard = document.getElementById("pl-yard");
    var list = document.getElementById("pl-list");
    var send = document.getElementById("pl-send");
    var out = { people: document.getElementById("pl-people"), units: document.getElementById("pl-units"), meals: document.getElementById("pl-meals") };

    function count(input) {
      var n = parseInt(input.value, 10);
      if (isNaN(n) || n < 0) n = 0;
      if (n > 500) n = 500;
      return n;
    }

    function update() {
      var people = 0, units = 0, meals = 0, lines = [], boxes = "", items = "";
      rows.forEach(function (row) {
        var n = count(row.querySelector("input"));
        var cap = +row.dataset.cap, name = row.dataset.unit, tier = row.dataset.tier;
        var need = Math.ceil(n / cap);
        people += n; units += need;
        if (row.dataset.meals === "1") meals += n * 3;
        for (var i = 0; i < need; i++) {
          var used = Math.min(cap, n - i * cap), beds = "";
          for (var b = 0; b < cap; b++) beds += '<i class="' + (b < used ? "on" : "") + '"></i>';
          boxes += '<div class="pl-box t' + tier + '" title="' + name + '"><span>' + tier + '</span><div class="beds c' + cap + '">' + beds + "</div></div>";
        }
        if (n > 0) {
          var spare = need * cap - n;
          items += "<li><b>" + need + " &times; " + name + "</b><span>" + n + (n === 1 ? " person" : " people") + (spare ? ", " + spare + " spare bed" + (spare === 1 ? "" : "s") : "") + "</span></li>";
          lines.push(need + " x " + name + " for " + n + " " + row.querySelector("b").textContent.toLowerCase());
        }
      });
      out.people.textContent = people;
      out.units.textContent = units;
      out.meals.textContent = meals;
      yard.innerHTML = boxes || '<p class="pl-empty">Add your team on the left to see the units you need.</p>';
      list.innerHTML = items;
      var plan = lines.length ? "Crew plan: " + lines.join("; ") + ". Total " + people + " people in " + units + " units." : "";
      send.href = send.getAttribute("href").split("?")[0] + (plan ? "?plan=" + encodeURIComponent(plan) + "&people=" + people : "");
    }

    form.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-step]");
      if (!btn) return;
      var input = btn.parentNode.querySelector("input");
      input.value = Math.max(0, Math.min(500, count(input) + (+btn.dataset.step)));
      update();
    });
    form.addEventListener("input", update);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    update();
  }

  // contact.html?plan=...&people=... fills the enquiry form
  var enquiry = document.getElementById("enquiry");
  if (enquiry && window.URLSearchParams) {
    var q = new URLSearchParams(location.search);
    if (q.get("plan")) {
      enquiry.elements.message.value = q.get("plan") + "\n\n";
      if (q.get("people")) enquiry.elements.people.value = q.get("people");
      enquiry.elements.unit.value = "A mix of units";
    }
  }
})();

// "WhatsApp us" buttons: ask who to chat to. The numbers live here only; the button
// itself links to the office number, so it still works if this script doesn't load.
(function () {
  var WHATSAPP = [
    { label: "Office", number: "27825271889", shown: "+27 82 527 1889" },
    { label: "Pierre (Owner)", number: "27795123255", shown: "+27 79 512 3255" }
  ];
  var buttons = document.querySelectorAll("[data-wa-choose]");
  if (!buttons.length) return;

  var pop = document.createElement("div");
  pop.className = "wa-pop"; pop.hidden = true;
  pop.innerHTML =
    '<div class="wa-box" role="dialog" aria-modal="true" aria-labelledby="wa-title">' +
      '<button type="button" class="wa-close" aria-label="Close">&times;</button>' +
      '<h2 id="wa-title">WhatsApp us</h2><p>Who would you like to chat to?</p>' +
      WHATSAPP.map(function (c) {
        return '<a class="wa-opt" href="https://wa.me/' + c.number + '" target="_blank" rel="noopener">' +
          '<b>' + c.label + '</b><span>' + c.shown + '</span><i aria-hidden="true">&rarr;</i></a>';
      }).join("") +
    '</div>';
  document.body.appendChild(pop);
  var box = pop.querySelector(".wa-box"), opener = null;

  function close() { pop.hidden = true; document.documentElement.classList.remove("wa-open"); if (opener) opener.focus(); }
  [].forEach.call(buttons, function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault(); opener = btn;
      pop.hidden = false; document.documentElement.classList.add("wa-open");
      pop.querySelector(".wa-opt").focus();
    });
  });
  pop.addEventListener("click", function (e) {
    if (e.target === pop || e.target.closest(".wa-close")) close();
    else if (e.target.closest(".wa-opt")) setTimeout(close, 0);
  });
  document.addEventListener("keydown", function (e) {
    if (pop.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {                                      // keep focus inside the box
      var f = box.querySelectorAll("button, a"), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
