const { PREFIX } = require("../../config");

module.exports = {
  name: "cerrar", // Nombre principal del comando
  description: "Cierra el grupo para que solo los administradores puedan enviar mensajes.", // Descripción del comando
  commands: ["cerrar", "close"], // Variantes del comando
  usage: `${PREFIX}cerrar`, // Uso del comando
  handle: async ({ remoteJid, socket, sendReply }) => {
    try {
      // Cambia la configuración del grupo para permitir mensajes solo de administradores
      await socket.groupSettingUpdate(remoteJid, "announcement");
      await sendReply("✅ El grupo ha sido cerrado. Solo los administradores pueden enviar mensajes.");
    } catch (error) {
      console.error("Error al cerrar el grupo:", error);
      await sendReply("❌ Ocurrió un error al intentar cerrar el grupo.");
    }
  },
};
