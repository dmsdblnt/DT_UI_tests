Feature("ROI inner table sorter test");

Scenario("", async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');
  // I.click('button[class="ant-btn doubleButton"]');
  // I.click('button[data-cy="SubmitButton"]');
  I.click("div[class='ant-table-row-expand-icon ant-table-row-collapsed']");
  const campaignData = await I.getTableData({
    tableQuerySelector:
      "tr[class='ant-table-expanded-row ant-table-expanded-row-level-1']",
  });
  I.click('div[role="tab"]', "By Date");
  I.click('div[role="tab"]', "By Country");
  I.click('div[role="tab"]', "By Site");
  I.click('div[role="tab"]', "By Platform");
  I.click('div[role="tab"]', "By Ads");
  I.click('div[role="tab"]', "By Campaign");
  const campaignData2 = await I.getTableData({
    tableQuerySelector:
      "tr[class='ant-table-expanded-row ant-table-expanded-row-level-1']",
  });
  I.assertDeepEqual(campaignData, campaignData2);
  pause();
  // await I.hideColumns({
  //   labels: "Name",
  //   isColumnSwitcherTurnedOn: false,
  //   tableSwitcherXPath: "(.//div[./@role = 'tab'][contains(., 'By Campaign')])",
  //   tableQuerySelector:
  //     "tr[class='ant-table-expanded-row ant-table-expanded-row-level-1']",
  // });
  console.log(innerTableData);
  pause();
});
