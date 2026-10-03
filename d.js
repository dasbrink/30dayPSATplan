// fixdesc.js  Rewrites the meta description, og:description and
// twitter:description on the 50 SAT math topic pages (sat-math/<topic>/index.html).
// Dry run by default. Run with --write to change the files.
const fs = require("fs"), path = require("path");
const NEW = {
 "linear-equations": "How to solve linear equations on the SAT: isolate the variable step by step, avoid the sign slips students make, then try free SAT math practice questions.",
 "linear-inequalities": "Solve SAT linear inequalities: when to flip the inequality sign, how to read the solution set, and the common traps. Free SAT math practice questions.",
 "absolute-value-equations": "Solve absolute value equations on the SAT by splitting into two cases, then checking each answer. Worked steps, common mistakes, and free practice.",
 "systems-of-equations": "Solve SAT systems of equations with substitution or elimination, know when each is faster, and avoid common errors. Free SAT math practice questions.",
 "graphing-systems-of-equations": "The solution to a system of equations is where the graphs intersect. Read it off the graph or use Desmos on the SAT. Free SAT math practice questions.",
 "slope-rate-of-change": "What slope means in an SAT word problem: the rate of change, with units, such as dollars per hour. How to interpret it, plus free SAT math practice.",
 "y-intercept-in-context": "What the y-intercept means in an SAT word problem: the starting value when x is zero. How to interpret it in context, plus free SAT math practice.",
 "linear-equation-from-two-points": "Write the equation of a line from two points on the SAT: find the slope, then the y-intercept. Worked steps, common slips, and free practice questions.",
 "linear-equation-point-slope": "Write a linear equation from a point and a slope on the SAT using point-slope form, then convert it. Worked steps and free SAT math practice questions.",
 "linear-models-from-context": "Turn an SAT word problem into a linear model: find the rate and the starting value, then write the equation. Worked examples and free practice.",
 "standard-to-slope-intercept-form": "Convert between standard form and slope-intercept form on the SAT, and read the slope and intercepts quickly. Worked steps and free practice questions.",
 "parallel-and-perpendicular-lines": "Parallel lines have equal slopes; perpendicular slopes are negative reciprocals. How the SAT tests this, worked examples, and free practice questions.",
 "translating-word-problems": "Translate SAT word problems into equations: key phrases, defining the variable, and the setup mistakes students make. Free SAT math practice questions.",
 "linear-word-problems": "Solve linear word problems on the SAT: set up the equation, solve it, and check the answer makes sense in context. Free SAT math practice questions.",
 "factoring-quadratics": "How to factor quadratic expressions on the SAT: common factors, trinomials, difference of squares, and when to use Desmos. Free SAT math practice.",
 "solving-quadratics-by-factoring": "Solve quadratic equations on the SAT by factoring and setting each factor to zero. When factoring works, when it does not, and free practice questions.",
 "completing-the-square": "Complete the square on the SAT to rewrite a quadratic in vertex form and find the vertex. Step-by-step method, common slips, and free practice questions.",
 "parabola-vertex-axis-of-symmetry": "Find the vertex and axis of symmetry of a parabola on the SAT, from vertex form or from the roots. Worked examples and free SAT math practice questions.",
 "zeros-of-quadratics": "What the zeros of a quadratic mean in an SAT word problem: where the quantity reaches zero. How to find and interpret them, plus free practice.",
 "polynomial-factors-and-zeros": "The link between factors and zeros of a polynomial on the SAT: if x minus a is a factor, a is a zero. Worked examples and free SAT math practice.",
 "polynomial-end-behavior": "Polynomial end behavior on the SAT: read it from the degree and the leading coefficient to match a graph. Worked examples and free practice questions.",
 "rational-equations": "Solve rational equations on the SAT: clear the fractions, solve, then check for extraneous solutions that make a denominator zero. Free SAT practice.",
 "linear-quadratic-systems": "Solve a system of a line and a parabola on the SAT by substitution or by graphing in Desmos, and count the intersections. Free SAT math practice.",
 "radical-equations": "Solve radical equations on the SAT: isolate the root, square both sides, then check for extraneous solutions. Worked steps and free SAT practice questions.",
 "exponent-rules": "The exponent rules the SAT tests: product, quotient, power, and zero exponent, with the mistakes students make most. Free SAT math practice questions.",
 "negative-and-fractional-exponents": "Negative and fractional exponents on the SAT: what they mean, how to convert to roots and reciprocals, and common slips. Free SAT math practice.",
 "function-composition": "Evaluate functions and compositions like f(g(x)) on the SAT: work from the inside out. Worked examples, common mistakes, and free practice questions.",
 "function-notation": "What f(x) means on the SAT, how to evaluate a function from a rule, table, or graph, and how to interpret it in context. Free SAT math practice.",
 "quadratic-models": "Interpret quadratic models in SAT word problems: the vertex as a maximum or minimum, the zeros, and the starting value. Free SAT math practice questions.",
 "exponential-growth-and-decay": "Exponential growth and decay on the SAT: the starting value, the growth factor, and percent change per period. Worked examples and free practice.",
 "ratios": "Solve ratio problems on the SAT: set up the ratio, scale it, and split a total into parts. Worked examples, common mistakes, and free SAT math practice.",
 "percent-increase-and-decrease": "Percent increase and decrease on the SAT: use a multiplier like 1.15 or 0.85 instead of two steps. Worked examples and free SAT math practice questions.",
 "reverse-percent-problems": "Reverse percent problems on the SAT: find the original amount before a percent change by dividing by the multiplier. Worked steps and free practice.",
 "successive-percent-changes": "Successive percent changes on the SAT: multiply the multipliers, never add the percents. Worked examples, common traps, and free SAT math practice.",
 "scatterplots": "Read scatterplots on the SAT: trends, associations, outliers, and estimating values from the graph. Worked examples and free SAT math practice questions.",
 "line-of-best-fit": "Interpret the line of best fit on the SAT: what its slope and intercept mean, and how to predict from it. Worked examples and free SAT math practice.",
 "mean-median-range": "Mean, median, and range on the SAT: how to find each, and how adding or removing a value changes them. Worked examples and free SAT math practice.",
 "standard-deviation": "Standard deviation on the SAT measures spread, not size. Compare data sets without calculating it, with worked examples and free SAT math practice.",
 "comparing-distributions": "Compare data distributions on the SAT using center, spread, and shape from dot plots, histograms, and box plots. Free SAT math practice questions.",
 "basic-probability": "Basic probability on the SAT: favorable outcomes over total outcomes, and reading probabilities from two-way tables. Free SAT math practice questions.",
 "compound-probability": "Compound probability on the SAT: when to multiply, when to add, and conditional probability from a table. Worked examples and free SAT math practice.",
 "area-and-perimeter": "Area and perimeter of rectangles, triangles, and composite shapes on the SAT, using the reference sheet well. Worked examples and free SAT math practice.",
 "pythagorean-theorem": "Use the Pythagorean theorem on the SAT to find a missing side of a right triangle, and spot common triples like 3-4-5. Free SAT math practice questions.",
 "special-right-triangles": "Special right triangles on the SAT: the 45-45-90 and 30-60-90 side ratios, and how to use them fast. Worked examples and free SAT math practice.",
 "triangle-similarity": "Similar triangles on the SAT: matching angles, proportional sides, and setting up the proportion correctly. Worked examples and free SAT math practice.",
 "circle-equations": "Circle equations on the SAT: find the center and radius, including by completing the square. Worked examples, common slips, and free SAT practice.",
 "distance-formula": "The distance formula on the SAT: find the distance between two points, and see how it comes from the Pythagorean theorem. Free SAT math practice.",
 "midpoint-formula": "The midpoint formula on the SAT: average the x-coordinates and the y-coordinates, or find a missing endpoint. Worked examples and free SAT practice.",
 "radians-and-degrees": "Convert between radians and degrees on the SAT, and find arc length with radian measure. Worked examples, common slips, and free SAT math practice.",
 "complementary-angle-trig": "Complementary angle trig on the SAT: sin of an angle equals cos of its complement. Worked examples, how the SAT tests it, and free SAT practice."
};
const WRITE = process.argv.includes("--write");
const esc = s => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let changed = 0;
for (const [slug, nw] of Object.entries(NEW)) {
  const p = path.join("sat-math", slug, "index.html");
  if (!fs.existsSync(p)) { console.log("MISSING", p); continue; }
  const s = fs.readFileSync(p, "utf8");
  const m = s.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  if (!m) { console.log("NO DESCRIPTION TAG", p); continue; }
  const old = 'content="' + m[1] + '"';
  const n = s.split(old).length - 1;
  const t = s.split(old).join('content="' + esc(nw) + '"');
  if (t !== s) {
    changed++;
    console.log(slug + ": " + n + " tags, now " + nw.length + " chars");
    if (WRITE) fs.writeFileSync(p, t, "utf8");
  }
}
console.log((WRITE ? "WROTE " : "DRY RUN, nothing written: ") + changed + " files");
