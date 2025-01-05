const { connect } = require("./connection");
const { load } = require("./loader");
const { infoLog, bannerLog } = require("./utils/logger");

async function reconnectLoop() {
  let socket;
  while (true) {
    try {
      infoLog("Intentando conectar...");
      socket = await connect(); // Asegúrate de que connect() devuelva el socket
      infoLog("Conexión exitosa con WhatsApp.");
      break; // Sal del bucle si la conexión es exitosa
    } catch (error) {
      errorLog("Error al intentar conectar:", error.message);
      warningLog("Reintentando en 5 segundos...");
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Espera 5 segundos antes de reintentar
    }
  }
  return socket; // Retorna el socket para usarlo más adelante
}

async function start() {
  try {
    bannerLog(); // Muestra el banner al iniciar
    infoLog("Iniciando el proceso de conexión...");
    const socket = await reconnectLoop(); // Obtén el socket de la reconexión
    load(socket); // Pasa el socket a loader para suscribir los eventos
  } catch (error) {
    errorLog("Error crítico en el inicio:", error.message);
  }
}

start();
