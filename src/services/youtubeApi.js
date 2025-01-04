const axios = require("axios");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const YOUTUBE_API_KEY = "AIzaSyCjCh22nL8r8Weh20_qShsBVvv4cFDmhXE"; // Reemplaza con tu clave de API de YouTube

// Función para buscar la canción en YouTube
async function searchSong(query) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
  
  try {
    const { data } = await axios.get(searchUrl);
    if (!data.items || data.items.length === 0) {
      throw new Error("No se encontraron resultados.");
    }
    const videoId = data.items[0].id.videoId;
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    throw new Error("Error al buscar la canción en YouTube: " + error.message);
  }
}

// Función para descargar el audio de YouTube usando yt-dlp
async function downloadAudio(videoUrl) {
  const tempDir = path.resolve(__dirname, "../assets/temp");
  const tempPath = path.join(tempDir, "audio.mp3");

  // Crear el directorio si no existe
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    // Usamos 'yt-dlp' desde el sistema para descargar el audio
    const command = `yt-dlp -x --audio-format mp3 -o "${tempPath}" ${videoUrl}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(`Error al descargar el audio: ${stderr || error.message}`);
        } else {
          resolve(tempPath);
        }
      });
    });
  } catch (error) {
    throw new Error("Error al generar el stream de audio: " + error.message);
  }
}

module.exports = { searchSong, downloadAudio };
