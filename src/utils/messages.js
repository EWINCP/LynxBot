const { BOT_NAME, PREFIX } = require("../config");
const fs = require("fs"); // Por si necesitas manejar archivos en el futuro

// Mensaje de espera
exports.waitMessage = "Cargando datos...";

// Función para generar el menú
exports.menuMessage = () => {
  try {
    const date = new Date();

    // Genera el menú dinámico
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
▢ • ${PREFIX}welcome (1/0)
▢ • ${PREFIX}all
▢ • ${PREFIX}abrir
▢ • ${PREFIX}cerrar
▢ • ${PREFIX}miembros
▢
╰━━─「⭐」─━━

╭━━⪩ MENÚ ⪨━━
▢
▢ • ${PREFIX}menu
▢ • ${PREFIX}imagen
▢ • ${PREFIX}conexion
▢ • ${PREFIX}sticker
▢ • ${PREFIX}info
▢
╰━━─「🚀」─━━`;
  } catch (error) {
    // Manejo de errores
    console.error("Error al generar el mensaje del menú:", error.message, error.stack);
    return "❌ Error al generar el menú. Por favor, contacta al desarrollador.";
  }
};

// Función para probar el comando (opcional para depuración)
if (require.main === module) {
  console.log(exports.menuMessage());
}
