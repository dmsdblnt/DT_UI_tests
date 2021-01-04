Feature("Remember me test");

Scenario("login succeeded, remember me on site", (I) => {
  I.login();
  I.see("Total Revenue");
  I.amOnPage("https://alpha.dashboard.robust.digital/");
  I.see("Total Revenue");
  I.seeInCurrentUrl("https://alpha.dashboard.robust.digital/");
});

Scenario("login succeeded, remember me on login site also", (I) => {
  I.login();
  I.see("Total Revenue");
  I.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
  I.see("Total Revenue");
  I.seeInCurrentUrl("https://alpha.dashboard.robust.digital/");
});

Scenario("Do not remember", (I) => {
  I.amOnPage("https://alpha.dashboard.robust.digital/user/login/");
  I.fillField("username", "andrashari@robust.digital");
  I.fillField("password", "qSdh#X35$m");
  I.click('input[class="ant-checkbox-input"]');
  I.pressKey("Enter");
  I.wait(15);
  I.see("Total Revenue");
  I.seeInCurrentUrl("https://alpha.dashboard.robust.digital/");
  I.amOnPage("https://alpha.dashboard.robust.digital/");
  I.see("Login");
  I.seeInCurrentUrl("https://alpha.dashboard.robust.digital/user/login");
});
