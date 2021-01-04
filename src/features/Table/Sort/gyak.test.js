Feature("proba");

// Before((I) => {
//   I.amOnPage('https://alpha.dashboard.robust.digital/user/login/');
//   I.fillField('username', 'andrashari@robust.digital');
//   I.fillField('password', 'qSdh#X35$m');
//   I.pressKey('Enter');
//   I.wait(15);
//   const asd = 10;
//   I.executeScript((asd) => {
//     console.log(asd);
//   });
// });

// Scenario('1st login', (I) => {
//   I.click('a[href="/roi"]');
//   I.click(
//     'i[class="anticon anticon-caret-down ant-table-column-sorter-down off"]',
//   );
//   console.log(a);
// });

// Scenario('2nd login', (I) => {
//   I.click('a[href="/campaigns"]');
// });
// I.click('Domain');

// Scenario('test semantic locator', async (I) => {
//   I.click('a[href="/roi"]');
//   I.click(".//th[contains(., 'Domain')]");

//   const data = await tryExporting.getTableData(I);

//   console.log(locate('th').withText('Domain'));
//   // console.log(locate('th').withText('asdasdasd').find());
//   console.log(".//th[contains(., 'Domain')]");

//   pause();
// });

// Scenario('forgot password on gladiatus', async (I) => {
//   const mailbox = await I.haveNewMailbox(
//     '824e14c3-fbe1-4143-ad06-55fde6f62491@mailslurp.com',
//   );
//   I.openMailbox(mailbox);
//   console.log(mailbox);
//   I.amOnPage(
//     'https://lobby.gladiatus.gameforge.com/hu_HU/?kid=a-03732-02232-1812-b3507155&gclid=EAIaIQobChMIl9Kk65GZ6wIVCZiyCh0KPQ16EAAYASAAEgKfJPD_BwE&mod=start&submod=index',
//   );
//   I.click(locate('li').at(6));
//   I.click('Elfelejtetted a jelszavad?');
//   I.fillField('input', 'dmsdblnt@gmail.com');
//   I.click('Folytatás');
//   I.click('Folytatás');

//   const email = await I.receivedAnEmail(
//     'dmsdblnt@gmail.com',
//     'Jelszó változtatás',
//   );

//   console.log(email);

//   // I.waitForLatestEmail(30);
// });

// console.log(resultArray);

// //CLICK COLUMN SWITCHERS ALL POSSIBLE WAYS

//   // for(var i=0; i<Math.pow(2,18);i++){
//   //   const binaryString = parseInt(1,10).toString(2);
//   //   const hossz = binaryString.length
//   //   for(var j=0;j<hossz;j--){
//   //     if(parseInt(binaryString[hossz-j]) === 1){
//   //       console.log(`${nemtudommiertkellez[j]}`);
//   //       I.click(`button[id="${nemtudommiertkellez[j]}"]`);
//   //     }

// //GET DATA FROM LOCALSTORAGE

//     I.executeScript(() => {
//         dataIndexes = localStorage.getItem('lscache-dataIndexes-RoiByDomains');
//         dataFromLocalStorage = localStorage.getItem('lscache-RoiByDomains');
//         dataFromLocalStorage = dataFromLocalStorage.replace(/{|}|]|value|prev|diff|"|:|,/gi, "");
//         dataFromLocalStorage = dataFromLocalStorage.replace(/\\\\\\|\\\\/gi, "\\");
//         items = dataFromLocalStorage.split("domain");
//         let mapped = items.map(item => item.split("\\"));
// const a = await I.getTableData();

// const credentialSchema = {
//   title: "credential schema",
//   type: "object",
//   required: ["Domain"],
//   properties: {
//     Domain: {
//       type: "number",
//     },
//   },
// };

function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        console.log(allText);
      }
    }
  };
  rawFile.send(null);
}

Scenario("download file", async ({ I }) => {
  I.login("andrashari@robust.digital", "qSdh#X35$m");
  I.click('a[href="/roi"]');

  I.handleDownloads();
  I.click("Export");

  const a = await I.runCommand(
    "cat ~/Munka/robust-dashboard-ui-tests/src/features/Table/Sort/gyak.test.js"
  );

  const b = I.executeScript(() => {
    var performance =
      window.performance ||
      window.mozPerformance ||
      window.msPerformance ||
      window.webkitPerformance ||
      {};
    return performance.getEntries() || {};
  });

  var getting = await chrome.devtools.network.getHAR();

  console.log(getting);

  pause();

  const header = I.getHeaderData();
  const body = I.getTableData();
});
