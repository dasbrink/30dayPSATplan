#!/bin/bash
# Temporary: Always Free cell + price change to $29 on freepracticesat.
[ -f results_v2.js ] || cd ~/workspace 2>/dev/null
[ -f index.html ] && [ -f results_v2.js ] && [ -f parent_pay.js ] && [ -f welcome_offer.js ] || { echo "ERROR: run this in the project folder"; exit 1; }
mkdir -p ~/price_backup && cp results_v2.js parent_pay.js welcome_offer.js index.html ~/price_backup/ 2>/dev/null

# 1) Always Free cell (skipped if already installed)
if [ ! -f results_free_cell.js ]; then
  curl -sL 30daypsatplan.com/fp/results_free_cell.js -o results_free_cell.js
  grep -q 'results_free_cell loaded' results_free_cell.js || { echo "ERROR: download failed"; rm -f results_free_cell.js; exit 1; }
fi
grep -q 'results_free_cell.js' index.html || sed -i 's#<script src="results_v2.js"></script>#<script src="results_v2.js"></script>\n<script src="results_free_cell.js"></script>#' index.html

# 2) $99 -> $29
OLD=price_1TzlSoPpsYZtWdw8kkATELZU
NEW=price_1UMZC0PpsYZtWdw8EoNXQEDy
sed -i "s/$OLD/$NEW/g" results_v2.js parent_pay.js
sed -i "s/const FULL_ACCESS_PRICE_LABEL = '\$99';/const FULL_ACCESS_PRICE_LABEL = '\$29';/" results_v2.js
sed -i '/class="v2-offer-bonus"/d' results_v2.js
sed -i 's/Includes the 30-Day SAT Math Plan at no extra cost. //' results_v2.js
sed -i 's#<h3>You also have the 30-Day SAT Math Plan</h3>#<h3>Bought before October 3, 2026? You also have the 30-Day SAT Math Plan</h3>#' results_v2.js
sed -i "s/const PRICE_LABEL = '\$99';/const PRICE_LABEL = '\$29';/" welcome_offer.js
sed -i 's/opens the same \$99 payment page/opens the same \$29 payment page/' parent_pay.js

echo "free cell tag: $(grep -c 'results_free_cell.js' index.html) (should be 1)"
echo "new price id: results_v2=$(grep -c $NEW results_v2.js) parent_pay=$(grep -c $NEW parent_pay.js) (both 1)"
echo "old price id left: $(cat results_v2.js parent_pay.js | grep -c $OLD) (should be 0)"
echo "label \$29: results_v2=$(grep -c "PRICE_LABEL = '\$29'" results_v2.js) welcome=$(grep -c "PRICE_LABEL = '\$29'" welcome_offer.js) (both 1)"
echo "30-day plan bonus lines left: $(grep -c -e 'v2-offer-bonus">' -e 'Includes the 30-Day SAT Math Plan' results_v2.js) (should be 0)"
echo "ALL DONE. Now click Republish."
