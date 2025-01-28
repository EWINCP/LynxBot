const { isActiveGroup } = require("../utils/database"); // Ajusta la ruta según tu estructura

exports.onGroupParticipantsUpdate = async ({
  groupParticipantsUpdate,
  socket,
}) => {
  const remoteJid = groupParticipantsUpdate.id;
  const userJid = groupParticipantsUpdate.participants[0];

  // Eliminar lógica de bienvenida
  if (!isActiveGroup(remoteJid)) {
    return;
  }

  // Aquí puedes agregar cualquier otra funcionalidad que necesites
};
