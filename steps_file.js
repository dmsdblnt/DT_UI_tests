// in this file you can append custom step methods to 'I' object

module.exports = function () {
  return actor({
    login: function (email, password) {
      this.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
      this.fillField("username", email);
      this.fillField("password", password);
      this.pressKey("Enter");
      this.wait(15);
    },
    getTableData: async function ({ tableQuerySelector = "html" } = {}) {
      const data = await this.executeScript(
        ({ tableQuerySelector }) => {
          var columnNames = [];
          let data = [];
          const scope = document.querySelector(tableQuerySelector);
          console.log(scope);
          const tHead = scope.querySelector('thead[class="ant-table-thead"]');
          const tBodyRows = scope.querySelector(
            'tbody[class="ant-table-tbody"]'
          ).rows;
          const tHeadCells = tHead.rows.item(0).cells;
          //Get header cells
          if (tHeadCells !== undefined) {
            for (var i = 0; i < tHeadCells.length; i++) {
              if (
                tHeadCells.item(i) !== undefined &&
                tHeadCells.item(i).innerText !== undefined
              ) {
                columnNames.push(tHeadCells[i].innerText.trim());
              }
            }
          }
          columnNames = columnNames.filter((name) => name !== "");
          //Get body cells
          for (let i = 0; i < tBodyRows.length; i++) {
            var tBodyCells = tBodyRows.item(i).cells;
            const obj = {};
            const numberOfUnnamedCells = tBodyCells.length - columnNames.length;
            for (let j = numberOfUnnamedCells; j < tBodyCells.length; j++) {
              if (
                tBodyCells.item(j) !== undefined &&
                tBodyCells.item(j).innerText !== undefined
              ) {
                obj[columnNames[j - numberOfUnnamedCells]] = tBodyCells
                  .item(j)
                  .innerText.trim();
              }
            }
            data.push(obj);
          }
          data = data.filter((obj) => obj[columnNames[0]] !== "Total");
          console.log(data);
          return data;
        },
        { tableQuerySelector }
      );
      return data;
    },
    getSwitchers: async function () {
      const data = await this.executeScript(() => {
        let data = {};
        let labels = [];
        let unswitched = [];
        let switched = [];
        const divs = document.querySelectorAll(
          'div[class="ant-col ant-col-12"]'
        );
        divs.forEach((div) => {
          const button = div.querySelector("button");
          const label = div.querySelector("label").textContent;
          labels.push(label);
          if (button.checked === false) {
            unswitched.push(button.id);
          } else {
            switched.push(button.id);
          }
        });
        data["labels"] = labels;
        data["unswitched"] = unswitched;
        data["switched"] = switched;
        return data;
      });

      return data;
    },
    getHeaderData: async function ({ tableQuerySelector = "html" } = {}) {
      const data = await this.executeScript(
        ({ tableQuerySelector }) => {
          try {
            let columnNames = [];
            const scope = document.querySelector(tableQuerySelector);

            const tHeadCells = scope
              .querySelector('thead[class="ant-table-thead"]')
              .rows.item(0).cells;

            if (tHeadCells !== undefined) {
              for (var i = 0; i < tHeadCells.length; i++) {
                if (
                  tHeadCells.item(i) !== undefined &&
                  tHeadCells.item(i).innerText !== undefined
                ) {
                  columnNames.push(tHeadCells[i].innerText.trim());
                }
              }
            }
            columnNames = columnNames.filter((name) => name !== "");
            return columnNames;
          } catch (e) {
            console.log("No header1");
            return [];
          }
        },
        { tableQuerySelector }
      );
      return data;
    },
    showColumns: async function ({
      labels,
      isColumnSwitcherTurnedOn = false,
      tableXPath = "(.//div[./@role = 'tab'][contains(., 'Roi')])",
      tableQuerySelector = "html",
    }) {
      const labelsToShow = [];
      const visibleLabels = await this.getHeaderData({ tableQuerySelector });

      if (typeof labels === "string") {
        labels = [labels];
      }

      labels.forEach((label) => {
        if (visibleLabels.includes(label) === false) {
          labelsToShow.push(label);
        }
      });

      if (labelsToShow.length > 0) {
        if (isColumnSwitcherTurnedOn === false) {
          this.click('button[class="ant-btn doubleButton"]');
        }
        this.click(tableXPath);
        labelsToShow.forEach((label) => {
          this.click(`label[title="${label}"]`);
        });
        this.click('button[data-cy="SubmitButton"]');
      }
    },
    hideColumns: async function ({
      labels,
      isColumnSwitcherTurnedOn = false,
      tableSwitcherXPath = "(.//div[./@role = 'tab'][contains(., 'Roi')])",
      tableQuerySelector = "html",
    }) {
      const labelsToHide = [];
      const visibleLabels = await this.getHeaderData({ tableQuerySelector });

      if (typeof labels === "string") {
        labels = [labels];
      }

      labels.forEach((label) => {
        if (visibleLabels.includes(label)) {
          labelsToHide.push(label);
        }
      });

      if (labelsToHide.length > 0) {
        if (isColumnSwitcherTurnedOn === false) {
          this.click('button[class="ant-btn doubleButton"]');
        }
        this.click(tableSwitcherXPath);
        labelsToHide.forEach((label) => {
          this.click(`label[title="${label}"]`);
        });
        this.click('button[data-cy="SubmitButton"]');
      }
    },
    findAndClickTheElement: async function ({ xPath, label }) {
      let place = 1;
      const visibleLabels = await this.getHeaderData();
      await visibleLabels.forEach((el) => {
        if (el === label) {
          this.click(xPath + `[position()=${place}]`);
        }
        place++;
      });
    },
  });
};

// inside step_definitions
Before(() => {});
