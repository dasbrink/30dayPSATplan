#!/bin/bash
[ -d sat-math ] || cd ~/workspace 2>/dev/null
for F in blog/sat-math-score-stuck/index.html blog/improve-your-teens-sat-score/index.html; do
  sed -i 's#</html><!DOCTYPE html>#</html>#I' "$F"
  echo "$F: doctype=$(grep -ci '<!DOCTYPE' "$F") end=$(grep -c '</html>' "$F")"
done
echo "ALL DONE. Now click Republish."
