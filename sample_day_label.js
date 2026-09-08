/* sample_day_label.js
   Self-contained. Adds a small "example day" label directly above the
   "Day 16 of 30" block on the 30daypsatplan.com landing page, so a visitor
   cannot mistake the illustration for their own progress.
   Touches nothing else. Load just before </body>:
     <script src="sample_day_label.js"></script>
*/
(function () {
  "use strict";
  var INK = "#241C22";
  var OXBLOOD = "#A32B3F";

  function placeLabel() {
    if (document.getElementById("sampleDayLabel")) return true;

    // Find the "Day 16 of 30" heading, then climb to the dark card that holds it.
    var target = null;
    var els = document.querySelectorAll("div,section,article,aside");
    for (var i = 0; i < els.length; i++) {
      var t = (els[i].textContent || "");
      if (t.indexOf("Day 16 of 30") !== -1 &&
          t.indexOf("Warm up") !== -1 &&
          t.indexOf("Check") !== -1 &&
          t.length < 500) {
        target = els[i];
        break;
      }
    }
    // Fallback: smallest element that contains the "Day 16 of 30" text.
    if (!target) {
      var all = document.querySelectorAll("*");
      var best = null;
      for (var j = 0; j < all.length; j++) {
        var tt = (all[j].textContent || "");
        if (tt.indexOf("Day 16 of 30") !== -1) {
          if (!best || tt.length < (best.textContent || "").length) best = all[j];
        }
      }
      // Step up to a block-level container we can sit above.
      target = best;
      while (target && target.parentNode &&
             (target.parentNode.textContent || "").indexOf("Day 16 of 30") !== -1 &&
             (target.parentNode.textContent || "").length < 600) {
        target = target.parentNode;
      }
    }
    if (!target || !target.parentNode) return false;

    var label = document.createElement("div");
    label.id = "sampleDayLabel";
    label.textContent = "This is what Day 16 might look like once you are in.";
    label.style.cssText = [
      "margin:0 0 10px 0",
      "font-size:14px",
      "font-weight:bold",
      "letter-spacing:0.02em",
      "color:" + OXBLOOD,
      "font-family:inherit",
      "text-align:left"
    ].join(";");

    target.parentNode.insertBefore(label, target);
    return true;
  }

  function init() {
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      if (placeLabel() || tries > 30) clearInterval(timer);
    }, 250);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
