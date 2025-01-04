const { PREFIX } = require("../../config");
const { activateGroup } = require("../../utils/database");

module.exports = {
  name: "on",
  description: "Activa el bot en el grupo",
  commands: ["on"],
  usage: `${PREFIX}on`,
  handle: async ({ sendSuccessReply, remoteJid }) => {
    activateGroup(remoteJid);

    await sendSuccessReply("¡Bot activado en el grupo!");
  },
};
