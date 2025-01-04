const { PREFIX } = require("../../config");

module.exports = {
  name: "abrir", // Nombre principal del comando
  description: "Abre el grupo para que todos puedan enviar mensajes.", // Descripción del comando
  commands: ["abrir", "open"], // Variantes del comando
  usage: `${PREFIX}abrir`, // Uso del comando
  handle: async ({ remoteJid, socket, sendReply }) => {
    try {
      // Cambia la configuración del grupo para permitir mensajes de todos
      await socket.groupSettingUpdate(remoteJid, "not_announcement");
      await sendReply("✅ El grupo ha sido abierto. Ahora todos pueden enviar mensajes.");
    } catch (error) {
      console.error("Error al abrir el grupo:", error);
      await sendReply("❌ Ocurrió un error al intentar abrir el grupo.");
    }
  },
};
