Feature("login");

const { isNull, isNullOrUndefined } = require("util");

Scenario("login succeeded", (I) => {
  I.login();
  I.see("Total Revenue");
  I.seeInCurrentUrl("alpha.dashboard.robust.digital/");
  pause();
});

Scenario("login failed username not valid", (I) => {
  I.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
  I.fillField("username", "user@robust.digital");
  I.fillField("password", "qSdh#X35$m");
  I.pressKey("Enter");
  I.wait(15);
  I.see("Username or password is incorrect");
  I.dontSee("Total Revenue");
  I.see("Login");
});

Scenario("login failed password not valid", (I) => {
  I.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
  I.fillField("username", "andrashari@robust.digital");
  I.fillField("password", "asdasd");
  I.pressKey("Enter");
  I.wait(15);
  I.dontSee("Total Revenue");
  I.see("Username or password is incorrect");
  I.see("Login");
});

Scenario("Delete username, password", (I) => {
  I.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
  I.fillField("username", "a");
  // I.clearField('input[id="username]');
  I.pressKey("Backspace");
  I.fillField("password", "q");
  I.pressKey("Backspace");
  I.see("Please enter your username!");
  I.see("Please enter your password!");
});

Scenario("Own link", (I) => {
  I.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
  I.click("Robust");
  I.seeInCurrentUrl("alpha.dashboard.robust.digital");
});
