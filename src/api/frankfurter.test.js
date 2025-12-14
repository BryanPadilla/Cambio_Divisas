import { fetchCurrencies, convertCurrency } from './frankfurter';
import { fetchWithTimeout } from './fetchWithTimeout';

jest.mock('./fetchWithTimeout');

describe('frankfurter API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchCurrencies', () => {
    it('debe obtener monedas exitosamente', async () => {
      const mockCurrencies = {
        USD: 'United States Dollar',
        EUR: 'Euro',
        GBP: 'British Pound',
        JPY: 'Japanese Yen'
      };

      fetchWithTimeout.mockResolvedValue({
        ok: true,
        json: async () => mockCurrencies
      });

      const result = await fetchCurrencies();

      expect(result).toEqual(mockCurrencies);
      expect(fetchWithTimeout).toHaveBeenCalledWith(
        expect.stringContaining('/currencies'),
        10000
      );
    });

    it('debe manejar error de respuesta no OK', async () => {
      fetchWithTimeout.mockResolvedValue({
        ok: false,
        status: 500
      });

      await expect(fetchCurrencies()).rejects.toThrow('No se pudieron cargar las monedas');
    });

    it('debe manejar error de red', async () => {
      fetchWithTimeout.mockRejectedValue(new Error('Network failed'));

      await expect(fetchCurrencies()).rejects.toThrow('No se pudieron cargar las monedas');
    });

    it('debe propagar error de timeout', async () => {
      fetchWithTimeout.mockRejectedValue(new Error('Tiempo de espera agotado'));

      await expect(fetchCurrencies()).rejects.toThrow('Tiempo de espera agotado');
    });
  });

  describe('convertCurrency', () => {
    it('debe convertir moneda exitosamente - USD a EUR', async () => {
      const mockData = {
        amount: 10,
        base: 'USD',
        date: '2025-12-14',
        rates: { EUR: 9.5 }
      };

      fetchWithTimeout.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const result = await convertCurrency(10, 'USD', 'EUR');

      expect(result).toEqual({
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5,
        date: '2025-12-14'
      });
    });

    it('debe convertir moneda exitosamente - EUR a JPY', async () => {
      const mockData = {
        amount: 25,
        base: 'EUR',
        date: '2025-12-14',
        rates: { JPY: 4000 }
      };

      fetchWithTimeout.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const result = await convertCurrency(25, 'EUR', 'JPY');

      expect(result).toEqual({
        amount: 25,
        from: 'EUR',
        to: 'JPY',
        rate: 160,
        result: 4000,
        date: '2025-12-14'
      });
    });

    it('debe convertir moneda exitosamente - GBP a USD', async () => {
      const mockData = {
        amount: 100,
        base: 'GBP',
        date: '2025-12-14',
        rates: { USD: 127.5 }
      };

      fetchWithTimeout.mockResolvedValue({
        ok: true,
        json: async () => mockData
      });

      const result = await convertCurrency(100, 'GBP', 'USD');

      expect(result).toEqual({
        amount: 100,
        from: 'GBP',
        to: 'USD',
        rate: 1.275,
        result: 127.5,
        date: '2025-12-14'
      });
    });

    it('debe manejar error de respuesta no OK', async () => {
      fetchWithTimeout.mockResolvedValue({
        ok: false,
        status: 404
      });

      await expect(convertCurrency(10, 'USD', 'EUR')).rejects.toThrow(
        'Error al realizar la conversión'
      );
    });

    it('debe manejar error de red', async () => {
      fetchWithTimeout.mockRejectedValue(new Error('Network error'));

      await expect(convertCurrency(10, 'USD', 'EUR')).rejects.toThrow(
        'Error al realizar la conversión'
      );
    });

    it('debe propagar error de timeout', async () => {
      fetchWithTimeout.mockRejectedValue(new Error('Tiempo de espera agotado'));

      await expect(convertCurrency(10, 'USD', 'EUR')).rejects.toThrow(
        'Tiempo de espera agotado'
      );
    });
  });
});
