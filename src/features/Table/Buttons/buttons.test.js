Feature("New tests");

var _ = require("lodash");

async function booleanColumnCheck({ I }) {
  const isAllCircles = await I.executeScript(() => {
    const allCells = document.querySelectorAll("td > i");
    const closeCircles = document.querySelectorAll(
      "i[aria-label='icon: close-circle']"
    );
    const checkCircles = document.querySelectorAll(
      'i[aria-label="icon: check-circle"]'
    );

    return allCells.length === closeCircles.length + checkCircles.length;
  });
  console.log(isAllCircles);
}

async function everyOtherColumnCheck({ I, cell }) {}

//export scenario

Scenario("Export csv file", async (I) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');

  I.handleDownloads();
  I.click("Export");

  const header = I.getHeaderData();
  const body = I.getTableData();
});

//periodic render 1 cell scenario

Scenario("Periodic render test", async (I) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');

  await I.hideColumns({
    labels: [
      "Domain",
      "Taboola",
      "Taboola Sub",
      "Taboola Pub.",
      "Taboola Pub. Sub",
      "Tags",
    ],
  });
  await I.showColumns({
    labels: [
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
    ],
  });
  //hide: Domain, Taboola, Taboola Sub, Taboola Pub. Taboola Pub. Sub, Tags
  //show: Profit, Revenue, Spent, ROI, Avg CPC, Visit Val., Visit ROI, Adsense, Taboola Rev., Sulvo, FB Costs, Intent Rev.

  const a = await I.getHeaderData();
  const numberOfColumns = a.length;

  let row = 5;
  let column = 3;

  I.click(locate("td>span").at((row - 1) * numberOfColumns + column));

  const beforePeriodic = await I.executeScript(
    ({ row, column, numberOfColumns }) => {
      const cellValue = document
        .evaluate(
          `(.//td/span)[position()=${(row - 1) * numberOfColumns + column}]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        )
        .singleNodeValue.innerText.trim();
      const popupElementValues = document
        .querySelector('div[class="ant-popover-inner-content"]')
        .innerText.split("\n");

      const obj = {
        a: cellValue,
        b: popupElementValues[0],
        c: popupElementValues[1],
      };
      return obj;
    },
    { row, column, numberOfColumns }
  );

  const isColored = await I.executeScript(() => {
    const div = document
      .querySelector('div[class="ant-popover-inner-content"]')
      .querySelectorAll("div")[2];
    const value = parseFloat(div.innerText.replace("%", ""));
    const color = div.style.color;
    if (
      (value > 0 && color === "green") ||
      (value < 0 && color === "red") ||
      (value === 0 && color === "")
    ) {
      return true;
    }
    return false;
  });

  I.assertTrue(isColored);

  I.click("button[class='ant-switch']");

  const afterPeriodic = await I.executeScript(
    ({ row, column, numberOfColumns }) => {
      const allValues = document.evaluate(
        `(.//td/div)[position()=${
          (row - 1) * (numberOfColumns + 1) + column + 1
        }]`,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue.innerText;
      const a = allValues.split("|");
      const b = a[1].split("\n");
      // b[0] is a prop, a[0] is b prop, because the second value is the current value in the div
      const obj = { a: b[0].trim(), b: a[0].trim(), c: b[1].trim() };
      return obj;
    },
    { row, column, numberOfColumns }
  );

  const isColoredAfterPeriodic = await I.executeScript(
    ({ row, column, numberOfColumns }) => {
      const div = document
        .evaluate(
          `(.//td/div)[position()=${
            (row - 1) * (numberOfColumns + 1) + column + 1
          }]`,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        )
        .singleNodeValue.querySelector("div");
      const value = parseFloat(div.innerText.replace("%", ""));
      const color = div.style.color;

      if (
        (value > 0 && color === "green") ||
        (value < 0 && color === "red") ||
        (value === 0 && color === "black")
      ) {
        return true;
      }
      return false;
    },
    { row, column, numberOfColumns }
  );

  I.assertTrue(isColoredAfterPeriodic);

  console.log(beforePeriodic, afterPeriodic);

  pause();

  I.assertDeepEqual(beforePeriodic, afterPeriodic);
});

//request test not working

Scenario("Request test", async (I) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');
  I.wait(3);
  I.startSpyTheResources();
  I.click('button[class="ant-btn ant-btn-icon-only"]');
  I.checkTheNumberOfResourceType("fetch", 1);
  pause();
});

//Navigation test half working

Scenario("Navigation test", async (I) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.seeInCurrentUrl("https://alpha.dashboard.robust.digital/");

  const menuArray = ["ROI", "Campaigns", "Users", "Domains", "Automations"];

  I.click(`a[href="/roi"]`);
  I.moveCursorTo(locate("li").withText("Automations"), 100, 0);
  I.wait(2);
  I.moveCursorTo(locate("div").withText("Tools").at(2));

  pause();

  for (let i = 0; i < menuArray.length; i++) {
    I.click(`a[href="/${_.kebabCase(menuArray[i])}"]`);
    I.seeInCurrentUrl(
      `https://alpha.dashboard.robust.digital/${_.kebabCase(menuArray[i])}`
    );
  }
  //ToDo: is it selected
  const extendableMenu = ["ReportRules", "API Management", "Tests", "Features"];
  for (let i = 0; i < extendableMenu.length; i++) {
    I.moveCursorTo(locate("li").withText("Automations"), 100, 0);
    // I.moveCursorTo(locate("div").withText("Tools").at(2));
    I.click(locate(`a[href="/${_.kebabCase(extendableMenu[i])}"]`).at(2));
    I.seeInCurrentUrl(
      `https://alpha.dashboard.robust.digital/${_.kebabCase(extendableMenu[i])}`
    );
  }
});

//config test

Scenario("column config test", async (I) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.wait(10);
  // I.click('a[href="/roi"]');
  // I.wait(5);
  // I.click('button[class="ant-btn doubleButton"]');

  // const labels = I.getSwitchers();

  // I.wait(2);

  // I.click('button[data-cy="SubmitButton"]');

  // const roiData = await I.getTableData();

  // I.click("div[class='ant-table-row-expand-icon ant-table-row-collapsed']");

  // I.wait(10);

  // let data = await I.getTableData({
  //   tableQuerySelector:
  //     "tr[class='ant-table-expanded-row ant-table-expanded-row-level-1']",
  // });
  // console.log(roiData);
  // console.log(data);

  I.click('a[href="/domains"]');
  // data = await I.getTableData();
  // console.log(data);
  booleanColumnCheck({ I });

  pause();
});

const domainColumns = [
  {
    name: "profit",
    type: "number/money",
    periodic: true,
    filter: "compare",
  },
  {
    name: "revenue",
    type: "number/money",
    periodic: true,
    filter: "compare",
  },
  {
    name: "spent",
    type: "number/money",
    periodic: true,
    filter: "compare",
  },
  {
    name: "roi",
    type: "number/percent",
    periodic: true,
    filter: "compare",
    formula: "profit * 100 / spent",
    className: "roi-column",
  },
  {
    name: "avg_cpc",
    type: "number/money",
    decimals: 3,
    periodic: true,
    filter: "compare",
  },
  {
    name: "visit_value",
    type: "number/money",
    decimals: 4,
    periodic: true,
    filter: "compare",
  },
  {
    name: "visit_roi",
    type: "number/percent",
    periodic: true,
    filter: "compare",
  },
  {
    name: "adsense_revenue",
    title: "Adsense",
    type: "number/money",
    periodic: true,
    filter: "compare",
  },
  {
    name: "taboola_revenue",
    type: "number/money",
    periodic: true,
    width: 140,
    filter: "compare",
  },
  {
    name: "sulvo_revenue",
    title: "Sulvo",
    type: "number/money",
    periodic: true,
    width: 100,
    filter: "compare",
  },
  {
    name: "fb_costs",
    type: "number/money",
    periodic: true,
    filter: "compare",
  },
  {
    name: "intent_revenue",
    title: "Intent",
    type: "number/money",
    periodic: true,
    width: 140,
    filter: "compare",
  },
];

const accountColumns = [
  {
    name: "taboola_account",
    width: 200,
    type: "string",
    filter: "text",
  },
  {
    name: "taboola_sub_account",
    type: "string",
    filter: "text",
    width: 200,
  },
  {
    name: "taboola_publisher_account",
    type: "string",
    filter: "text",
    width: 200,
  },
  {
    name: "taboola_publisher_sub_account",
    type: "string",
    filter: "text",
    width: 200,
  },
  {
    name: "tags",
    type: "multiple",
    width: 180,
    sorter: null,
  },
];

const metricsColumns = [
  {
    name: "profit",
    type: "number/money",
    filter: "compare",
  },
  {
    name: "spent",
    type: "number/money",
    filter: "compare",
  },
  {
    name: "roi",
    type: "number/percent",
    filter: "compare",
    className: "roi-column",
  },
  {
    name: "open_mail_revenue",
    title: "OM Rev.",
    type: "number/money",
    width: 150,
    filter: "compare",
  },
  {
    name: "open_mail_effective_visit_value",
    title: "OM Eff. VV",
    type: "number/money",
    width: 120,
    decimals: 4,
    filter: "compare",
  },
  {
    name: "profit_without_estimated_sulvo",
    title: "Profit withOUT Sulvo",
    type: "number/money",
    width: 200,
    filter: "compare",
  },
  {
    name: "sulvo_projected",
    title: "Sulvo Pro.",
    type: "number/money",
    width: 120,
    filter: "compare",
  },
  {
    name: "sulvo_revenue",
    type: "number/money",
    width: 120,
    filter: "compare",
  },
  {
    name: "sulvo_revenue_ratio",
    title: "Ratio",
    width: 80,
    type: "number",
  },
  {
    name: "sulvo_visit_value",
    title: "Su VV",
    type: "number/money",
    width: 90,
    decimals: 4,
    filter: "compare",
  },
  {
    name: "sulvo_effective_visit_value",
    title: "Su Eff VV",
    type: "number/money",
    width: 100,
    decimals: 4,
    filter: "compare",
  },
  {
    name: "adsense_visit_value",
    title: "Adsense VV",
    type: "number/money",
    width: 130,
    decimals: 4,
    filter: "compare",
  },
  {
    name: "adsense_revenue",
    title: "Adsense",
    type: "number/money",
    filter: "compare",
  },
  {
    name: "avg_cpc",
    type: "number/money",
    decimals: 4,
    filter: "compare",
  },
  {
    name: "visit_value",
    type: "number/money",
    decimals: 4,
    filter: "compare",
  },
  {
    name: "visit_roi",
    type: "number/percent",
    filter: "compare",
  },
  {
    name: "set20cpc",
    type: "number/money",
    decimals: 3,
    filter: "compare",
    width: 130,
  },
  {
    name: "set30cpc",
    type: "number/money",
    decimals: 3,
    filter: "compare",
    width: 130,
  },
  {
    name: "set40cpc",
    type: "number/money",
    decimals: 3,
    filter: "compare",
    width: 130,
  },
  {
    name: "set50cpc",
    type: "number/money",
    decimals: 3,
    filter: "compare",
    width: 130,
  },
  {
    name: "clicks",
    type: "number",
    decimals: 0,
    filter: "compare",
  },
  {
    name: "discrepancy",
    type: "number/percent",
    filter: "compare",
    width: 130,
  },
  {
    name: "sessions",
    type: "number",
    decimals: 0,
    filter: "compare",
    width: 100,
  },
  {
    name: "impressions",
    type: "number",
    decimals: 0,
    filter: "compare",
    width: 130,
  },
  {
    name: "cpm",
    type: "number/money",
    filter: "compare",
  },
];

const editableColumns = [
  {
    name: "status",
    type: "play/pause",
    isEditable: true,
    align: "center",
    width: 50,
  },
  {
    name: "Bid",
    type: "all",
    isEditable: true,
    width: 60,
  },
  {
    name: "adjustable_cpc",
    title: "CPC",
    type: "number/money/optimization",
    decimals: 3,
    filter: "compare",
    isEditable: true,
    width: 80,
  },
  {
    name: "daily_cap",
    title: "Cap",
    //TODO: make better typing
    type: "number/money/optimization",
    decimals: 0,
    filter: "compare",
    isEditable: true,
    width: 80,
  },
];

const defaultDomainDataIndexes = [
  "profit",
  "revenue",
  "spent",
  "roi",
  "avg_cpc",
  "adsense_revenue",
  "taboola_revenue",
  "sulvo_revenue",
];

const defaultMetricsDataIndexes = [
  "profit",
  "adsense_revenue",
  "spent",
  "roi",
  "avg_cpc",
];

const defaultEditableDataIndexes = ["status", "adjustable_cpc", "daily_cap"];

// const dataTables = {
//   modules: {
//     RoiByDomains: {
//       dataTables: {
//         roi: {
//           entity: "domain",
//           rowKey: "domain",
//           columns: [
//             {
//               name: "domain",
//               type: "string/externalLink",
//               filter: "text",
//               width: 233,
//               align: "left",
//               copyable: true,
//             },
//           ]
//             .concat(domainColumns)
//             .concat(accountColumns),
//           defaultDataIndexes: ["domain"].concat(defaultDomainDataIndexes),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["taboola_account", "tags"],
//           needTotal: true,
//         },
//         byDate: {
//           rowKey: "date",
//           columns: [{ name: "date", type: "date", align: "left" }].concat(
//             domainColumns
//           ),
//           defaultDataIndexes: ["date"].concat(defaultDomainDataIndexes),
//           defaultSort: { field: "date", direction: "descend" },
//           filterFields: false,
//           needTotal: false,
//           iconComponent: CalendarIcon,
//         },
//         byCampaign: {
//           entity: "campaign",
//           rowKey: "name",
//           columns: [
//             {
//               name: "name",
//               copyable: true,
//               type: "string/internalLink",
//               align: "left",
//               width: 233,
//               fixed: "left",
//             },
//           ]
//             .concat(editableColumns)
//             .concat(periodicMetricsColumns),
//           defaultDataIndexes: ["name"]
//             .concat(defaultEditableDataIndexes)
//             .concat(defaultMetricsDataIndexes),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["id", "name"],
//           needTotal: true,
//           iconComponent: CampaignIcon,
//         },
//         byCountry: {
//           entity: "country",
//           rowKey: "name",
//           columns: [
//             { name: "name", type: "string", align: "left", width: 120 },
//             { name: "country_code", type: "string", width: 60 },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["name", "country_code"].concat(
//             defaultMetricsDataIndexes
//           ),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name", "country_code"],
//           needTotal: true,
//           iconComponent: EarthIcon,
//         },
//         bySite: {
//           entity: "site",
//           rowKey: "name",
//           columns: [
//             {
//               name: "name",
//               copyable: true,
//               type: "string",
//               align: "left",
//               width: 200,
//             } /*{
//                             name: "actions",
//                             type: "play/pause",
//                             align: "center",
//                             sorter: null,
//                             dataIndexSwitch: false
//                         },*/,
//             {
//               name: "site_id",
//               type: "string",
//               width: 90,
//               copyable: true,
//               sorter: null,
//             },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["name", "site_id"].concat(
//             defaultMetricsDataIndexes
//           ),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name", "site_id"],
//           needTotal: true,
//           iconComponent: WebsiteIcon,
//         },
//         byPlatform: {
//           entity: "platform",
//           rowKey: "name",
//           columns: [
//             { name: "name", type: "string", align: "left", width: 100 },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["name"].concat(defaultMetricsDataIndexes),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name"],
//           needTotal: true,
//           iconComponent: DevicesIcon,
//         },
//         byAds: {
//           entity: "ad",
//           rowKey: "name",
//           columns: [
//             {
//               name: "thumbnail_url",
//               type: "image",
//               sorter: null,
//               align: "center",
//             },
//             {
//               name: "item_name",
//               type: "string/externalLink",
//               url: "url",
//               align: "left",
//               width: 150,
//             } /*{
//                             name: "actions",
//                             type: "play/pause",
//                             align: "center",
//                             sorter: null,
//                             dataIndexSwitch: false
//                         },*/,
//             { name: "id", type: "string", sorter: null },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["thumbnail_url", "item_name", "id"].concat(
//             defaultMetricsDataIndexes
//           ),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name", "item_name", "id"],
//           needTotal: true,
//           iconComponent: AdsIcon,
//         },
//       },
//     },
//     RoiByCampaigns: {
//       dataTables: {
//         campaigns: {
//           entity: "campaign",
//           rowKey: "id",
//           columns: [
//             {
//               name: "name",
//               type: "string/internalLink",
//               copyable: true,
//               align: "left",
//               width: 200,
//             },
//             { name: "id", title: "Campaign ID", type: "string", width: 120 },
//             { name: "domain", type: "string" },
//             { name: "createdAt", type: "timestamp", width: 130 },
//           ].concat(metricsColumns),
//           //.concat([{ name: 'createdAt', type: 'timestamp', width: 130 }]),
//           defaultDataIndexes: ["name", "id"].concat(
//             defaultMetricsDataIndexes
//           ) /*{
//               name: "actions",
//               type: "play/pause",
//               align: "center",
//               sorter: null,
//               dataIndexSwitch: false
//           },*/,
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: [
//             "name",
//             "id",
//             "domain",
//             "sulvoRevenueAccount",
//             "analyticsViewId",
//             "taboolaSpendingAccount",
//             "taboolaSpendingSubAccount",
//             "taboolaRevenueAccount",
//             "taboolaRevenueSubAccount",
//             "ezoicRevenueAccount",
//           ],
//           needTotal: true,
//         } /*
//                 byDate: {
//                     entity: "day",
//                     rowKey: "date",
//                     columns: [
//                         {
//                             name: "date",
//                             type: "date"
//                         }
//                     ].concat(metricsColumns),
//                     defaultDataIndexes: ["date"]
//                         .concat(defaultMetricsDataIndexes),
//                     defaultSort: {
//                         field: "date",
//                         direction: "descend"
//                     },
//                     filterFields: false,
//                     needTotal: false,
//                     iconComponent: CalendarIcon
//                 },
//                 byDomain: {
//                     rowKey: "domain",
//                     columns: [
//                         {
//                             name: "domain",
//                             type: "string/externalLink",
//                             width: 233
//                         },
//                     ].concat(domainColumns),
//                     defaultDataIndexes: ["domain"]
//                         .concat(defaultDomainDataIndexes),
//                     defaultSort: {
//                         field: "domain",
//                         direction: "ascend"
//                     },
//                     filterFields: ["domain"],
//                     needTotal: true,
//                     iconComponent: WebsiteIcon
//                 },*/,
//         byCountry: {
//           entity: "country",
//           rowKey: "name",
//           columns: [
//             { name: "name", type: "string", align: "left", width: 120 },
//             { name: "country_code", type: "string", width: 60 },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["name", "country_code"].concat(
//             defaultMetricsDataIndexes
//           ),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name", "country_code"],
//           needTotal: true,
//           iconComponent: EarthIcon,
//         },
//         bySite: {
//           entity: "site",
//           rowKey: "name",
//           columns: [
//             {
//               name: "name",
//               copyable: true,
//               type: "string",
//               align: "left",
//               width: 200,
//             } /*{
//                             name: "actions",
//                             type: "play/pause",
//                             align: "center",
//                             sorter: null,
//                             dataIndexSwitch: false
//                         },*/,
//             { name: "site_id", type: "string", width: 90, sorter: null },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["name", "site_id"].concat(
//             defaultMetricsDataIndexes
//           ),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name", "site_id"],
//           needTotal: true,
//           iconComponent: WebsiteIcon,
//         },
//         byPlatform: {
//           entity: "platform",
//           rowKey: "name",
//           columns: [
//             { name: "name", type: "string", align: "left", width: 100 },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["name"].concat(defaultMetricsDataIndexes),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name"],
//           needTotal: true,
//           iconComponent: DevicesIcon,
//         },
//         byAds: {
//           entity: "ad",
//           rowKey: "name",
//           columns: [
//             {
//               name: "thumbnail_url",
//               type: "image",
//               sorter: null,
//               align: "center",
//             },
//             {
//               name: "item_name",
//               type: "string/externalLink",
//               align: "left",
//               width: 150,
//             } /*{
//                             name: "actions",
//                             type: "play/pause",
//                             align: "center",
//                             sorter: null,
//                             dataIndexSwitch: false
//                         },*/,
//             { name: "id", type: "string", sorter: null },
//           ].concat(metricsColumns),
//           defaultDataIndexes: ["thumbnail_url", "item_name", "id"].concat(
//             defaultMetricsDataIndexes
//           ),
//           defaultSort: { field: "spent", direction: "descend" },
//           filterFields: ["name", "item_name", "id"],
//           needTotal: true,
//           iconComponent: AdsIcon,
//         },
//       },
//     },
//     Users: {
//       entity: "user",
//       dataTables: {
//         users: {
//           entity: "user",
//           rowKey: "username",
//           columns: [
//             {
//               name: "avatar",
//               type: "image/avatar",
//               width: 50,
//               align: "center",
//               sorter: null,
//             },
//             { name: "name", type: "string", align: "left", width: 150 },
//             { name: "phone", type: "string/phone", sorter: null },
//             { name: "username", type: "string/email", width: 200 },
//             {
//               name: "super_user",
//               title: "Is admin?",
//               type: "boolean",
//               align: "center",
//               width: 100,
//             },
//             {
//               name: "location",
//               type: "string",
//               defaultValue: "Private IP",
//               sorter: null,
//             },
//             { name: "created_at", type: "date", width: 200 },
//             { name: "accessed_at", type: "date", width: "undefined" },
//           ],
//           defaultDataIndexes: [
//             "avatar",
//             "name",
//             "phone",
//             "username",
//             "super_user",
//             "location",
//             "created_at",
//             "accessed_at",
//           ],
//           defaultSort: { field: "accessed_at", direction: "descend" },
//           filterFields: ["name", "username", "email"],
//           needTotal: false,
//         },
//       },
//     },
//     Domains: {
//       entity: "domain",
//       dataTables: {
//         domains: {
//           entity: "domain",
//           rowKey: "name",
//           columns: [
//             {
//               name: "name",
//               type: "string/externalLink",
//               align: "left",
//               width: 233,
//             },
//             {
//               name: "active",
//               title: "Is active?",
//               type: "boolean",
//               align: "center",
//               width: 100,
//             },
//             { name: "google_account", type: "string", width: 80 },
//             { name: "google_view_id", type: "string", width: 120 },
//             { name: "taboola_account", type: "string" },
//             { name: "taboola_sub_account", type: "string", width: 200 },
//             { name: "taboola_publisher_account", type: "string", width: 200 },
//             {
//               name: "taboola_publisher_sub_account",
//               type: "string",
//               width: 200,
//             },
//             { name: "tags", type: "multiple", width: 150, sorter: null },
//           ],
//           defaultDataIndexes: [
//             "name",
//             "active",
//             "google_account",
//             "google_view_id",
//             "taboola_account",
//             "taboola_sub_account",
//             "taboola_publisher_account",
//             "taboola_publisher_sub_account",
//             "tags",
//           ],
//           defaultSort: { field: "active", direction: "descend" },
//           filterFields: ["name", "taboola_account", "tags"],
//           needTotal: false,
//         },
//       },
//     },
//     Domains2: {
//       entity: "domain",
//       dataTables: {
//         domains: {
//           entity: "domain",
//           rowKey: "name",
//           columns: [
//             {
//               name: "name",
//               type: "string/externalLink",
//               align: "left",
//               width: 233,
//             },
//             {
//               name: "isActive",
//               title: "Is active?",
//               type: "boolean",
//               align: "center",
//               width: 100,
//             },
//             { name: "googleAccount", type: "string", width: 80 },
//             { name: "viewId", type: "string", width: 120 },
//             {
//               name: "taboolaAccounts",
//               title: "Taboola Accounts",
//               type: "tree",
//               isEditable: true,
//             },
//             { name: "tags", type: "multiple", width: 150, sorter: null },
//             { name: "createdAt", type: "timestamp", width: 130 },
//             { name: "updatedAt", type: "timestamp", width: 150 },
//           ],
//           defaultDataIndexes: [
//             "name",
//             "active",
//             "google_account",
//             "google_view_id",
//             "taboola_account",
//             "taboola_sub_account",
//             "taboola_publisher_account",
//             "taboola_publisher_sub_account",
//             "tags",
//           ],
//           defaultSort: { field: "isActive", direction: "descend" },
//           filterFields: ["name", "tags"],
//           needTotal: false,
//         },
//       },
//     },
//     Automations: {
//       entity: "automationRule",
//       service: "Automation",
//       endpoint: "runAutomations",
//       dataTables: {
//         automationRules: {
//           entity: "automationRule",
//           rowKey: "id",
//           columns: [
//             {
//               name: "domain",
//               type: "string/externalLink",
//               align: "left",
//               width: 233,
//             },
//             { name: "recordId", type: "string", width: 100 },
//             { name: "recordName", type: "string", width: 233 },
//             { name: "authorId", type: "string", width: 100 },
//             { name: "authorName", type: "string", width: 100 },
//             { name: "taboolaAccount", type: "string", width: 150 },
//             {
//               name: "action.field",
//               title: "modifiedField",
//               type: "string/dotNotation/titlecase",
//               width: 200,
//             },
//             {
//               name: "action.value",
//               title: "actionValue",
//               isEditable: true,
//               type: "number/crud",
//               width: 100,
//             },
//             {
//               name: "status",
//               type: "boolean",
//               isEditable: true,
//               width: 70,
//               align: "center",
//             },
//             { name: "createdAt", type: "timestamp", width: 130 },
//             { name: "updatedAt", type: "timestamp", width: 150 },
//             {
//               name: "lastRun",
//               title: "Last Run",
//               type: "timestamp/humanized/colorized",
//               width: 150,
//             },
//             {
//               name: "frequency",
//               type: "number/crud",
//               unit: "minutes",
//               decimals: 0,
//               isEditable: true,
//             },
//             { name: "health", type: "boolean", width: 80, align: "center" },
//             { name: "actions", title: "Actions", type: "actions", width: 100 },
//           ],
//           defaultDataIndexes: [
//             "domain",
//             "recordId",
//             "recordName",
//             "authorId",
//             "authorName",
//             "taboolaAccount",
//             "action.field",
//             "action.value",
//             "status",
//             "createdAt",
//             "updatedAt",
//             "lastRun",
//             "frequency",
//             "health",
//             "actions",
//           ],
//           defaultSort: { field: "status", direction: "descend" },
//           filterFields: [
//             "id",
//             "recordId",
//             "recordName",
//             "domain",
//             "taboolaAccount",
//           ],
//           exportable: false,
//           needTotal: false,
//         },
//       },
//     },
//     ReportRules: {
//       entity: "reportRule",
//       service: "Reporting",
//       endpoint: "runReportGeneration",
//       dataTables: {
//         reportRules: {
//           entity: "reportRule",
//           rowKey: "id",
//           columns: [
//             {
//               name: "domain",
//               type: "string/externalLink",
//               align: "left",
//               width: 233,
//             },
//             { name: "provider", type: "string", width: 120 },
//             { name: "account", type: "string", width: 120 },
//             { name: "subAccount", type: "string", width: 120 },
//             { name: "type", type: "string", width: 120 },
//             {
//               name: "status",
//               type: "boolean",
//               isEditable: true,
//               width: 70,
//               align: "center",
//             },
//             { name: "createdAt", type: "timestamp", width: 130 },
//             { name: "updatedAt", type: "timestamp", width: 150 },
//             {
//               name: "lastRun",
//               title: "Last Run",
//               type: "timestamp/humanized/colorized",
//               width: 150,
//             },
//             {
//               name: "frequency",
//               type: "number/crud",
//               unit: "minutes",
//               decimals: 0,
//               isEditable: true,
//             },
//             { name: "health", type: "boolean", width: 80, align: "center" },
//             { name: "lastErrorDuring", type: "string", width: 120 },
//             { name: "lastErrorAt", type: "timestamp", width: 120 },
//             {
//               name: "recoveredAt",
//               title: "Recovered At",
//               type: "timestamp/humanized",
//               width: 150,
//             },
//             { name: "actions", title: "Actions", type: "actions", width: 100 },
//           ],
//           defaultDataIndexes: [
//             "domain",
//             "provider",
//             "account",
//             "subAccount",
//             "type",
//             "status",
//             "createdAt",
//             "updatedAt",
//             "lastRun",
//             "frequency",
//             "health",
//             "lastErrorDuring",
//             "lastErrorAt",
//             "recoveredAt",
//             "actions",
//           ],
//           defaultSort: { field: "status", direction: "descend" },
//           filterFields: ["domain", "provider", "account", "subAccount", "type"],
//           exportable: false,
//           needTotal: false,
//         },
//       },
//     },
//   },
// };
