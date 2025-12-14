import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as frankfurter from './api/frankfurter';
import * as history from './storage/history';

jest.mock('./api/frankfurter');
jest.mock('./storage/history');

describe('App - Integration Tests', () => {
  const mockCurrencies = {
    USD: 'United States Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    frankfurter.fetchCurrencies.mockResolvedValue(mockCurrencies);
    history.getHistory.mockReturnValue([]);
    history.saveConversion.mockImplementation((conversion) => ({
      id: '123',
      createdAt: new Date().toISOString(),
      ...conversion
    }));
  });

  describe('Casos de éxito - diferentes conversiones', () => {
    it('debe realizar conversión exitosa: 10 USD → EUR', async () => {
      const mockConversion = {
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5,
        date: '2025-12-14'
      };

      frankfurter.convertCurrency.mockResolvedValue(mockConversion);

      render(<App />);

      // Esperar a que carguen las monedas
      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      // Ingresar datos
      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '10' } });
      fireEvent.change(screen.getByTestId('from-select'), { target: { value: 'USD' } });
      fireEvent.change(screen.getByTestId('to-select'), { target: { value: 'EUR' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      // Verificar resultado
      await waitFor(() => {
        expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
      });

      expect(screen.getByText(/9,50/)).toBeInTheDocument();
      expect(screen.getByText(/0.9500/)).toBeInTheDocument();
      expect(history.saveConversion).toHaveBeenCalledWith(mockConversion);
    });

    it('debe realizar conversión exitosa: 25 EUR → JPY', async () => {
      const mockConversion = {
        amount: 25,
        from: 'EUR',
        to: 'JPY',
        rate: 160,
        result: 4000,
        date: '2025-12-14'
      };

      frankfurter.convertCurrency.mockResolvedValue(mockConversion);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '25' } });
      fireEvent.change(screen.getByTestId('from-select'), { target: { value: 'EUR' } });
      fireEvent.change(screen.getByTestId('to-select'), { target: { value: 'JPY' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
      });

      expect(screen.getByText(/4[,.]?000[,.]00/)).toBeInTheDocument();
      expect(history.saveConversion).toHaveBeenCalledWith(mockConversion);
    });

    it('debe realizar conversión exitosa: 100 GBP → USD', async () => {
      const mockConversion = {
        amount: 100,
        from: 'GBP',
        to: 'USD',
        rate: 1.275,
        result: 127.5,
        date: '2025-12-14'
      };

      frankfurter.convertCurrency.mockResolvedValue(mockConversion);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '100' } });
      fireEvent.change(screen.getByTestId('from-select'), { target: { value: 'GBP' } });
      fireEvent.change(screen.getByTestId('to-select'), { target: { value: 'USD' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(screen.getByTestId('conversion-result')).toBeInTheDocument();
      });

      expect(screen.getByText(/127,50/)).toBeInTheDocument();
      expect(history.saveConversion).toHaveBeenCalledWith(mockConversion);
    });
  });

  describe('Errores y validaciones', () => {
    it('debe mostrar error al elegir misma moneda y NO llamar API', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '100' } });
      fireEvent.change(screen.getByTestId('from-select'), { target: { value: 'USD' } });
      fireEvent.change(screen.getByTestId('to-select'), { target: { value: 'USD' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
      expect(screen.getByTestId('error-message')).toHaveTextContent(/deben ser diferentes/);
      expect(frankfurter.convertCurrency).not.toHaveBeenCalled();
    });

    it('debe mostrar error al no ingresar valor y NO llamar API', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
      expect(screen.getByTestId('error-message')).toHaveTextContent(/válido mayor a 0/);
      expect(frankfurter.convertCurrency).not.toHaveBeenCalled();
    });

    it('debe manejar error sin conexión al API', async () => {
      frankfurter.convertCurrency.mockRejectedValue(new Error('No se pudieron cargar las monedas. Verifica tu conexión.'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '10' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(screen.getByTestId('global-error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('global-error')).toHaveTextContent(/conexión/);
    });

    it('debe manejar error de timeout', async () => {
      frankfurter.convertCurrency.mockRejectedValue(new Error('Tiempo de espera agotado'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '10' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(screen.getByTestId('global-error')).toBeInTheDocument();
      });

      expect(screen.getByTestId('global-error')).toHaveTextContent(/Tiempo de espera agotado/);
    });
  });

  describe('Persistencia de historial', () => {
    it('debe guardar conversión en historial con estructura correcta', async () => {
      const mockConversion = {
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5,
        date: '2025-12-14'
      };

      frankfurter.convertCurrency.mockResolvedValue(mockConversion);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('amount-input')).toBeInTheDocument();
      });

      fireEvent.change(screen.getByTestId('amount-input'), { target: { value: '10' } });
      fireEvent.click(screen.getByTestId('convert-button'));

      await waitFor(() => {
        expect(history.saveConversion).toHaveBeenCalled();
      });

      const savedConversion = history.saveConversion.mock.calls[0][0];
      expect(savedConversion).toMatchObject({
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5
      });
    });

    it('debe limpiar historial al hacer click en botón limpiar', async () => {
      const mockHistory = [
        {
          id: '1',
          createdAt: '2025-12-14T10:00:00Z',
          amount: 10,
          from: 'USD',
          to: 'EUR',
          rate: 0.95,
          result: 9.5
        }
      ];

      history.getHistory.mockReturnValue(mockHistory);
      global.confirm = jest.fn().mockReturnValue(true);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByTestId('clear-history-button')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByTestId('clear-history-button'));

      expect(history.clearHistory).toHaveBeenCalled();
    });
  });
});
