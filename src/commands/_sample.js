/**
 * Este es un modelo de comando.
 * Copia y pega este archivo para crear un nuevo comando en una de las carpetas: admin, member o owner
 * Debes renombrarlo para que sea fácil de identificar en la carpeta destino.
 *
 * Carpeta owner: Comandos que solo pueden ser ejecutados por el dueño del grupo/bot
 * Carpeta admin: Comandos que solo pueden ser ejecutados por administradores del grupo
 * Carpeta member: Comandos que pueden ser ejecutados por cualquier miembro del grupo
 *
 * Funciones y variables que se pueden extraer del handle en "handle: async ({ aquí })"
 * ¡Cuidado, respeta las mayúsculas y minúsculas!
 *
 * Variables:
 *
 * args           => Argumentos pasados junto con el comando como un array: ["arg1", "arg2"]
 * commandName    => Nombre del comando
 * fullArgs       => Argumentos pasados junto con el comando como una cadena de texto: "arg1 arg2"
 * fullMessage    => Mensaje completo incluyendo el comando
 * isImage        => Si el mensaje es una imagen
 * isReply        => Si el mensaje es una respuesta
 * isSticker      => Si el mensaje es un sticker
 * isVideo        => Si el mensaje es un video
 * prefix         => Prefijo del bot
 * remoteJid      => ID del grupo/usuario que está recibiendo el mensaje
 * replyJid       => ID del mensaje que está siendo respondido
 * socket         => Socket de baileys
 * userJid        => ID del usuario que está enviando el mensaje
 * webMessageInfo => Información del mensaje
 *
 * Funciones:
 *
 * downloadImage()
 * => Descargar imagen
 *
 * downloadSticker()
 * => Descargar sticker
 *
 * downloadVideo()
 * => Descargar video
 *
 * sendAudioFromURL("https://teste.com/audio.mp3")
 * => Enviar audio desde una URL
 *
 * sendErrorReact()
 * => Enviar reacción de error
 *
 * sendErrorReply("texto")
 * => Enviar mensaje de error como respuesta
 *
 * sendImageFromFile("./path/to/image.png")
 * => Enviar imagen desde un archivo
 *
 * sendImageFromURL("https://teste.com/imagem.png")
 * => Enviar imagen desde una URL
 *
 * sendReact("emoji")
 * => Enviar reacción
 *
 * sendReply("texto")
 * => Enviar mensaje de respuesta
 *
 * sendStickerFromFile("./path/to/sticker.webp")
 * => Enviar sticker desde un archivo
 *
 * sendStickerFromURL("https://teste.com/sticker.webp")
 * => Enviar sticker desde una URL
 *
 * sendSuccessReact()
 * => Enviar reacción de éxito
 *
 * sendSuccessReply()
 * => Enviar mensaje de éxito como respuesta
 *
 * sendText("texto", mentions)
 * => Enviar mensaje de texto, opcionalmente mencionando usuarios (mentions)
 *
 * sendVideoFromURL("https://teste.com/video.mp4")
 * => Enviar video desde una URL
 *
 * sendWaitReact()
 * => Enviar reacción de espera
 *
 * sendWaitReply()
 * => Enviar mensaje de espera como respuesta
 *
 * sendWarningReact()
 * => Enviar reacción de advertencia
 *
 * sendWarningReply("texto")
 * => Enviar mensaje de advertencia como respuesta
 */

const { PREFIX } = require("../../config");

module.exports = {
  name: "comando",  // Nombre principal del comando
  description: "Descripción del comando",  // Descripción del comando
  commands: ["comando", "comandos"],  // Variantes del comando
  usage: `${PREFIX}comando`,  // Uso del comando
  handle: async ({ sendReply }) => {
    try {
      // Lógica del comando
      await sendReply("¡Comando ejecutado correctamente!");
    } catch (error) {
      console.error("Error en el comando:", error);
      await sendReply(`❌ Ocurrió un error al ejecutar el comando.`);
    }
  },
};

