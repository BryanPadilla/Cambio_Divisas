import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConverterForm from './ConverterForm';

describe('ConverterForm', () => {
  const mockCurrencies = {
    USD: 'United States Dollar',
    EUR: 'Euro',
    GBP: 'British Pound',
    JPY: 'Japanese Yen'
  };

  const mockOnConvert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el formulario correctamente', () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={false} 
      />
    );

    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('from-select')).toBeInTheDocument();
    expect(screen.getByTestId('to-select')).toBeInTheDocument();
    expect(screen.getByTestId('convert-button')).toBeInTheDocument();
  });

  it('debe establecer valores por defecto USD y EUR', async () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={false} 
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('from-select')).toHaveValue('USD');
      expect(screen.getByTestId('to-select')).toHaveValue('EUR');
    });
  });

  it('debe mostrar error al elegir misma moneda (from === to) y NO llamar API', async () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={false} 
      />
    );

    const amountInput = screen.getByTestId('amount-input');
    const fromSelect = screen.getByTestId('from-select');
    const toSelect = screen.getByTestId('to-select');
    const convertButton = screen.getByTestId('convert-button');

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(fromSelect, { target: { value: 'USD' } });
    fireEvent.change(toSelect, { target: { value: 'USD' } });
    fireEvent.click(convertButton);

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Las monedas de origen y destino deben ser diferentes'
    );
    expect(mockOnConvert).not.toHaveBeenCalled();
  });

  it('debe mostrar error al no ingresar valor (vacío) y NO llamar API', () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={false} 
      />
    );

    const convertButton = screen.getByTestId('convert-button');

    fireEvent.click(convertButton);

    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Por favor, ingresa un monto válido mayor a 0'
    );
    expect(mockOnConvert).not.toHaveBeenCalled();
  });

  it('debe llamar onConvert con valores correctos en caso exitoso', async () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={false} 
      />
    );

    const amountInput = screen.getByTestId('amount-input');
    const fromSelect = screen.getByTestId('from-select');
    const toSelect = screen.getByTestId('to-select');
    const convertButton = screen.getByTestId('convert-button');

    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(fromSelect, { target: { value: 'USD' } });
    fireEvent.change(toSelect, { target: { value: 'EUR' } });
    fireEvent.click(convertButton);

    expect(mockOnConvert).toHaveBeenCalledWith(100, 'USD', 'EUR');
    expect(mockOnConvert).toHaveBeenCalledTimes(1);
  });

  it('debe deshabilitar inputs cuando isLoading es true', () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={true} 
      />
    );

    expect(screen.getByTestId('amount-input')).toBeDisabled();
    expect(screen.getByTestId('from-select')).toBeDisabled();
    expect(screen.getByTestId('to-select')).toBeDisabled();
    expect(screen.getByTestId('convert-button')).toBeDisabled();
  });

  it('debe mostrar "Convirtiendo..." cuando isLoading es true', () => {
    render(
      <ConverterForm 
        currencies={mockCurrencies} 
        onConvert={mockOnConvert} 
        isLoading={true} 
      />
    );

    expect(screen.getByText('Convirtiendo...')).toBeInTheDocument();
  });
});
