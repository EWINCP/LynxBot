const { PREFIX } = require("../../config");

module.exports = {
  name: "ping",
  description: "Verificar si el bot está en línea",
  commands: ["ping", "conexion"],
  usage: `${PREFIX}ping`,
  handle: async ({ sendReply, sendReact }) => {
    // Enviar una reacción para indicar que el bot está procesando el comando
    await sendReact("🏓");

    // Enviar una respuesta al usuario
    await sendReply(`🏓 ¡Pong! El bot está en línea.`);
  },
};
