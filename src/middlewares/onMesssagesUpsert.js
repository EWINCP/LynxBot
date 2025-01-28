const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { infoLog, errorLog } = require("../utils/logger"); // Asegúrate de que estos estén definidos correctamente

exports.onMessagesUpsert = async ({ socket, messages }) => {
  // Verificar si hay mensajes
  if (!messages.length) {
    infoLog("[LYNX GAMING | INFO] No se recibieron mensajes.");
    return;
  }

  // Procesar cada mensaje recibido
  for (const webMessage of messages) {
    // Cargar funciones comunes con el mensaje actual
    const commonFunctions = loadCommonFunctions({ socket, webMessage });

    // Si no se pudieron cargar las funciones comunes, continuar con el siguiente mensaje
    if (!commonFunctions) {
      infoLog(
        "[LYNX GAMING | INFO] No se pudieron cargar las funciones comunes.",
      );
      continue;
    }

    // Verificar si el mensaje es un comando (comienza con "!")
    const messageContent = webMessage.message?.conversation || "";
    if (messageContent.startsWith("!")) {
      infoLog(`[LYNX GAMING | COMANDO] Comando recibido: ${messageContent}`);

      try {
        // Ejecutar el comando dinámico
        await dynamicCommand(commonFunctions);
        infoLog(`[LYNX GAMING | COMANDO] Comando ejecutado: ${messageContent}`);
      } catch (error) {
        errorLog(
          `[LYNX GAMING | ERROR] Error al ejecutar el comando: ${messageContent}`,
          error,
        );
      }
    } else {
      infoLog(`[LYNX GAMING | INFO] Mensaje recibido: ${messageContent}`);
    }
  }
};
