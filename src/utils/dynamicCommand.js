const { DangerError } = require("../errors/DangerError");
const { InvalidParameterError } = require("../errors/InvalidParameterError");
const { WarningError } = require("../errors/WarningError");
const { findCommandImport } = require(".");
const {
  verifyPrefix,
  hasTypeOrCommand,
  isLink,
  isAdmin,
} = require("../middlewares");

const { checkPermission } = require("../middlewares/checkPermission");
const {
  isActiveGroup,
  getAutoResponderResponse,
  isActiveAutoResponderGroup,
  isActiveAntiLinkGroup,
} = require("./database");
const { errorLog } = require("../utils/logger");
const { ONLY_GROUP_ID } = require("../config");
exports.dynamicCommand = async (commonFunctions) => {
  const {
    commandName,
    prefix,
    sendWarningReply,
    sendErrorReply,
    remoteJid,
    sendReply,
    socket,
    userJid,
    fullMessage,
    webMessage,
  } = commonFunctions; // Desestructuración del objeto correcto

  console.log('Ejecutando comando dinámico...', commonFunctions);

  if (isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
    if (!userJid) {
      console.log('El userJid está vacío, no se puede procesar el mensaje.');
      return;
    }

    if (!(await isAdmin({ remoteJid, userJid, socket }))) {
      await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");

      await sendReply(
        "¡Anti-link activado! Has sido removido por enviar un enlace."
      );

      await socket.sendMessage(remoteJid, {
        delete: {
          remoteJid,
          fromMe: false,
          id: webMessage.key.id,
          participant: webMessage.key.participant,
        },
      });

      return;
    }
  }

  const { type, command } = findCommandImport(commandName);

  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
    return;
  }

  if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
    if (isActiveAutoResponderGroup(remoteJid)) {
      const response = getAutoResponderResponse(fullMessage);

      if (response) {
        await sendReply(response);
      }
    }

    return;
  }

  if (typeof checkPermission !== "function") {
    console.error("checkPermission no es una función. Verifica su importación y exportación.");
    return;
  }
  
  if (!(await checkPermission({ type, ...commonFunctions }))) {
    await sendErrorReply("¡No tienes permiso para ejecutar este comando!");
    return;
  }

  if (!isActiveGroup(remoteJid) && command.name !== "on") {
    await sendWarningReply(
      "¡Este grupo está desactivado! Pide al dueño del grupo que active el bot."
    );

    return;
  }

  try {
    await command.handle({
      ...commonFunctions,
      type,
    });
  } catch (error) {
    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`¡Parámetros inválidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else {
      errorLog("Error al ejecutar el comando", error);
      await sendErrorReply(
        `¡Ocurrió un error al ejecutar el comando ${command.name}! El desarrollador ha sido notificado.

📄 *Detalles*: ${error.message}`
      );
    }
  }
};
