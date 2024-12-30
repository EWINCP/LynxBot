const { PREFIX, ASSETS_DIR } = require("../../config");
const { menuMessage } = require("../../utils/messages");
const path = require("path");

module.exports = {
  name: "menu",
  description: "Menú de comandos",
  commands: ["menu", "ayuda", "help"],
  usage: `${PREFIX}menu`,
  handle: async ({ sendImageFromFile }) => {
    await sendImageFromFile(
      path.join(ASSETS_DIR, "images", ""),
      `\n\n${menuMessage()}`
    );
  },
};
