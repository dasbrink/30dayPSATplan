// ============================================================
//  psat_score.js   |   30daypsatplan.com
//
//  Converts a raw score out of 44 into an estimated PSAT math
//  score on the real 160 to 760 scale.
//
//  Load this BEFORE any day page script that calls it.
//  It defines convertToPSATScore() and PSAT_SCORE_LABEL.
// ============================================================

// ------------------------------------------------------------
//  WHY THIS TABLE LOOKS THE WAY IT DOES
//
//  1. The scale is 160 to 760, not 200 to 800. PSAT/NMSQT total
//     runs 320 to 1520, so each section runs 160 to 760.
//
//  2. The curve is steeper at the bottom than the top. A student
//     going from 2 correct to 6 correct moves further in scaled
//     points than one going from 38 to 42, because the scale
//     floors at 160 rather than 0. This matches how College
//     Board's own released conversions behave.
//
//  3. It is NOT shaded downward on purpose. The landing page
//     promises the estimate leans low, and it does, but that
//     comes from the question bank rather than from the table.
//     Our questions are drawn from the SAT bank, which runs
//     harder at the top end than the PSAT does. A student who
//     gets 30 right on harder questions would get more than 30
//     right on the real thing, so applying an honest PSAT curve
//     to a harder test already produces a low estimate.
//
//     Shading the table down as well would double count that
//     and make the number dishonestly pessimistic, which is its
//     own kind of lie. One source of conservatism, not two.
//
//  4. Chance check. Four choices means random guessing lands
//     near 9 raw once the student-produced questions are taken
//     into account, since those cannot be guessed. That maps to
//     350, which is about where a chance-level PSAT performance
//     actually sits. If this table returned 450 for a student
//     who guessed everything, it would be wrong.
// ------------------------------------------------------------

var PSAT_SCORE_LABEL = 'Estimated PSAT score';
var PSAT_SCORE_MIN = 160;
var PSAT_SCORE_MAX = 760;
var PSAT_TOTAL_QUESTIONS = 44;

// raw correct  ->  scaled score
var PSAT_SCALE_TABLE = [
  [44, 760], [43, 750], [42, 740], [41, 730], [40, 710],
  [39, 700], [38, 690], [37, 680], [36, 670], [35, 660],
  [34, 650], [33, 640], [32, 630], [31, 620], [30, 610],
  [29, 600], [28, 590], [27, 580], [26, 570], [25, 560],
  [24, 550], [23, 540], [22, 530], [21, 510], [20, 500],
  [19, 490], [18, 480], [17, 470], [16, 450], [15, 440],
  [14, 430], [13, 420], [12, 400], [11, 390], [10, 370],
  [9, 350], [8, 340], [7, 320], [6, 300], [5, 280],
  [4, 260], [3, 230], [2, 210], [1, 180], [0, 160]
];

/**
 * Raw correct out of 44 to an estimated PSAT math score.
 * Always returns a number between 160 and 760, in tens.
 */
function convertToPSATScore(rawScore) {
  var raw = Number(rawScore);
  if (!isFinite(raw)) return PSAT_SCORE_MIN;
  raw = Math.round(raw);
  if (raw > PSAT_TOTAL_QUESTIONS) raw = PSAT_TOTAL_QUESTIONS;
  if (raw < 0) raw = 0;

  for (var i = 0; i < PSAT_SCALE_TABLE.length; i++) {
    if (PSAT_SCALE_TABLE[i][0] <= raw) return PSAT_SCALE_TABLE[i][1];
  }
  return PSAT_SCORE_MIN;
}

/**
 * The sentence that must sit under every score shown to a
 * student. The landing page has already promised this, so it
 * is not optional decoration.
 */
function psatScoreCaveat() {
  return 'This is an estimate, not a score. The questions come from my SAT bank, ' +
         'which runs slightly harder at the top end than the PSAT does, so this ' +
         'number is more likely to sit below your real October score than above it.';
}

/**
 * A short version for tight spaces, such as a results card.
 */
function psatScoreCaveatShort() {
  return 'Estimate only. It tends to read low.';
}

// ------------------------------------------------------------
//  SELF CHECK
//  Runs once on load and complains in the console if the table
//  has been edited into something impossible. Costs nothing and
//  catches a bad hand edit before a student sees it.
// ------------------------------------------------------------
(function psatScaleSelfCheck() {
  var problems = [];

  if (PSAT_SCALE_TABLE.length !== PSAT_TOTAL_QUESTIONS + 1) {
    problems.push('Table should have ' + (PSAT_TOTAL_QUESTIONS + 1) +
                  ' rows, has ' + PSAT_SCALE_TABLE.length);
  }
  if (convertToPSATScore(44) !== PSAT_SCORE_MAX) {
    problems.push('A perfect raw score does not return ' + PSAT_SCORE_MAX);
  }
  if (convertToPSATScore(0) !== PSAT_SCORE_MIN) {
    problems.push('A zero raw score does not return ' + PSAT_SCORE_MIN);
  }
  for (var i = 1; i < PSAT_SCALE_TABLE.length; i++) {
    if (PSAT_SCALE_TABLE[i][1] >= PSAT_SCALE_TABLE[i - 1][1]) {
      problems.push('Table is not strictly decreasing at raw ' + PSAT_SCALE_TABLE[i][0]);
      break;
    }
  }
  if (problems.length) {
    console.error('[psat_score] Scale table is wrong:', problems);
  }
})();
