const path = require("path");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
} = require("baileys");
const NodeCache = require("node-cache");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const { load } = require("./loader");
const { infoLog, warningLog, errorLog, successLog } = require("./utils/logger");

const msgRetryCounterCache = new NodeCache();

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" }),
});

async function connect() {
  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
  );

  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    logger: pino({ level: "error" }),
    printQRInTerminal: false, // QR se genera manualmente
    auth: state,
    keepAliveIntervalMs: 60 * 1000,
    msgRetryCounterCache,
  });

  // Mostrar QR en la terminal
  socket.ev.on("connection.update", (update) => {
    const { connection, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true }); // Generar y mostrar el QR
      infoLog("Escanea el código QR para conectar el bot.");
    }

    if (connection === "close") {
      const lastDisconnect = update.lastDisconnect?.error?.output?.statusCode;

      if (lastDisconnect === DisconnectReason.loggedOut) {
        errorLog("¡Bot desconectado! Escanea el QR nuevamente.");
      } else {
        warningLog("Reconectando...");
        connect();
      }
    } else if (connection === "open") {
      successLog("¡Conexión exitosa con WhatsApp!");
    }
  });

  socket.ev.on("creds.update", saveCreds);

  return socket;
}

exports.connect = connect;
