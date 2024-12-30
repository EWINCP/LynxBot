const { PREFIX, TEMP_DIR } = require("../../config");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");

module.exports = {
  name: "aimagen",
  description: "Transformo stickers estáticos en imagen",
  commands: ["aimagen", "toimg"],
  usage: `${PREFIX}aimagen (marca el sticker) o ${PREFIX}aimagen (responde al sticker)`,
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendImageFromFile,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError("¡Debes enviar un sticker!");
    }

    const inputPath = await downloadSticker(webMessage, "input");
    const outputPath = path.resolve(TEMP_DIR, "output.png");

    exec(`ffmpeg -i ${inputPath} ${outputPath}`, async (error) => {
      if (error) {
        console.log(error);
        throw new Error(error);
      }

      await sendImageFromFile(outputPath);

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  },
};
