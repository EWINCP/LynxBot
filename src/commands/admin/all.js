const { PREFIX } = require("../../config");

module.exports = {
  name: "all",
  description: "Este comando marcará a todos en el grupo",
  commands: ["all", "marcar-todos", "todos"],
  usage: `${PREFIX}ocultaretiqueta motivo`,
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const { participants } = await socket.groupMetadata(remoteJid);

    const mentions = participants.map(({ id }) => id);

    await sendReact("📢");

    await sendText(`📢 \n\n${fullArgs}`, mentions);
  },
};
