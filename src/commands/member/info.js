const { PREFIX } = require("../../config");

module.exports = {
  name: "info", // Nombre principal del comando
  description: "Muestra información del grupo.", // Descripción del comando
  commands: ["info", "grupo"], // Variantes del comando
  usage: `${PREFIX}info`, // Uso del comando
  handle: async ({ remoteJid, socket, sendReply }) => {
    try {
      const metadata = await socket.groupMetadata(remoteJid);
      const groupInfo = `
        📋 *Información del Grupo* 📋
        📝 Nombre: ${metadata.subject}
        🆔 ID: ${metadata.id}
        👥 Participantes: ${metadata.participants.length}
        📅 Creado el: ${new Date(metadata.creation * 1000).toLocaleString()}
      `;
      await sendReply(groupInfo);
    } catch (error) {
      console.error("Error al obtener información del grupo:", error);
      await sendReply("❌ Ocurrió un error al intentar obtener la información del grupo.");
    }
  },
};
