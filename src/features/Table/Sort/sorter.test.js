Feature("ROI table sorters");

var columnTests = require("../../../utils/wholeTests.js");
var helper = require("../../../utils/math.js");
var functions = require("../../../utils/functions.js");

var allLabels = [
  "Domain",
  "Profit",
  "Revenue",
  "Spent",
  "ROI",
  "Avg CPC",
  "Visit Val.",
  "Visit ROI",
  "Adsense",
  "Taboola Rev.",
  "Sulvo",
  "FB Costs",
  "Intent Rev.",
  "Taboola",
  "Taboola Sub",
  "Taboola Pub.",
  "Taboola Pub. Sub",
  "Tags",
];

BeforeSuite(async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
});
let i = 0;
for (let i = 0; i < allLabels.length - 1; i++) {
  //it can fail, because the order is not correct, but the elements are the same
  Scenario(`ROI columns sort test ${i + 1}`, async ({ I }) => {
    const label = allLabels[i];
    await columnTests.columnSortTest({
      page: 'a[href="/roi"]',
      I,
      xPath: `(.//div[@title="Sort"])`,
      label,
    });
  });
}
