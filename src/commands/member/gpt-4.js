const { PREFIX } = require("../../config");
const { gpt4 } = require("../../services/spider-x-api");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "gpt-4",
  description: "¡Comandos de inteligencia artificial!",
  commands: ["gpt-4", "gpt", "Lynx"],
  usage: `${PREFIX}gpt ¿con cuántos palos se hace una canoa?`,
  handle: async ({ sendSuccessReply, sendWaitReply, args }) => {
    const text = args[0];

    if (!text) {
      throw new InvalidParameterError(
        "¡Necesitas decirme qué debo responder!"
      );
    }

    await sendWaitReply();

    const responseText = await gpt4(text);

    await sendSuccessReply(responseText);
  },
};
