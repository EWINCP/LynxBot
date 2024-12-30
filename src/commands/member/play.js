const { PREFIX } = require("../../config");
const { play } = require("../../services/spider-x-api");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "play",
  description: "Descargar y reproducir música",
  commands: ["play", "reproducir", "pa"],
  usage: `${PREFIX}play MC Hariel`,
  handle: async ({
    sendAudioFromURL,
    args,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "¡Necesitas decirme lo que deseas buscar!"
      );
    }

    await sendWaitReact();

    try {
      const data = await play(args[0]);

      if (!data) {
        await sendErrorReply("¡No se encontraron resultados!");
        return;
      }

      await sendSuccessReact();

      await sendAudioFromURL(data.url);
    } catch (error) {
      console.log(error);
      await sendErrorReply(error.message);
    }
  },
};
