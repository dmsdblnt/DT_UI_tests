Feature("Presets");

var { presetTest } = require("../../../utils/wholeTests.js");

const filterPresets = {
  preset1: {
    Profit: { operator: "<=", value: 10 },
    ROI: { operator: "<=", value: 70 },
    Spent: { operator: ">=", value: 10 },
  },
  preset2: {
    Profit: { operator: ">=", value: 10 },
    ROI: { operator: ">=", value: 25 },
    Spent: { operator: ">=", value: 20 },
  },
};

let index = 1;

for (let presetName of Object.keys(filterPresets)) {
  Scenario(`ROI_preset_test_${presetName}`, async ({ I }) => {
    await I.login("andrashari@robust.digital", "qSdh#X35$m");
    await presetTest({
      I,
      link: 'a[href="/roi"]',
      presetObj: filterPresets[presetName],
      xPath: `(.//button[contains(., "preset")])[position()=${index}]`,
    });

    index++;
  });
}
