var { operatorHandler } = require("./math.js");
const { filter } = require("lodash");

const filterByPreset = async function ({ presetObj, data }) {
  const result = data.filter((obj) => {
    let isOk = true;
    Object.keys(presetObj).forEach((columnName) => {
      const tableElement = parseFloat(
        obj[columnName].replace("%", "").replace("$", "").replace(",", "")
      );
      const operator = presetObj[columnName]["operator"];
      const filterTreshold = presetObj[columnName]["value"];
      if (operatorHandler(tableElement, operator, filterTreshold) === 1) {
        isOk = false;
      }
    });
    return isOk;
  });
  return result;
};

const sortWithGivenOperator = function ({ data, operator, label }) {
  const result = [...data];
  result.sort((a, b) => {
    const thisElement = parseFloat(
      a[label].replace("%", "").replace("$", "").replace(",", "")
    );
    const nextElement = parseFloat(
      b[label].replace("%", "").replace("$", "").replace(",", "")
    );
    let retVal = 0;
    if (isNaN(thisElement) === false && isNaN(nextElement) === false) {
      retVal = operatorHandler(thisElement, operator, nextElement);
    } else {
      retVal = operatorHandler(a[label], operator, b[label]);
    }
    return retVal;
  });
  return result;
};

const generateString = async function ({ length }) {
  let filterString = "";
  for (let i = 0; i < length; i++) {
    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 97
    );
    filterString += randomLetter;
  }
  return filterString;
};

const getMiddleValue = async function ({ data, label }) {
  //get the middle element of column to use as filter
  const dataSorted = [...data];
  await dataSorted.sort((a, b) => {
    const first = parseFloat(
      a[label].replace("%", "").replace("$", "").replace(",", "")
    );
    const second = parseFloat(
      b[label].replace("%", "").replace("$", "").replace(",", "")
    );
    return first <= second ? -1 : 1;
  });

  const middle = Math.round(dataSorted.length / 2);
  return parseFloat(
    dataSorted[middle][label].replace("%", "").replace("$", "").replace(",", "")
  );
};

const filterNumericColumn = async function ({
  I,
  data,
  label,
  xPathOfFilterIcon,
  operator,
  xPathOfResetButton,
}) {
  //get the middle element of column to use as filter
  const filterValue = await getMiddleValue({ data, label });

  //clear the filter if it's already used
  await I.findAndClickTheElement({
    xPath: xPathOfFilterIcon,
    label,
  });

  I.click(xPathOfResetButton);

  //click the filter
  await I.findAndClickTheElement({
    xPath: xPathOfFilterIcon,
    label,
  });

  I.wait(1);

  //find out which compare filter is selected
  const selectedOperator = await I.executeScript(() => {
    const div = document.querySelector(
      'div[class="ant-dropdown ant-dropdown-placement-bottomRight"]'
    );
    const op = div.querySelector(
      'label[class="ant-radio-button-wrapper ant-radio-button-wrapper-checked"]'
    ).innerText;
    return op;
  });

  //fill the filter
  I.fillField(
    locate(`div[class="ant-table-filter-dropdown"]`).find("input"),
    filterValue
  );

  //click the right element depends on the selected compare filter
  if (selectedOperator === operator) {
    I.pressKey("Enter");
  } else {
    I.click(
      locate("label")
        .withText(operator)
        .inside(
          locate('div[class="ant-dropdown ant-dropdown-placement-bottomRight"]')
        )
    );
  }

  //get table data after filter
  const dataFilteredByTable = await I.getTableData();
  //filter the original tableData
  const dataFilteredByCode = await data.filter((obj) => {
    const value = obj[label].replace("%", "").replace("$", "").replace(",", "");
    retVal = operatorHandler(value, operator, filterValue);
    return retVal === -1;
  });

  console.log(filterValue);
  dataFilteredByCode.forEach((obj) => {
    console.log(obj["ROI"]);
  });
  console.log("");
  dataFilteredByTable.forEach((obj) => {
    console.log(obj["ROI"]);
  });

  I.assertDeepEqual(dataFilteredByTable, dataFilteredByCode);
};

const resetFilter = async function ({
  I,
  data,
  xPathOfFilterIcon,
  label,
  xPathOfResetButton,
}) {
  await I.findAndClickTheElement({
    xPath: xPathOfFilterIcon,
    label,
  });

  I.click(xPathOfResetButton);

  const dataAfterReset = await I.getTableData();

  I.assertDeepEqual(data, dataAfterReset);
};

const filterStringColumn = async function ({
  data,
  I,
  label,
  xPathOfFilterIcon,
}) {
  //generate random string filter
  const filterString = await generateString({ length: 2 });

  //click the given column's filter
  await I.findAndClickTheElement({
    xPath: xPathOfFilterIcon,
    label,
  });

  //fill the filter
  I.fillField(
    locate('div[class="ant-table-filter-dropdown"]').find("input"),
    filterString
  );
  I.pressKey("Enter");

  //filter by the table
  const dataFilteredByTable = await I.getTableData();

  //copy data and filter
  const dataFilteredByCode = data.filter((obj) =>
    obj[label].includes(filterString)
  );

  I.assertDeepEqual(dataFilteredByCode, dataFilteredByTable);
};

const columnSortOnceByOperator = async function ({
  data,
  I,
  xPath,
  label,
  operator,
}) {
  //click the right column sorter
  await I.findAndClickTheElement({
    xPath,
    label,
  });

  //get table data after sort clicked
  const dataSortedByTable = await I.getTableData();

  //sort data
  const dataSortedByCode = await functions.sortWithGivenOperator({
    data,
    operator,
    label,
  });

  //check equality
  I.assertDeepEqual(dataSortedByCode, dataSortedByTable);
};

const generalFilterTest = async function ({
  I,
  page,
  filteredLabels,
  placeholder,
  filterText = "",
  XPathOfReset,
}) {
  I.click(page);
  await I.showColumns({ labels: filteredLabels });

  const data = await I.getTableData();

  if (filterText === "") {
    generateString({ length: 2 });
  }
  I.fillField(placeholder, filterText);

  const dataFilteredByTable = await I.getTableData();

  const dataFilteredByCode = data.filter((obj) => {
    let isOk = false;
    filteredLabels.forEach((label) => {
      if (obj[label].includes(filterText)) {
        isOk = true;
      }
    });
    return isOk;
  });

  console.log(dataFilteredByTable, dataFilteredByCode);
  pause();

  I.assertDeepEqual(dataFilteredByTable, dataFilteredByCode);

  I.click(XPathOfReset);

  const dataAfterReset = I.getTableData();

  I.assertDeepEqual(data, dataAfterReset);
};

module.exports = {
  filterByPreset,
  sortWithGivenOperator,
  generateString,
  getMiddleValue,
  filterNumericColumn,
  resetFilter,
  filterStringColumn,
  columnSortOnceByOperator,
  generalFilterTest,
};
