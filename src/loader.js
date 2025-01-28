const { onMessagesUpsert } = require("./middlewares/onMessagesUpsert");
const {
  onGroupParticipantsUpdate,
} = require("./middlewares/onGroupParticipantsUpdate");
const { TIMEOUT_IN_MILLISECONDS_BY_EVENT } = require("./config");

exports.load = (socket) => {
  // Manejo de eventos para mensajes
  socket.ev.on("messages.upsert", async ({ messages }) => {
    try {
      // Simula un retraso para procesar los mensajes
      await new Promise((resolve) =>
        setTimeout(resolve, TIMEOUT_IN_MILLISECONDS_BY_EVENT),
      );
      await onMessagesUpsert({ socket, messages });
    } catch (error) {
      console.error("Error al procesar 'messages.upsert':", error);
    }
  });

  // Manejo de eventos para actualizaciones de participantes de grupo
  socket.ev.on("group-participants.update", async (data) => {
    try {
      // Simula un retraso para procesar la actualización de participantes
      await new Promise((resolve) =>
        setTimeout(resolve, TIMEOUT_IN_MILLISECONDS_BY_EVENT),
      );
      await onGroupParticipantsUpdate({
        socket,
        groupParticipantsUpdate: data,
      });
    } catch (error) {
      console.error("Error al procesar 'group-participants.update':", error);
    }
  });
};
