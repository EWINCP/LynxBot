const { PREFIX } = require("../../config");
const { deactivateGroup } = require("../../utils/database");

module.exports = {
  name: "off",
  description: "Desactiva el bot en el grupo",
  commands: ["off"],
  usage: `${PREFIX}off`,
  handle: async ({ sendSuccessReply, remoteJid }) => {
    deactivateGroup(remoteJid);

    await sendSuccessReply("¡Bot desactivado en el grupo!");
  },
};
