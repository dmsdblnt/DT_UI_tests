var functions = require("./functions.js");

const presetTest = async function ({ I, link, presetObj, xPath }) {
  I.click(link);
  const data = await I.getTableData();

  I.click(xPath);

  const dataFilteredByPage = await I.getTableData();

  const dataFilteredByCode = await functions.filterByPreset({
    presetObj,
    data,
  });

  I.assertDeepEqual(dataFilteredByCode, dataFilteredByPage);
};

const columnSortTest = async function ({ I, page, xPath, label }) {
  I.click(page);

  //get data
  const data = await I.getTableData();

  //sort increment
  await functions.columnSortOnceByOperator({
    data,
    I,
    xPath,
    label,
    operator: "<",
  });

  //sort decrement
  await functions.columnSortOnceByOperator({
    data,
    I,
    xPath,
    label,
    operator: ">",
  });

  //click the right column sorter 3rd time to reset
  await I.findAndClickTheElement({
    xPath,
    label,
  });

  //get data after the reset
  const dataAfterReset = await I.getTableData();

  I.assertDeepEqual(data, dataAfterReset);
};

const columnFilterTest = async function ({
  I,
  xPathOfFilterIcon,
  page,
  label,
  xPathOfResetButton,
}) {
  I.click(page);

  //set the given column switcher on
  await I.showColumns({ labels: label });

  //get table data
  const data = await I.getTableData();

  //check if column contains string or float elements
  const isString = await isNaN(
    parseFloat(data[0][label].replace("%", "").replace("$", ""))
  );

  if (isString) {
    await functions.filterStringColumn({
      data,
      I,
      label,
      xPathOfFilterIcon,
    });

    await functions.resetFilter({
      I,
      data,
      xPathOfFilterIcon,
      label,
      xPathOfResetButton,
    });
  } else {
    await functions.filterNumericColumn({
      I,
      data,
      label,
      xPathOfFilterIcon,
      xPathOfResetButton,
      operator: "<=",
    });

    await functions.filterNumericColumn({
      I,
      data,
      label,
      xPathOfFilterIcon,
      xPathOfResetButton,
      operator: ">=",
    });

    await functions.resetFilter({
      I,
      data,
      xPathOfFilterIcon,
      label,
      xPathOfResetButton,
    });
  }
};

module.exports = {
  presetTest,
  columnSortTest,
  columnFilterTest,
};
