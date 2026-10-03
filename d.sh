#!/bin/bash
# Temporary: remove em dashes from freepracticesat pages, fix two doubled blog pages.
[ -d sat-math ] || cd ~/workspace 2>/dev/null
[ -d sat-math ] || { echo "ERROR: no sat-math folder here"; exit 1; }
mkdir -p ~/dash_backup
SPEC=$(mktemp)
cat > "$SPEC" <<'EOF'
foundations/index.html pccc
blog/index.html occsc
about/index.html ppcccc
contact/index.html pp
blog/math-builds-like-lego-blocks/index.html occccooscoc
blog/improve-your-teens-sat-score/index.html oocsosoLRcccLRscc
sat-math/linear-equations/index.html ocso
sat-math/linear-inequalities/index.html cco
sat-math/absolute-value-equations/index.html o
sat-math/systems-of-equations/index.html sso
sat-math/graphing-systems-of-equations/index.html ooo
sat-math/slope-rate-of-change/index.html socco
sat-math/y-intercept-in-context/index.html oco
sat-math/linear-equation-from-two-points/index.html so
sat-math/linear-equation-point-slope/index.html so
sat-math/linear-models-from-context/index.html ssso
sat-math/standard-to-slope-intercept-form/index.html o
sat-math/parallel-and-perpendicular-lines/index.html cooo
sat-math/translating-word-problems/index.html o
sat-math/linear-word-problems/index.html sso
sat-math/factoring-quadratics/index.html cso
sat-math/solving-quadratics-by-factoring/index.html o
sat-math/completing-the-square/index.html cso
sat-math/parabola-vertex-axis-of-symmetry/index.html csco
sat-math/zeros-of-quadratics/index.html so
sat-math/polynomial-factors-and-zeros/index.html cso
sat-math/polynomial-end-behavior/index.html osco
sat-math/rational-equations/index.html cso
sat-math/linear-quadratic-systems/index.html cso
sat-math/radical-equations/index.html co
sat-math/exponent-rules/index.html so
sat-math/negative-and-fractional-exponents/index.html co
sat-math/function-composition/index.html o
sat-math/function-notation/index.html oco
sat-math/quadratic-models/index.html ooco
sat-math/exponential-growth-and-decay/index.html o
sat-math/ratios/index.html co
sat-math/percent-increase-and-decrease/index.html o
sat-math/reverse-percent-problems/index.html so
sat-math/successive-percent-changes/index.html sso
sat-math/scatterplots/index.html ooLRo
sat-math/line-of-best-fit/index.html ccooooo
sat-math/mean-median-range/index.html o
sat-math/standard-deviation/index.html cooooooo
sat-math/comparing-distributions/index.html cso
sat-math/basic-probability/index.html co
sat-math/compound-probability/index.html co
sat-math/area-and-perimeter/index.html so
sat-math/pythagorean-theorem/index.html co
sat-math/special-right-triangles/index.html o
sat-math/triangle-similarity/index.html o
sat-math/circle-equations/index.html co
sat-math/distance-formula/index.html o
sat-math/midpoint-formula/index.html oso
sat-math/radians-and-degrees/index.html o
sat-math/complementary-angle-trig/index.html soo
EOF
# 1) two blog pages contain the whole page more than once: keep the first copy
for F in blog/sat-math-score-stuck/index.html blog/improve-your-teens-sat-score/index.html; do
  [ -f "$F" ] || { echo "MISSING $F"; continue; }
  if [ "$(grep -ci '<!DOCTYPE' "$F")" -gt 1 ]; then
    mkdir -p ~/dash_backup/$(dirname "$F"); cp "$F" ~/dash_backup/"$F"
    awk '{print} /<\/html>/{exit}' "$F" > "$F.tmp" && cat "$F.tmp" > "$F" && rm -f "$F.tmp"
  fi
  echo "$F: doctype=$(grep -ci '<!DOCTYPE' "$F") end=$(grep -c '</html>' "$F")"
done
# 2) em dashes
TOTAL=0
while read -r F CODES; do
  [ -f "$F" ] || { echo "MISSING $F"; continue; }
  mkdir -p ~/dash_backup/$(dirname "$F"); [ -f ~/dash_backup/"$F" ] || cp "$F" ~/dash_backup/"$F"
  awk -v codes="$CODES" '
  function firstdash(s,  best,i,k){ best=0; DL=0
    for(k=1;k<=4;k++){ i=index(s,P[k]); if(i>0 && (best==0 || i<best)){best=i; DL=length(P[k])} }
    return best }
  BEGIN{ P[1]="&mdash;"; P[2]="\342\200\224"; P[3]="&#8212;"; P[4]="&#x2014;"
         S["c"]=", "; S["s"]="; "; S["o"]=": "; S["p"]=" | "; S["L"]=" ("; S["R"]=") " }
  { txt = txt $0 "\n" }
  END{ n=0
    for(c=1;c<=length(codes);c++){ a=firstdash(txt); if(a==0) break
      b=a+DL; p=a; while(p>1 && substr(txt,p-1,1) ~ /[ \t\r\n]/) p--
      q=b; while(q<=length(txt) && substr(txt,q,1) ~ /[ \t\r\n]/) q++
      txt=substr(txt,1,p-1) S[substr(codes,c,1)] substr(txt,q); n++ }
    printf "%s", txt > (FILENAME ".tmp"); print n > "/dev/stderr" }' "$F" 2> "$SPEC.n" && cat "$F.tmp" > "$F" && rm -f "$F.tmp"
  N=$(cat "$SPEC.n"); TOTAL=$((TOTAL+N))
  LEFT=$(grep -o -e '&mdash;' -e '—' "$F" | wc -l)
  [ "$N" = "${#CODES}" ] && [ "$LEFT" = 0 ] || echo "CHECK $F: changed $N of ${#CODES}, left $LEFT"
done < "$SPEC"
echo "dashes removed: $TOTAL (expected 177)"
echo "dashes left in site pages: $(grep -rl -e '&mdash;' -e '—' --include=index.html sat-math blog about contact foundations 2>/dev/null | wc -l) files"
rm -f "$SPEC" "$SPEC.n"
echo "Backup of the old files is in ~/dash_backup"
echo "ALL DONE. Now click Republish."
