const { connect } = require("./connection");
const { load } = require("./loader");
const { infoLog, bannerLog } = require("./utils/logger");

async function start() {
  try {
    bannerLog();
    infoLog("Iniciando mis componentes internos...");

    // Intentar conectarse y manejar la reconexión
    await reconnectLoop();
  } catch (error) {
    console.log(error);
  }
}

// Función que maneja el bucle de reconexión
async function reconnectLoop() {
  while (true) {
    try {
      const socket = await connect(); // Intentamos conectar
      load(socket); // Cargamos el socket si la conexión es exitosa
      break; // Si la conexión es exitosa, salimos del bucle
    } catch (error) {
      console.log("Error al intentar conectar. Reintentando...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Esperamos 5 segundos antes de reintentar
    }
  }
}

start();
