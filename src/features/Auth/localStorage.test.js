Feature("Localstorage test");

Scenario("localstorage", async (I) => {
  I.login();
  const LS = await I.executeScript(() => {
    const b = localStorage.getItem("lscache-RoiByDomains-cacheexpiration");
    const c = localStorage.getItem("lscache-authentication-cacheexpiration");
    const d = localStorage.getItem("lscache-authentication");
    const e = localStorage.getItem("lscache-authority-cacheexpiration");
    const f = localStorage.getItem("_hjid");
    const g = localStorage.getItem("lscache-authority");
    const h = localStorage.getItem("lscache-RoiByDomains");
    const i = localStorage.getItem("_hjIncludedInPageviewSample");
    console.log(b);
    console.log(c);
    console.log(d);
    console.log(e);
    console.log(f);
    console.log(g);
    console.log(h);
    console.log(i);
    console.log(localStorage.length);
    console.log(localStorage);
    const is =
      b === null ||
      c === null ||
      d === null ||
      e === null ||
      f === null ||
      g === null ||
      h === null ||
      i === null;
    return is;
  });
  I.assertFalse(LS);
  pause();
});
