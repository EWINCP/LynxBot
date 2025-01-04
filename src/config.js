const path = require("path");

// Prefijo de los comandos.
exports.PREFIX = "!";

// Emoji del bot (cámbialo si lo prefieres).
exports.BOT_EMOJI = "🤖";

// Nombre del bot (cámbialo si lo prefieres).
exports.BOT_NAME = "Lynx Bot";

// Número del bot. Coloca el número del bot (solo números).
exports.BOT_NUMBER = "7202218042";

// Número del dueño del bot. Coloca el número del dueño del bot (solo números).
exports.OWNER_NUMBER = "5579436135";

// Directorio de los comandos.
exports.COMMANDS_DIR = path.join(__dirname, "commands");

// Directorio de archivos de medios.
exports.ASSETS_DIR = path.resolve(__dirname, "..", "assets");

// Directorio de archivos temporales.
exports.TEMP_DIR = path.resolve(__dirname, "..", "assets", "temp");

// Tiempo de espera en milisegundos por evento (evita bloqueos).
exports.TIMEOUT_IN_MILLISECONDS_BY_EVENT = 700;

// Plataforma de API's.
exports.SPIDER_API_BASE_URL="https://api.spiderx.com.br/api";

// Obtén tu token creando una cuenta en: https://api.spiderx.com.br.
exports.SPIDER_API_TOKEN="NErZKUk2KYeSa4snQcWl";
exports.API_KEY_DE_YOUTUBE="AIzaSyCjCh22nL8r8Weh20_qShsBVvv4cFDmhXE";

// Si deseas responder solo a un grupo específico, coloca el ID aquí (ejemplo: 120363023799506419@g.us). Solo para pruebas internas.
exports.ONLY_GROUP_ID = "";
