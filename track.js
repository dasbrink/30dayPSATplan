// track.js — page-view + gclid logging for 30daypsatplan.com
// Writes one row to the PSAT Supabase `page_views` table on every page load.
// Captures the Google Ads click id (gclid) from the URL and remembers it
// (up to 30 days) so it is still attached when the visitor reaches checkout
// or the success page. Fails quietly — it never blocks the page for a student.
(function () {
  var SUPABASE_URL = "https://jotbwtkvwkunihvwmqqj.supabase.co";
  var SUPABASE_KEY = "sb_publishable_finn6Vwaqa2nBqG_DD5ZLg_Wpe-qZxW";
  var STORE_KEY = "psat_gclid";
  var MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

  function getUrlGclid() {
    try {
      return new URLSearchParams(window.location.search).get("gclid") || "";
    } catch (e) {
      return "";
    }
  }

  // Save a fresh gclid from the URL, or reuse a recent stored one.
  function resolveGclid(fresh) {
    try {
      if (fresh) {
        localStorage.setItem(STORE_KEY, JSON.stringify({ g: fresh, t: Date.now() }));
        return fresh;
      }
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return "";
      var obj = JSON.parse(raw);
      if (obj && obj.g && Date.now() - obj.t < MAX_AGE_MS) return obj.g;
    } catch (e) {}
    return "";
  }

  try {
    var gclid = resolveGclid(getUrlGclid());
    var row = {
      gclid: gclid || null,
      referrer: document.referrer || null,
      page: window.location.pathname || "/",
      user_agent: navigator.userAgent || null
    };
    fetch(SUPABASE_URL + "/rest/v1/page_views", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(row),
      keepalive: true
    }).catch(function () {});
  } catch (e) {}
})();
