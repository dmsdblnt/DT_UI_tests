Feature("ROI table filters");

var { columnFilterTest } = require("../../../utils/wholeTests.js");
var { generalFilterTest } = require("../../../utils/functions.js");
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

//only Taboola and Tags are filtered
//it can fail, because the order is not correct, but the elements are the same
Scenario("Taboola account or tags filter", async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  await generalFilterTest({
    I: I,
    page: 'a[href="/roi"]',
    filteredLabels: ["Taboola", "Tags"],
    placeholder: "taboola account or tags",
    filterText: "ed",
    XPathOfReset: './/button[@class="ant-btn"][contains(.,"Reset")]',
  });
});

let label = "ROI";

//it can fail, because the order is not correct, but the elements are the same
// for (let label of allLabels) {
Scenario(`Column ${label} filter test`, async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");

  await columnFilterTest({
    I,
    xPathOfFilterIcon: '(.//i[@Title="Filter menu"])',
    page: 'a[href="/roi"]',
    label,
    xPathOfResetButton:
      './/button[contains(., "Reset")][ancestor::div[./@class = "ant-dropdown ant-dropdown-placement-bottomRight"]]',
  });
});
// }

Scenario("datumvalaszto", async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');
  const yesterday = await I.getTableData();
  I.click('div[class="ant-select-selection__rendered"]');
  I.click("Last 7 days");
  const last7Days = await I.getTableData();
  I.click('div[class="ant-select-selection__rendered"]');
  I.click("Last 30 days");
  const last30Days = await I.getTableData();
  I.click('div[class="ant-select-selection__rendered"]');
  I.click("Yesterday");
  const yesterday2 = await I.getTableData();

  I.assertNotDeepEqual(yesterday, last7Days);
  I.assertNotDeepEqual(yesterday, last30Days);
  I.assertNotDeepEqual(last30Days, last7Days);
  I.assertDeepEqual(yesterday, yesterday2);
});

// div[class="ant-dropdown ant-dropdown-placement-bottomRight"]
