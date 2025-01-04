const { version } = require("../../package.json");

exports.sayLog = (message) => {
  console.log("\x1b[36m[LYNX GAMING | TALK]\x1b[0m", message);
};

exports.inputLog = (message) => {
  console.log("\x1b[30m[LYNX GAMING | INPUT]\x1b[0m", message);
};

exports.infoLog = (message) => {
  console.log("\x1b[34m[LYNX GAMING | INFO]\x1b[0m", message);
};

exports.successLog = (message) => {
  console.log("\x1b[32m[LYNX GAMING | SUCCESS]\x1b[0m", message);
};

exports.errorLog = (message) => {
  console.log("\x1b[31m[LYNX GAMING | ERROR]\x1b[0m", message);
};

exports.warningLog = (message) => {
  console.log("\x1b[33m[LYNX GAMING | WARNING]\x1b[0m", message);
};

exports.bannerLog = () => {
  console.log(`
    *******************************
    * LYNX GAMING BOT INICIADO *
    *******************************
  `);
  console.log(`\x1b[36m🤖 Versión: \x1b[0m${version}\n`);
};
