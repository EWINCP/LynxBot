const { PREFIX } = require("../../config");
const { playAudio, playVideo } = require("../../services/spider-x-api");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "video",
  description: "Descargar y reproducir vídeos",
  commands: ["video", "pv"],
  usage: `${PREFIX}video MC Hariel`,
  handle: async ({
    sendVideoFromURL,
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
      const data = await playVideo(args[0]);

      if (!data) {
        await sendErrorReply("¡No se encontraron resultados!");
        return;
      }

      await sendSuccessReact();

      await sendVideoFromURL(data.url);
    } catch (error) {
      console.log(error);
      await sendErrorReply(JSON.stringify(error.message));
    }
  },
};
