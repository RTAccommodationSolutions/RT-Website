// Mobile menu, footer year and the contact form. That's all the JS the site needs.
(function () {
  // Where enquiries from the contact form go. Replace with RT's real address.
  var CONTACT_EMAIL = "admin@rtaccomodationsolutions.co.za";

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
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      hint.textContent = "Your email app should open now. If it doesn't, email us at " + CONTACT_EMAIL + ".";
    });
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
