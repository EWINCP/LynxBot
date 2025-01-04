const { PREFIX } = require("../../config");
const { searchSong, downloadAudio } = require("../../services/youtubeApi");

module.exports = {
  name: "play",
  description: "Busca y envía el audio de una canción desde YouTube.",
  commands: ["play", "song"],
  usage: `${PREFIX}play <nombre de la canción>`,
  handle: async ({ args, sendReply, sendAudioFromURL }) => {
    try {
      if (args.length === 0) {
        await sendReply("❌ Por favor, proporciona el nombre de la canción.");
        return;
      }

      const query = args.join(" ");
      console.log(`🔍 Buscando la canción: ${query}`);

      // Buscar la canción en YouTube
      const videoUrl = await searchSong(query);
      console.log("🔗 URL del video:", videoUrl);

      // Descargar el audio del video
      try {
        console.log("🎧 Iniciando la descarga del audio...");
        const audioPath = await downloadAudio(videoUrl);
        console.log("✅ Audio descargado en:", audioPath);

        // Enviar el audio
        await sendAudioFromURL(audioPath);
        console.log("✅ Audio enviado exitosamente.");

        // Eliminar el archivo temporal después de enviarlo
        fs.unlinkSync(audioPath);
        console.log("✅ Archivo temporal eliminado.");
      } catch (err) {
        console.error("❌ Error al procesar el audio:", err);
        await sendReply("❌ Ocurrió un error al procesar el audio.");
      }
    } catch (error) {
      console.error("❌ Error en el comando play:", error);
      await sendReply("❌ Ocurrió un error al intentar buscar la canción.");
    }
  },
};
