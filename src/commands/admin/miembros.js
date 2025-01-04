const { PREFIX } = require("../../config");

module.exports = {
  name: "miembros", // Nombre principal del comando
  description: "Lista a todos los miembros del grupo.", // Descripción del comando
  commands: ["miembros", "members"], // Variantes del comando
  usage: `${PREFIX}miembros`, // Uso del comando
  handle: async ({ remoteJid, socket, sendReply }) => {
    try {
      const metadata = await socket.groupMetadata(remoteJid);
      const members = metadata.participants.map((p) => `• ${p.id}`).join("\n");
      const memberList = `
        👥 *Lista de Miembros* 👥
        ${members}
      `;
      await sendReply(memberList);
    } catch (error) {
      console.error("Error al listar miembros:", error);
      await sendReply("❌ Ocurrió un error al intentar listar los miembros del grupo.");
    }
  },
};
