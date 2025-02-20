const axios = require("axios");

const { SPIDER_API_TOKEN, SPIDER_API_BASE_URL } = require("../config");
console.log(SPIDER_API_TOKEN);  // Verifica si el token se está leyendo correctamente


exports.play = async (search) => {
  if (!search) {
    throw new Error("¡Necesitas indicar lo que deseas buscar!");
  }

  if (!SPIDER_API_TOKEN || SPIDER_API_TOKEN === "NErZKUk2KYeSa4snQcWl") {
    throw new Error("Token de la API de Spider X no configurado");
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/downloads/play-audio?search=${encodeURIComponent(
      search
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
};

exports.video = async (search) => {
  if (!search) {
    throw new Error("¡Necesitas indicar lo que deseas buscar!");
  }

  if (!SPIDER_API_TOKEN || SPIDER_API_TOKEN === "NErZKUk2KYeSa4snQcWl") {
    throw new Error("Token de la API de Spider X no configurado");
  }

  const { data } = await axios.get(
    `${SPIDER_API_BASE_URL}/downloads/play-video?search=${encodeURIComponent(
      search
    )}&api_key=${SPIDER_API_TOKEN}`
  );

  return data;
};

exports.gpt4 = async (text) => {
  if (!text) {
    throw new Error("¡Necesitas indicar el parámetro de texto!");
  }

  if (!SPIDER_API_TOKEN || SPIDER_API_TOKEN === "NErZKUk2KYeSa4snQcWl") {
    throw new Error("Token de la API de Spider X no configurado");
  }

  const { data } = await axios.post(
    `${SPIDER_API_BASE_URL}/ai/gpt-4?api_key=${SPIDER_API_TOKEN}`,
    {
      text,
    }
  );

  return data.response;
};

exports.stickertxt = async (text) => {
  if (!text) {
    throw new Error("¡Necesitas indicar el parámetro de texto!");
  }

  if (!SPIDER_API_TOKEN || SPIDER_API_TOKEN === "NErZKUk2KYeSa4snQcWl") {
    throw new Error("Token de la API de Spider X no configurado");
  }

  return `${SPIDER_API_BASE_URL}/stickers/attp?text=${encodeURIComponent(
    text
  )}&api_key=${SPIDER_API_TOKEN}`;
};

exports.welcome = async (text, description, imageURL) => {
  if (!text || !description || !imageURL) {
    throw new Error(
      "¡Necesitas indicar el texto, la descripción y la URL de la imagen!"
    );
  }

  if (!SPIDER_API_TOKEN || SPIDER_API_TOKEN === "NErZKUk2KYeSa4snQcWl") {
    throw new Error("Token de la API de Spider X no configurado");
  }

  return `${SPIDER_API_BASE_URL}/canvas/welcome?text=${encodeURIComponent(
    text
  )}&description=${encodeURIComponent(
    description
  )}&image_url=${encodeURIComponent(imageURL)}&api_key=${SPIDER_API_TOKEN}`;
};
