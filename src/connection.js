const path = require("path");
const { question, onlyNumbers } = require("./utils");
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

let socketInstance; // Para mantener la referencia de la conexión

async function connect() {
  // Si ya hay una conexión, no intentamos conectar nuevamente
  if (socketInstance) {
    infoLog('Ya hay una conexión activa.');
    return socketInstance;
  }

  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "..", "assets", "auth", "baileys")
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

  socketInstance.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      infoLog('QR generado, escanea para conectar.');
    }

    if (connection === 'close') {
      const lastDisconnectError = lastDisconnect?.error?.output?.statusCode;
      warningLog('Conexión cerrada:', lastDisconnectError);

      if (lastDisconnectError === DisconnectReason.loggedOut) {
        errorLog('Credenciales inválidas, se requiere un nuevo QR.');
      } else {
        warningLog('Conexión cerrada, no se reconectará automáticamente.');
        // Aquí ya no intentamos reconectar automáticamente
      }
    } else if (connection === 'open') {
      successLog('Conexión exitosa con WhatsApp.');
    }
  });

  socketInstance.ev.on("creds.update", saveCreds);

  return socketInstance;
}

module.exports = { connect };
