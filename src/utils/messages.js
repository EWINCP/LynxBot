const { BOT_NAME, PREFIX } = require("../config");

exports.waitMessage = "Cargando datos...";

exports.menuMessage = () => {
  const date = new Date();

  return `╭━━⪩ ¡BIENVENIDO! ⪨━━
▢
▢ • ${BOT_NAME}
▢ • Fecha: ${date.toLocaleDateString("es-ES")}
▢ • Hora: ${date.toLocaleTimeString("es-ES")}
▢ • Prefijo: ${PREFIX}
▢
╰━━─「🪐」─━━

╭━━⪩ DUEÑO ⪨━━
▢
▢ • ${PREFIX}off
▢ • ${PREFIX}on
▢
╰━━─「🌌」─━━

╭━━⪩ ADMINS ⪨━━
▢
▢ • ${PREFIX}anti-link (1/0)
▢ • ${PREFIX}auto-responder (1/0)
▢ • ${PREFIX}ban
▢ • ${PREFIX}hidetag
▢ • ${PREFIX}welcome (1/0)
▢
╰━━─「⭐」─━━

╭━━⪩ MENÚ ⪨━━
▢
▢ • ${PREFIX}attp
▢ • ${PREFIX}cep
▢ • ${PREFIX}gpt-4
▢ • ${PREFIX}image
▢ • ${PREFIX}ping
▢ • ${PREFIX}play-audio
▢ • ${PREFIX}play-video
▢ • ${PREFIX}sticker
▢ • ${PREFIX}to-image
▢
╰━━─「🚀」─━━`;
};
