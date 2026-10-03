#!/bin/bash
# Temporary: results page, Always Free cell.
[ -f script.js ] || cd ~/workspace 2>/dev/null
[ -f index.html ] && [ -f results_v2.js ] || { echo "ERROR: run this in the project folder"; exit 1; }
curl -sL 30daypsatplan.com/fp/results_free_cell.js -o results_free_cell.js
grep -q 'results_free_cell loaded' results_free_cell.js || { echo "ERROR: download failed, nothing changed"; rm -f results_free_cell.js; exit 1; }
if ! grep -q 'results_free_cell.js' index.html; then
  sed -i 's#<script src="results_v2.js"></script>#<script src="results_v2.js"></script>\n<script src="results_free_cell.js"></script>#' index.html
fi
echo "script tags: $(grep -c 'results_free_cell.js' index.html) (should be 1)"
echo "doctype: $(grep -ci '<!DOCTYPE' index.html) (should be 1)"
echo "ALL DONE. Now click Republish."
