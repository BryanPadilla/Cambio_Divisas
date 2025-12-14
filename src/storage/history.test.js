import { getHistory, saveConversion, clearHistory } from './history';

describe('history storage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getHistory', () => {
    it('debe retornar array vacío si no hay historial', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const result = getHistory();
      
      expect(result).toEqual([]);
      expect(localStorage.getItem).toHaveBeenCalledWith('cambio_divisas_history');
    });

    it('debe retornar historial ordenado por fecha (más reciente primero)', () => {
      const mockHistory = [
        { id: '1', createdAt: '2025-12-14T10:00:00Z', amount: 10 },
        { id: '2', createdAt: '2025-12-14T12:00:00Z', amount: 20 },
        { id: '3', createdAt: '2025-12-14T11:00:00Z', amount: 15 }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(mockHistory));
      
      const result = getHistory();
      
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('2'); // Más reciente
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1'); // Más antiguo
    });

    it('debe manejar error de parsing y retornar array vacío', () => {
      localStorage.getItem.mockReturnValue('invalid json');
      
      const result = getHistory();
      
      expect(result).toEqual([]);
    });
  });

  describe('saveConversion', () => {
    it('debe guardar nueva conversión con id y createdAt', () => {
      localStorage.getItem.mockReturnValue(null);
      
      const conversion = {
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5
      };
      
      const result = saveConversion(conversion);
      
      expect(result).toMatchObject(conversion);
      expect(result.id).toBeDefined();
      expect(result.createdAt).toBeDefined();
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'cambio_divisas_history',
        expect.any(String)
      );
    });

    it('debe agregar conversión al inicio del historial', () => {
      const existingHistory = [
        { id: '1', createdAt: '2025-12-14T10:00:00Z', amount: 5 }
      ];
      
      localStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));
      
      const conversion = {
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5
      };
      
      saveConversion(conversion);
      
      const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(2);
      expect(savedData[0].amount).toBe(10); // Nueva conversión primero
      expect(savedData[1].amount).toBe(5);
    });

    it('debe limitar historial a 20 entradas', () => {
      const existingHistory = Array.from({ length: 20 }, (_, i) => ({
        id: `${i}`,
        createdAt: new Date(2025, 0, i + 1).toISOString(),
        amount: i
      }));
      
      localStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));
      
      const conversion = {
        amount: 100,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 95
      };
      
      saveConversion(conversion);
      
      const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(20);
      expect(savedData[0].amount).toBe(100); // Nueva entrada
      expect(savedData[19].amount).toBe(1); // Última entrada antigua (entrada 1 de 20 originales)
    });
  });

  describe('clearHistory', () => {
    it('debe eliminar el historial de localStorage', () => {
      clearHistory();
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('cambio_divisas_history');
    });
  });
});
