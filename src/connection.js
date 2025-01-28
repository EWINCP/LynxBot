const fs = require("fs");
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
const qrcode = require("qrcode-terminal");
const { infoLog, warningLog, errorLog, successLog } = require("./utils/logger");
const { load } = require("./loader"); // Asegúrate de importar la función load

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

let socketInstance;
let isConnectedToWhatsApp = false; // Indicador de conexión a WhatsApp

async function connect() {
  if (socketInstance && isConnectedToWhatsApp) {
    infoLog("Ya hay una conexión activa.");
    return socketInstance;
  }

  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "assets", "auth", "baileys"),
  );

  const { version } = await fetchLatestBaileysVersion();

  socketInstance = makeWASocket({
    version,
    logger: pino({ level: "error" }),
    printQRInTerminal: false,
    auth: state,
    shouldIgnoreJid: (jid) =>
      isJidBroadcast(jid) || isJidStatusBroadcast(jid) || isJidNewsletter(jid),
    keepAliveIntervalMs: 60 * 1000,
    markOnlineOnConnect: true,
    msgRetryCounterCache,
    shouldSyncHistoryMessage: () => false,
    getMessage,
  });

  // Suscribir los eventos después de la reconexión
  socketInstance.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      infoLog("QR generado, escanea para conectar.");
    }

    if (connection === "close") {
      const lastDisconnectError = lastDisconnect?.error?.output?.statusCode;
      warningLog("Conexión cerrada:", lastDisconnectError);

      isConnectedToWhatsApp = false; // Marcar como desconectado

      if (lastDisconnectError === DisconnectReason.loggedOut) {
        errorLog(
          "Credenciales inválidas, eliminando y solicitando un nuevo QR.",
        );

        // Eliminar credenciales de autenticación
        const authPath = path.resolve(__dirname, "assets", "auth", "baileys");
        if (fs.existsSync(authPath)) {
          fs.rmdirSync(authPath, { recursive: true });
          infoLog("Credenciales eliminadas correctamente.");
        }

        socketInstance = null;

        // Esperar 5 segundos antes de reconectar
        setTimeout(() => connect(), 5000);
      } else {
        warningLog("Intentando reconectar automáticamente...");
        setTimeout(() => connect(), 5000); // Reintenta la conexión después de 5 segundos
      }
    } else if (connection === "open") {
      successLog("Conexión exitosa con WhatsApp.");
      isConnectedToWhatsApp = true; // Marcar como conectado

      // Suscribir eventos después de la reconexión
      load(socketInstance); // Asegúrate de que los eventos se suscriban después de la reconexión
    }
  });

  socketInstance.ev.on("creds.update", saveCreds);

  return socketInstance;
}

module.exports = { connect, isConnectedToWhatsApp };

