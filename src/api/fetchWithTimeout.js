/**
 * Wrapper para fetch con timeout usando AbortController
 * @param {string} url - URL a la que hacer fetch
 * @param {number} timeout - Tiempo máximo en ms (default: 10000ms = 10s)
 * @param {Object} options - Opciones adicionales para fetch
 * @returns {Promise<Response>} Respuesta de fetch
 * @throws {Error} Lanza error si se excede el timeout
 */
export async function fetchWithTimeout(url, timeout = 10000, options = {}) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado');
    }
    throw error;
  }
}
