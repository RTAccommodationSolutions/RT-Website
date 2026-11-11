RT ACCOMMODATION SOLUTIONS WEBSITE (SHELL)
==========================================

Plain HTML, CSS and a little JS. No build step: double-click index.html
to preview, or host the folder as-is (GitHub Pages works).

  index.html               Home
  about.html               About
  containers.html          The four units + comparison table + meals + FAQ
  containers/manager-unit.html         Tier 1  } one page per unit:
  containers/skilled-labour-unit.html  Tier 2  } 3D model, what's included,
  containers/labour-unit.html          Tier 3  } what's inside, specs, meals,
  containers/weekly-worker-unit.html   Tier 4  } photos
  contact.html             Contact details + enquiry form
  demos/rt-laundry/        RT Laundry live demo + manager dashboard
  css/style.css            All styling. RT blue palette at the top (:root)
  js/main.js               Menu, footer year, contact form (CONTACT_EMAIL)


PLACEHOLDERS
------------
Anything with a pale yellow highlight is placeholder text. In the HTML
it's wrapped in <span class="todo">...</span>. Replace the words and
remove the span. Search the folder for class="todo" to find them all.

Also still to fill in:
  - WhatsApp numbers: WHATSAPP list near the bottom of js/main.js
    (also the office number in each "WhatsApp us" link, used if JS is off)
  - Contact email: CONTACT_EMAIL in js/main.js
  - Unit details still marked TBC: container size (except the Manager
    Unit's 12 m), entrances on the Skilled Labour Unit, and rooms and
    beds in the Weekly Worker Unit


IMAGES
------
Save a file with the exact name and it replaces the dashed box.

  images/about/site.jpg               About page photo (4:3)
  images/manager-unit/photo-1.jpg     Photo gallery (4:3), photo-1 to -3
  (same for skilled-labour-unit, labour-unit and weekly-worker-unit)
  images/rt-laundry/cover-1.png       Home page phone shots (already
  images/rt-laundry/cover-2.png       taken from the demo)


3D MODELS
---------
Each unit page has a <figure class="model" id="model"> frame. Put the
viewer inside it in place of the <div class="model-ph"> placeholder: a
<canvas> (three.js), <model-viewer> or <iframe> fills the frame
automatically. The small frames on the unit cards can stay as the line
drawing or be swapped for a still render of each model.
