// API de Frankfurter para obtener monedas y conversiones
import { fetchWithTimeout } from './fetchWithTimeout.js';

// Para testing, usar una variable que puedaser sobreescrita
export let BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.frankfurter.app';

/**
 * Obtiene la lista de monedas disponibles desde la API
 * @returns {Promise<Object>} Objeto con códigos de monedas como claves y nombres como valores
 */
export async function fetchCurrencies() {
  try {
    const response = await fetchWithTimeout(`${BASE_URL}/currencies`, 10000);
    
    if (!response.ok) {
      throw new Error(`Error al obtener monedas: ${response.status}`);
    }
    
    const currencies = await response.json();
    return currencies;
  } catch (error) {
    console.error('Error en fetchCurrencies:', error);
    if (error.message === 'Tiempo de espera agotado') {
      throw error;
    }
    throw new Error('No se pudieron cargar las monedas. Verifica tu conexión.');
  }
}

/**
 * Convierte una cantidad de una moneda a otra
 * @param {number} amount - Cantidad a convertir
 * @param {string} from - Código de moneda origen (ej: 'USD')
 * @param {string} to - Código de moneda destino (ej: 'EUR')
 * @returns {Promise<Object>} Objeto con los datos de la conversión
 */
export async function convertCurrency(amount, from, to) {
  try {
    const response = await fetchWithTimeout(
      `${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`,
      10000
    );
    
    if (!response.ok) {
      throw new Error(`Error en la conversión: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extraer el resultado y la tasa
    const result = data.rates[to];
    const rate = result / amount;
    
    return {
      amount: parseFloat(amount),
      from: data.base,
      to,
      rate,
      result,
      date: data.date
    };
  } catch (error) {
    console.error('Error en convertCurrency:', error);
    if (error.message === 'Tiempo de espera agotado') {
      throw error;
    }
    throw new Error('Error al realizar la conversión. Inténtalo nuevamente.');
  }
}
