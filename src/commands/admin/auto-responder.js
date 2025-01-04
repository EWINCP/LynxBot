const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const {
  activateAutoResponderGroup,
  deactivateAutoResponderGroup,
} = require("../../utils/database");

module.exports = {
  name: "auto-responder",
  description: "Activo/desactivo el recurso de auto-responder en el grupo.",
  commands: ["auto-responder"],
  usage: `${PREFIX}auto-responder (1/0)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "¡Debes escribir 1 o 0 (activar o desactivar)!"
      );
    }

    const autoResponder = args[0] === "1";
    const notAutoResponder = args[0] === "0";

    if (!autoResponder && !notAutoResponder) {
      throw new InvalidParameterError(
        "¡Debes escribir 1 o 0 (activar o desactivar)!"
      );
    }

    if (autoResponder) {
      activateAutoResponderGroup(remoteJid);
    } else {
      deactivateAutoResponderGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = autoResponder ? "activado" : "desactivado";

    await sendReply(`Recurso de auto-responder ${context} con éxito!`);
  },
};
