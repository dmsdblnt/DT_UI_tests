const { setHeadlessWhen } = require("@codeceptjs/configure");

// turn on headless mode when running with HEADLESS=true environment variable
// HEADLESS=true npx codecept run
setHeadlessWhen(process.env.HEADLESS);

exports.config = {
  tests: "./src/features/*/*/*.test.js",
  output: "./output",
  helpers: {
    Playwright: {
      url: "https://dashboard.robust.digital/",
      show: true,
      browser: "chromium",
      restart: false,
    },
    CodeceptjsResourcesCheck: {
      require: "codeceptjs-resources-check",
      threshold: 0.2,
    },
    ChaiWrapper: {
      require: "codeceptjs-chai",
    },
    MailSlurp: {
      require: "@codeceptjs/mailslurp-helper",
      apiKey:
        "db6ad5dc74475ae547d6811543a4d370aa79c4a106385e2f1d1db767ffc0ed3d",
    },
    CmdHelper: {
      require: "./node_modules/codeceptjs-cmdhelper",
    },
    DbHelper: {
      require: "./node_modules/codeceptjs-dbhelper",
    },
  },
  include: {
    I: "./steps_file.js",
  },
  bootstrap: null,
  mocha: {},
  name: "ui_interaction_test/src",
  plugins: {
    retryFailedStep: {
      enabled: true,
    },
    screenshotOnFail: {
      enabled: true,
    },
  },
};
