const { PREFIX } = require("../../config");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const {
  activateWelcomeGroup,
  deactivateWelcomeGroup,
} = require("../../utils/database");

module.exports = {
  name: "bienvenida",
  description: "Activo/desactivo el recurso de bienvenida en el grupo.",
  commands: [
    "bienvenida",
    "bienvenidos",
    "bienvenidagrupo",
    "bienvenidagrupo",
    "bienvenido",
    "bienvenidosgrupo",
    "welcome",
    "welcomegroup",
  ],
  usage: `${PREFIX}bienvenida (1/0)`,
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "¡Debes escribir 1 o 0 (activar o desactivar)!"
      );
    }

    const bienvenida = args[0] === "1";
    const noBienvenida = args[0] === "0";

    if (!bienvenida && !noBienvenida) {
      throw new InvalidParameterError(
        "¡Debes escribir 1 o 0 (activar o desactivar)!"
      );
    }

    if (bienvenida) {
      activateWelcomeGroup(remoteJid);
    } else {
      deactivateWelcomeGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = bienvenida ? "activado" : "desactivado";

    await sendReply(`¡Recurso de bienvenida ${context} con éxito!`);
  },
};
