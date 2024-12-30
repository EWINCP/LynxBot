const { PREFIX } = require("../../config");

module.exports = {
  name: "ping",
  description: "Verificar si el bot está en línea",
  commands: ["ping"],
  usage: `${PREFIX}ping`,
  handle: async ({ sendReply, sendReact }) => {
    await sendReact("🏓");
    await sendReply(`🏓 ¡Pong!`);
  },
};
