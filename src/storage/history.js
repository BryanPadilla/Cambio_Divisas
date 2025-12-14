// Gestión del historial de conversiones en localStorage
const STORAGE_KEY = 'cambio_divisas_history';
const MAX_HISTORY_ITEMS = 20;

/**
 * Genera un ID único basado en timestamp
 * @returns {string} ID único
 */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene el historial de conversiones desde localStorage
 * @returns {Array} Array de conversiones ordenadas por fecha (más reciente primero)
 */
export function getHistory() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data);
    // Ordenar por fecha más reciente primero
    return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error al leer historial:', error);
    return [];
  }
}

/**
 * Guarda una nueva conversión en el historial
 * @param {Object} conversion - Datos de la conversión (amount, from, to, rate, result)
 */
export function saveConversion(conversion) {
  try {
    const history = getHistory();
    
    const newEntry = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      ...conversion
    };
    
    // Agregar al inicio y limitar a MAX_HISTORY_ITEMS
    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newEntry;
  } catch (error) {
    console.error('Error al guardar conversión:', error);
    throw new Error('No se pudo guardar la conversión en el historial');
  }
}

/**
 * Limpia todo el historial de conversiones
 */
export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar historial:', error);
    throw new Error('No se pudo limpiar el historial');
  }
}
