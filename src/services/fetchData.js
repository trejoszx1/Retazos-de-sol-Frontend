import { config } from "../config/config";

// Realizar una solicitud POST al endpoint de inicio de sesión
const response = async ({ route, method, headers, body }) => {
  try {

    const url = `${config.apiUrl}${config.apiVersion}${route}`;
    const fetchResponse = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });
  
    if (!fetchResponse.ok) {
      throw new Error(`Error en la solicitud: ${fetchResponse.status}`);
    }

    const data = await fetchResponse.json();
    console.log("Respuesta desde la API:", data);
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error; // Puedes manejar el error aquí o propagarlo
  }
};

export default response;
