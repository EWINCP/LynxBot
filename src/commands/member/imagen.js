const { PREFIX } = require("../../config");
const { Hercai } = require("hercai");
const { WarningError } = require("../../errors/WarningError");

module.exports = {
  name: "imagen",
  description: "Genera una imagen a partir de la descripción proporcionada",
  commands: ["imagen", "img", "imagen"],
  usage: `${PREFIX}imagen <descripción>`,
  handle: async ({
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendImageFromURL,
  }) => {
    if (!fullArgs.length) {
      throw new WarningError(
        "Por favor, proporciona una descripción para generar la imagen."
      );
    }

    const herc = new Hercai();

    await sendWaitReact();

    const response = await herc.drawImage({
      model: "simurg",
      prompt: `Generate a realistic image based on the description provided below (note: the description will be in Spanish, please translate it into English if necessary):
      
${fullArgs}`,
      negative_prompt: "nude, explicit, adult, nsfw",
    });

    await sendSuccessReact();

    await sendImageFromURL(response.url);
  },
};
