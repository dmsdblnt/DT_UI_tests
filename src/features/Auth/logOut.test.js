Feature("logout");

Scenario("Logout", (I) => {
  I.login();
  I.click('span[data-cy="userName"]');
  I.click("Logout");
  I.see("Login");
});
