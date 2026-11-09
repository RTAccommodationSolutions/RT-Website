RT ACCOMMODATION SOLUTIONS WEBSITE (SHELL)
==========================================

Plain HTML, CSS and a little JS. No build step: double-click index.html
to preview, or host the folder as-is (GitHub Pages works).

  index.html               Home
  about.html               About
  containers.html          The four units + comparison table + meals + FAQ
  containers/manager-unit.html         Tier 1  } one page per unit:
  containers/skilled-labour-unit.html  Tier 2  } 3D model, what's included,
  containers/labour-unit.html          Tier 3  } layout, specs, meals,
  containers/weekly-worker-unit.html   Tier 4  } photos
  contact.html             Contact details + enquiry form
  demos/rt-laundry/        RT Laundry live demo + manager dashboard
  css/style.css            All styling. RT blue palette at the top (:root)
  js/main.js               Menu, footer year, contact form (CONTACT_EMAIL)


3D MODELS
---------
Each unit page has a <figure class="model" id="model"> frame. Put the
viewer inside it in place of the <div class="model-ph"> placeholder: a
<canvas> (three.js), <model-viewer> or <iframe> fills the frame
automatically. The small frames on the unit cards can stay as the line
drawing or be swapped for a still render of each model.
