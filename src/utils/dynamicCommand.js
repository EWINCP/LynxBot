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

exports.dynamicCommand = async (paramsHandler) => {
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
  } = paramsHandler;

  // Verifica si el grupo tiene activado el anti-link y si el mensaje contiene un enlace
  if (isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
    if (!userJid) return;
    
    // Si el usuario no es administrador, se le elimina del grupo
    if (!(await isAdmin({ remoteJid, userJid, socket }))) {
      await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");

      // Envía un mensaje al usuario informando que fue eliminado por enviar un enlace
      await sendReply(
        "¡Anti-enlace activado! ¡Has sido eliminado por enviar un enlace!"
      );

      // Elimina el mensaje con el enlace
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

  // Verifica si el ID del grupo es el correcto
  if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
    return;
  }

  // Verifica si el prefijo es válido y si el comando es correcto
  if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
    // Si el grupo tiene activado el auto-responder, responde con la respuesta automática
    if (isActiveAutoResponderGroup(remoteJid)) {
      const response = getAutoResponderResponse(fullMessage);

      if (response) {
        await sendReply(response);
      }
    }

    return;
  }

  // Verifica si el usuario tiene permiso para ejecutar el comando
  if (!(await checkPermission({ type, ...paramsHandler }))) {
    await sendErrorReply("¡No tienes permiso para ejecutar este comando!");
    return;
  }

  // Verifica si el grupo está activo, si no lo está y el comando no es "on", envía un mensaje de advertencia
  if (!isActiveGroup(remoteJid) && command.name !== "on") {
    await sendWarningReply(
      "¡Este grupo está desactivado! ¡Pide al dueño del grupo que active el bot!"
    );

    return;
  }

  try {
    // Ejecuta el comando
    await command.handle({
      ...paramsHandler,
      type,
    });
  } catch (error) {
    // Maneja los diferentes tipos de errores
    if (error instanceof InvalidParameterError) {
      await sendWarningReply(`¡Parámetros inválidos! ${error.message}`);
    } else if (error instanceof WarningError) {
      await sendWarningReply(error.message);
    } else if (error instanceof DangerError) {
      await sendErrorReply(error.message);
    } else {
      // Registra el error y notifica al desarrollador
      errorLog("Error al ejecutar comando", error);
      await sendErrorReply(
        `¡Ocurrió un error al ejecutar el comando ${command.name}! ¡El desarrollador ha sido notificado!
      
📄 *Detalles*: ${error.message}`
      );
    }
  }
};
