Feature("ROI table switchers");

Scenario("Table switcher test", async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');
  I.click('button[class="ant-btn doubleButton"]');

  const columnsData = await I.getSwitchers();

  //no column check
  await I.hideColumns({
    labels: columnsData["labels"],
    isColumnSwitcherTurnedOn: true,
  });
  columnsData["labels"].forEach((label) => {
    I.dontSee(label, "thead");
  });

  //some column check
  someLabels = ["Domain", "Avg CPC", "FB Costs"];
  await I.showColumns({ labels: someLabels });
  someLabels.forEach((label) => {
    I.see(label, "thead");
  });

  //some other column check
  someOtherLabels = ["ROI", "Visit Val.", "Profit", "Taboola"];
  // await I.hideColumns({I, labels:someLabels});
  await I.showColumns({ labels: someOtherLabels });
  someOtherLabels.forEach((label) => {
    I.see(label, "thead");
  });

  //all column check
  await I.showColumns({ labels: columnsData["labels"] });
  columnsData["labels"].forEach((elem) => {
    if (elem === "Intent Rev.") I.see(`Intent`, "thead");
    else I.see(`${elem}`, "thead");
  });
});
