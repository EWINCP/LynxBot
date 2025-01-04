const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");

exports.onMessagesUpsert = async ({ socket, messages }) => {
  if (!messages.length) {
    console.log('Mensaje recibido:', webMessage); // Log de depuración
    return;
  }

  for (const webMessage of messages) {
    const commonFunctions = loadCommonFunctions({ socket, webMessage });

    if (!commonFunctions) {
      continue;
    }

    await dynamicCommand(commonFunctions);
  }
};
