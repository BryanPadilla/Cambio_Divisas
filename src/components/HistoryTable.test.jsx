import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryTable from './HistoryTable';

describe('HistoryTable', () => {
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn();
  });

  it('debe mostrar mensaje cuando no hay historial', () => {
    render(<HistoryTable history={[]} onClear={mockOnClear} />);

    expect(screen.getByText('No hay conversiones en el historial')).toBeInTheDocument();
  });

  it('debe renderizar tabla con entradas de historial', () => {
    const mockHistory = [
      {
        id: '1',
        createdAt: '2025-12-14T10:00:00Z',
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5
      },
      {
        id: '2',
        createdAt: '2025-12-14T11:00:00Z',
        amount: 25,
        from: 'EUR',
        to: 'JPY',
        rate: 160,
        result: 4000
      }
    ];

    render(<HistoryTable history={mockHistory} onClear={mockOnClear} />);

    expect(screen.getByTestId('history-table')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
    expect(screen.getAllByText('EUR')[0]).toBeInTheDocument();
    expect(screen.getByText('JPY')).toBeInTheDocument();
  });

  it('debe mostrar botón de limpiar historial', () => {
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

    render(<HistoryTable history={mockHistory} onClear={mockOnClear} />);

    expect(screen.getByTestId('clear-history-button')).toBeInTheDocument();
  });

  it('debe llamar onClear cuando se confirma limpiar historial', () => {
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

    global.confirm.mockReturnValue(true);

    render(<HistoryTable history={mockHistory} onClear={mockOnClear} />);

    const clearButton = screen.getByTestId('clear-history-button');
    fireEvent.click(clearButton);

    expect(global.confirm).toHaveBeenCalledWith(
      '¿Estás seguro de que deseas limpiar todo el historial? Esta acción no se puede deshacer.'
    );
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('NO debe llamar onClear cuando se cancela la confirmación', () => {
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

    global.confirm.mockReturnValue(false);

    render(<HistoryTable history={mockHistory} onClear={mockOnClear} />);

    const clearButton = screen.getByTestId('clear-history-button');
    fireEvent.click(clearButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(mockOnClear).not.toHaveBeenCalled();
  });

  it('debe formatear fechas correctamente', () => {
    const mockHistory = [
      {
        id: '1',
        createdAt: '2025-12-14T10:30:00Z',
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5
      }
    ];

    render(<HistoryTable history={mockHistory} onClear={mockOnClear} />);

    // La fecha debe estar formateada (aunque el formato exacto depende de locale)
    expect(screen.getByText(/14/)).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it('debe mostrar contador de conversiones', () => {
    const mockHistory = [
      {
        id: '1',
        createdAt: '2025-12-14T10:00:00Z',
        amount: 10,
        from: 'USD',
        to: 'EUR',
        rate: 0.95,
        result: 9.5
      },
      {
        id: '2',
        createdAt: '2025-12-14T11:00:00Z',
        amount: 20,
        from: 'EUR',
        to: 'USD',
        rate: 1.05,
        result: 21
      }
    ];

    render(<HistoryTable history={mockHistory} onClear={mockOnClear} />);

    expect(screen.getByText(/Mostrando las últimas 2 conversión/)).toBeInTheDocument();
  });
});
