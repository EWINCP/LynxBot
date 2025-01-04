const path = require("path");
const fs = require("fs");

const databasePath = path.resolve(__dirname, "..", "..", "database");

const INACTIVE_GROUPS_FILE = "inactive-groups";
const NOT_WELCOME_GROUPS_FILE = "not-welcome-groups";
const INACTIVE_AUTO_RESPONDER_GROUPS_FILE = "inactive-auto-responder-groups";
const ANTI_LINK_GROUPS_FILE = "anti-link-groups";

// Función para crear el archivo si no existe
function createIfNotExists(fullPath) {
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, JSON.stringify([])); // Crea un archivo con un array vacío si no existe
  }
}

// Función para leer un archivo JSON
function readJSON(jsonFile) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`); // Resuelve la ruta del archivo JSON

  createIfNotExists(fullPath); // Asegura que el archivo existe

  return JSON.parse(fs.readFileSync(fullPath, "utf8")); // Lee y devuelve el contenido del archivo JSON
}

// Función para escribir datos en un archivo JSON
function writeJSON(jsonFile, data) {
  const fullPath = path.resolve(databasePath, `${jsonFile}.json`); // Resuelve la ruta del archivo JSON

  createIfNotExists(fullPath); // Asegura que el archivo existe

  fs.writeFileSync(fullPath, JSON.stringify(data)); // Escribe los datos en el archivo JSON
}

// Activa un grupo (lo quita de la lista de grupos inactivos)
exports.activateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename); // Lee los grupos inactivos

  const index = inactiveGroups.indexOf(groupId); // Busca el índice del grupo en la lista de inactivos

  if (index === -1) {
    return; // Si el grupo no está en la lista, no hace nada
  }

  inactiveGroups.splice(index, 1); // Elimina el grupo de la lista de inactivos

  writeJSON(filename, inactiveGroups); // Guarda la lista actualizada
};

// Desactiva un grupo (lo agrega a la lista de grupos inactivos)
exports.deactivateGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename); // Lee los grupos inactivos

  if (!inactiveGroups.includes(groupId)) {
    inactiveGroups.push(groupId); // Si el grupo no está en la lista, lo agrega
  }

  writeJSON(filename, inactiveGroups); // Guarda la lista actualizada
};

// Verifica si un grupo está activo
exports.isActiveGroup = (groupId) => {
  const filename = INACTIVE_GROUPS_FILE;

  const inactiveGroups = readJSON(filename); // Lee los grupos inactivos

  return !inactiveGroups.includes(groupId); // Devuelve true si el grupo está activo (no está en la lista de inactivos)
};

// Activa un grupo de bienvenida (lo quita de la lista de grupos sin bienvenida)
exports.activateWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;

  const notWelcomeGroups = readJSON(filename); // Lee los grupos sin bienvenida

  const index = notWelcomeGroups.indexOf(groupId); // Busca el índice del grupo en la lista de sin bienvenida

  if (index === -1) {
    return; // Si el grupo no está en la lista, no hace nada
  }

  notWelcomeGroups.splice(index, 1); // Elimina el grupo de la lista de sin bienvenida

  writeJSON(filename, notWelcomeGroups); // Guarda la lista actualizada
};

// Desactiva un grupo de bienvenida (lo agrega a la lista de grupos sin bienvenida)
exports.deactivateWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;

  const notWelcomeGroups = readJSON(filename); // Lee los grupos sin bienvenida

  if (!notWelcomeGroups.includes(groupId)) {
    notWelcomeGroups.push(groupId); // Si el grupo no está en la lista, lo agrega
  }

  writeJSON(filename, notWelcomeGroups); // Guarda la lista actualizada
};

// Verifica si un grupo tiene bienvenida activa
exports.isActiveWelcomeGroup = (groupId) => {
  const filename = NOT_WELCOME_GROUPS_FILE;

  const notWelcomeGroups = readJSON(filename); // Lee los grupos sin bienvenida

  return !notWelcomeGroups.includes(groupId); // Devuelve true si el grupo tiene bienvenida activa
};

// Obtiene la respuesta del auto-responder para una coincidencia
exports.getAutoResponderResponse = (match) => {
  const filename = "auto-responder";

  const responses = readJSON(filename); // Lee las respuestas del auto-responder

  const matchUpperCase = match.toLocaleUpperCase(); // Convierte la coincidencia a mayúsculas

  const data = responses.find(
    (response) => response.match.toLocaleUpperCase() === matchUpperCase // Busca la respuesta que coincide con la entrada
  );

  if (!data) {
    return null; // Si no se encuentra ninguna respuesta, devuelve null
  }

  return data.answer; // Devuelve la respuesta encontrada
};

// Activa un grupo con auto-responder (lo quita de la lista de grupos sin auto-responder)
exports.activateAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;

  const inactiveAutoResponderGroups = readJSON(filename); // Lee los grupos sin auto-responder

  const index = inactiveAutoResponderGroups.indexOf(groupId); // Busca el índice del grupo en la lista de sin auto-responder

  if (index === -1) {
    return; // Si el grupo no está en la lista, no hace nada
  }

  inactiveAutoResponderGroups.splice(index, 1); // Elimina el grupo de la lista de sin auto-responder

  writeJSON(filename, inactiveAutoResponderGroups); // Guarda la lista actualizada
};

// Desactiva un grupo con auto-responder (lo agrega a la lista de grupos sin auto-responder)
exports.deactivateAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;

  const inactiveAutoResponderGroups = readJSON(filename); // Lee los grupos sin auto-responder

  if (!inactiveAutoResponderGroups.includes(groupId)) {
    inactiveAutoResponderGroups.push(groupId); // Si el grupo no está en la lista, lo agrega
  }

  writeJSON(filename, inactiveAutoResponderGroups); // Guarda la lista actualizada
};

// Verifica si un grupo tiene auto-responder activo
exports.isActiveAutoResponderGroup = (groupId) => {
  const filename = INACTIVE_AUTO_RESPONDER_GROUPS_FILE;

  const inactiveAutoResponderGroups = readJSON(filename); // Lee los grupos sin auto-responder

  return !inactiveAutoResponderGroups.includes(groupId); // Devuelve true si el grupo tiene auto-responder activo
};

// Activa un grupo con anti-link (lo agrega a la lista de grupos con anti-link)
exports.activateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename); // Lee los grupos con anti-link

  if (!antiLinkGroups.includes(groupId)) {
    antiLinkGroups.push(groupId); // Si el grupo no está en la lista, lo agrega
  }

  writeJSON(filename, antiLinkGroups); // Guarda la lista actualizada
};

// Desactiva un grupo con anti-link (lo elimina de la lista de grupos con anti-link)
exports.deactivateAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename); // Lee los grupos con anti-link

  const index = antiLinkGroups.indexOf(groupId); // Busca el índice del grupo en la lista de anti-link

  if (index === -1) {
    return; // Si el grupo no está en la lista, no hace nada
  }

  antiLinkGroups.splice(index, 1); // Elimina el grupo de la lista de anti-link

  writeJSON(filename, antiLinkGroups); // Guarda la lista actualizada
};

// Verifica si un grupo tiene anti-link activo
exports.isActiveAntiLinkGroup = (groupId) => {
  const filename = ANTI_LINK_GROUPS_FILE;

  const antiLinkGroups = readJSON(filename); // Lee los grupos con anti-link

  return antiLinkGroups.includes(groupId); // Devuelve true si el grupo tiene anti-link activo
};
