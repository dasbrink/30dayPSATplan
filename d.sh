#!/bin/bash
# Temporary script: answer boxes + FAQ data on 6 topic pages, IndexNow key, PSAT link.
[ -d sat-math ] || cd ~/workspace 2>/dev/null
[ -d sat-math ] || { echo "ERROR: run this from the project root (no sat-math folder here)"; exit 1; }
T=$(mktemp -d)
ins_before() { # file pattern insertfile
  awk -v f="$3" -v p="$2" 'index($0,p) && !d { while ((getline l < f) > 0) print l; d=1 } { print }' "$1" > "$T/out" && cat "$T/out" > "$1"
}
do_page() { # slug ; reads $T/box and $T/faq
  F="sat-math/$1/index.html"
  if [ ! -f "$F" ]; then echo "MISSING $F"; return; fi
  if grep -q 'class="answer-box"' "$F"; then echo "already done: $1"; return; fi
  ins_before "$F" '<p class="lede"' "$T/box"
  ins_before "$F" '</head>' "$T/faq"
  echo "$1: box=$(grep -c 'class="answer-box"' "$F") faq=$(grep -c '"FAQPage"' "$F") h1=$(grep -c '<h1' "$F") end=$(grep -c '</html>' "$F")"
}
BOXA='<div class="answer-box" style="background:#f4f7fb;border-left:4px solid #c9902a;padding:16px 20px;margin:0 0 22px;border-radius:6px"><p style="margin:0 0 6px;font-weight:bold;color:#1a3a5c">Short answer</p><p style="margin:0;line-height:1.7">'
BOXB='</p></div>'

# ---------- standard-deviation
cat > "$T/box" <<'EOF'
BOXA_Standard deviation measures how spread out the values in a data set are from the mean. A larger standard deviation means the values are more scattered, not that the average is higher. On the SAT you almost never calculate it; you compare the spread of two data sets or say what happens when values change._BOXB
EOF
cat > "$T/faq" <<'EOF'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Do you have to calculate standard deviation on the SAT?","acceptedAnswer":{"@type":"Answer","text":"Almost never. SAT questions ask you to compare the spread of two data sets, or to say what happens to the standard deviation when values are added, removed, or changed."}},
{"@type":"Question","name":"What happens to standard deviation if you add the same number to every value?","acceptedAnswer":{"@type":"Answer","text":"It stays the same. Every value shifts by the same amount, so the spread does not change. The mean goes up by that number."}},
{"@type":"Question","name":"Is standard deviation the same as range?","acceptedAnswer":{"@type":"Answer","text":"No. Range uses only the largest and smallest values. Standard deviation reflects how far every value sits from the mean."}}
]}
</script>
EOF
sed -i "s|BOXA_|$BOXA|; s|_BOXB|$BOXB|" "$T/box"; do_page standard-deviation

# ---------- special-right-triangles
cat > "$T/box" <<'EOF'
BOXA_A 45-45-90 triangle has sides in the ratio $1 : 1 : \sqrt{2}$, and a 30-60-90 triangle has sides in the ratio $1 : \sqrt{3} : 2$. In the 30-60-90 triangle, the shortest side is opposite the 30° angle and the hypotenuse is twice that side. Both ratios are on the SAT reference sheet, but knowing them cold saves time._BOXB
EOF
cat > "$T/faq" <<'EOF'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"Are special right triangles on the SAT reference sheet?","acceptedAnswer":{"@type":"Answer","text":"Yes. Both the 45-45-90 and the 30-60-90 side ratios are on the reference sheet you can open during the math section. Knowing them by heart is still faster."}},
{"@type":"Question","name":"How do you find the legs of a 45-45-90 triangle from the hypotenuse?","acceptedAnswer":{"@type":"Answer","text":"Divide the hypotenuse by the square root of 2. A hypotenuse of 10 gives legs of 10 divided by the square root of 2, which simplifies to 5 times the square root of 2."}},
{"@type":"Question","name":"Which side is which in a 30-60-90 triangle?","acceptedAnswer":{"@type":"Answer","text":"The shortest side is opposite the 30 degree angle. The side opposite the 60 degree angle is the shortest side times the square root of 3. The hypotenuse is twice the shortest side."}}
]}
</script>
EOF
sed -i "s|BOXA_|$BOXA|; s|_BOXB|$BOXB|" "$T/box"; do_page special-right-triangles

# ---------- rational-equations
cat > "$T/box" <<'EOF'
BOXA_To solve a rational equation, multiply both sides by the least common denominator to clear the fractions, then solve the equation that is left. Always check each answer in the original equation, because any value that makes a denominator zero must be thrown out._BOXB
EOF
cat > "$T/faq" <<'EOF'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"What is an extraneous solution?","acceptedAnswer":{"@type":"Answer","text":"A value that solves the equation after the fractions are cleared, but makes a denominator zero in the original equation. It is not a real solution and must be discarded."}},
{"@type":"Question","name":"Can Desmos solve rational equations on the SAT?","acceptedAnswer":{"@type":"Answer","text":"Yes. Graph the left side and the right side as two separate equations and read the x-coordinate where the graphs cross."}},
{"@type":"Question","name":"Should I cross-multiply or use the LCD?","acceptedAnswer":{"@type":"Answer","text":"Cross-multiplying works when each side is a single fraction. When either side has more than one term, multiplying everything by the least common denominator is the cleanest route."}}
]}
</script>
EOF
sed -i "s|BOXA_|$BOXA|; s|_BOXB|$BOXB|" "$T/box"; do_page rational-equations

# ---------- exponential-growth-and-decay
cat > "$T/box" <<'EOF'
BOXA_Exponential growth follows $y = a(1 + r)^t$ and exponential decay follows $y = a(1 - r)^t$, where $a$ is the starting amount and $r$ is the percent change written as a decimal. Growth of 8% a year multiplies the amount by $1.08$ every year; decay of 8% a year multiplies it by $0.92$._BOXB
EOF
cat > "$T/faq" <<'EOF'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How do you tell linear from exponential on the SAT?","acceptedAnswer":{"@type":"Answer","text":"Linear change adds the same amount each step. Exponential change multiplies by the same factor each step, so it grows by the same percent."}},
{"@type":"Question","name":"What does the base of an exponential function tell you?","acceptedAnswer":{"@type":"Answer","text":"A base greater than 1 means growth and a base between 0 and 1 means decay. A base of 1.05 is 5 percent growth; a base of 0.85 is 15 percent decay."}},
{"@type":"Question","name":"What if the rate applies every half year instead of every year?","acceptedAnswer":{"@type":"Answer","text":"Change the exponent to match. If t counts years and the change happens every 6 months, the exponent is 2t."}}
]}
</script>
EOF
sed -i "s|BOXA_|$BOXA|; s|_BOXB|$BOXB|" "$T/box"; do_page exponential-growth-and-decay

# ---------- linear-equations
cat > "$T/box" <<'EOF'
BOXA_To solve a linear equation, get the variable alone by doing the same thing to both sides: distribute, combine like terms, move the variable terms to one side, then divide. For example, $3(x - 2) = 2x + 5$ becomes $3x - 6 = 2x + 5$, so $x = 11$._BOXB
EOF
cat > "$T/faq" <<'EOF'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"When does a linear equation have no solution?","acceptedAnswer":{"@type":"Answer","text":"When the variable cancels and leaves a false statement such as 4 = 7. Both sides have the same coefficient on x but different constants."}},
{"@type":"Question","name":"When does a linear equation have infinitely many solutions?","acceptedAnswer":{"@type":"Answer","text":"When the variable cancels and leaves a true statement such as 5 = 5. The two sides are the same expression written differently."}},
{"@type":"Question","name":"What is the most common mistake on SAT linear equations?","acceptedAnswer":{"@type":"Answer","text":"Distributing a negative sign to only the first term inside the parentheses. A minus in front of parentheses changes the sign of every term inside."}}
]}
</script>
EOF
sed -i "s|BOXA_|$BOXA|; s|_BOXB|$BOXB|" "$T/box"; do_page linear-equations

# ---------- factoring-quadratics
cat > "$T/box" <<'EOF'
BOXA_To factor $x^2 + bx + c$, find two numbers that multiply to $c$ and add to $b$. For $x^2 + 5x + 6$ those numbers are 2 and 3, so it factors as $(x + 2)(x + 3)$. When the leading coefficient is not 1, use the ac method, or graph it in Desmos and read the zeros._BOXB
EOF
cat > "$T/faq" <<'EOF'
<script type="application/ld+json">
{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
{"@type":"Question","name":"How do factors relate to zeros?","acceptedAnswer":{"@type":"Answer","text":"If (x - 3) is a factor, then x = 3 is a zero, and the graph crosses the x-axis at 3. Each factor gives one x-intercept."}},
{"@type":"Question","name":"What if a quadratic will not factor?","acceptedAnswer":{"@type":"Answer","text":"Use the quadratic formula, or graph the quadratic in Desmos and read the x-intercepts."}},
{"@type":"Question","name":"What is the difference of squares?","acceptedAnswer":{"@type":"Answer","text":"An expression of the form a squared minus b squared factors as (a - b)(a + b). For example, x squared minus 49 factors as (x - 7)(x + 7)."}}
]}
</script>
EOF
sed -i "s|BOXA_|$BOXA|; s|_BOXB|$BOXB|" "$T/box"; do_page factoring-quadratics

# ---------- IndexNow key
echo -n 9bb822cbe93797d112b86f0cff2f03e8 > 9bb822cbe93797d112b86f0cff2f03e8.txt
echo "indexnow key file: $(cat 9bb822cbe93797d112b86f0cff2f03e8.txt)"

# ---------- PSAT link in the SAT Desmos post
F=blog/how-to-use-desmos-on-the-sat.html
if [ -f "$F" ] && ! grep -q 30daypsatplan.com/how-to-use-desmos "$F"; then
cat > "$T/box" <<'EOF'
  <p><strong>Taking the PSAT?</strong> <a href="https://30daypsatplan.com/how-to-use-desmos-on-the-psat/">Here is the PSAT version of this guide</a>, with examples at PSAT level.</p>

EOF
ins_before "$F" '<div class="cta">' "$T/box"
fi
echo "psat link: $(grep -c 30daypsatplan.com/how-to-use-desmos "$F") doctype: $(grep -c '<!DOCTYPE' "$F")"
rm -rf "$T"
echo "ALL DONE. Now click Republish."
