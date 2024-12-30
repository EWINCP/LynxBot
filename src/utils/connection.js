const path = require("path");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  isJidStatusBroadcast,
  proto,
  makeInMemoryStore,
  isJidNewsletter,
} = require("baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const { load } = require("./loader");
const {
  warningLog,
  infoLog,
  errorLog,
  sayLog,
  successLog,
} = require("./utils/logger");

const msgRetryCounterCache = new NodeCache();

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

async function getMessage(key) {
  if (!store) {
    return proto.Message.fromObject({});
  }

  const msg = await store.loadMessage(key.remoteJid, key.id);

  return msg ? msg.message : undefined;
}

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger: pino({ level: "error" }),
    printQRInTerminal: true, // Activar impresión de QR en la terminal
    defaultQueryTimeoutMs: 60 * 1000,
    auth: state,
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
    keepAliveIntervalMs: 60 * 1000,
    markOnlineOnConnect: true,
    msgRetryCounterCache,
    shouldSyncHistoryMessage: () => false,
    getMessage,
  });

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("Escanea este código QR para conectar el bot:");
      console.log(qr); // Mostramos el QR en la consola
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      if (statusCode === DisconnectReason.loggedOut) {
        errorLog("¡Bot desconectado! Se necesita escanear un nuevo QR.");
        // Eliminamos las credenciales actuales para forzar un nuevo QR
        await resetSession();
        await connect(); // Intentamos conectar nuevamente generando un nuevo QR
      } else {
        switch (statusCode) {
          case DisconnectReason.badSession:
            warningLog("¡Sesión inválida! Reiniciando...");
            break;
          case DisconnectReason.connectionClosed:
            warningLog("¡Conexión cerrada! Intentando reconectar...");
            break;
          case DisconnectReason.connectionLost:
            warningLog("¡Conexión perdida! Intentando reconectar...");
            break;
          case DisconnectReason.connectionReplaced:
            warningLog("¡Conexión reemplazada! Necesitas escanear un nuevo QR.");
            await resetSession();
            await connect(); // Reiniciamos la conexión con un nuevo QR
            break;
          case DisconnectReason.multideviceMismatch:
            warningLog("¡Dispositivo incompatible! Reinicia el bot.");
            break;
          case DisconnectReason.forbidden:
            warningLog("¡Conexión prohibida!");
            break;
          case DisconnectReason.restartRequired:
            infoLog('¡Por favor reiníciame! Escriba "npm start".');
            break;
          case DisconnectReason.unavailableService:
            warningLog("¡Servicio no disponible!");
            break;
          default:
            warningLog("Desconexión desconocida. Intentando reconectar...");
        }

        // Intentamos reconectar y generar un nuevo QR si es necesario
        await connect();
      }
    } else if (connection === "open") {
      successLog("¡Me he conectado con éxito!");
    } else {
      infoLog("Actualizando conexión...");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

// Resetea la sesión eliminando las credenciales
async function resetSession() {
  const authPath = path.resolve(__dirname, "..", "assets", "auth", "baileys");
  try {
    // Eliminamos todos los archivos en el directorio de autenticación
    const fs = require("fs");
    if (fs.existsSync(authPath)) {
      fs.rmSync(authPath, { recursive: true, force: true });
      infoLog("Credenciales eliminadas. Se generará un nuevo QR.");
    }
  } catch (err) {
    errorLog("Error al eliminar las credenciales:", err);
  }
}

// Función que maneja el bucle de reconexión
async function reconnectLoop() {
  while (true) {
    try {
      await connect(); // Intentamos conectar
      break; // Si la conexión es exitosa, salimos del bucle
    } catch (err) {
      errorLog("Error al intentar conectar. Reintentando...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Esperamos 5 segundos antes de reintentar
    }
  }
}

reconnectLoop(); // Iniciamos el bucle de reconexión

exports.connect = connect;
