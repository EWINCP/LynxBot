const { PREFIX } = require("../../config");
const { attp } = require("../../services/spider-x-api");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "stickertxt",
  description: "Crea stickers animados a partir de texto.",
  commands: ["stickertxt"],
  usage: `${PREFIX}stickertxt prueba`,
  handle: async ({
    sendWaitReact,
    args,
    sendStickerFromURL,
    sendSuccessReact,
  }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "Debes proporcionar el texto que deseas convertir en sticker."
      );
    }

    await sendWaitReact();

    const url = await attp(args[0].trim());

    await sendSuccessReact();

    await sendStickerFromURL(url);
  },
};
