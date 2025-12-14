import React, { useState, useEffect } from 'react';

export default function ConverterForm({ currencies, onConvert, isLoading }) {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState('');

  // Establecer valores por defecto cuando se cargan las monedas
  useEffect(() => {
    if (currencies && Object.keys(currencies).length > 0) {
      const codes = Object.keys(currencies);
      if (!from) setFrom(codes.includes('USD') ? 'USD' : codes[0]);
      if (!to) setTo(codes.includes('EUR') ? 'EUR' : codes[1] || codes[0]);
    }
  }, [currencies, from, to]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    const amountNum = parseFloat(amount);
    
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      setError('Por favor, ingresa un monto válido mayor a 0');
      return;
    }

    if (!from || !to) {
      setError('Por favor, selecciona ambas monedas');
      return;
    }

    if (from === to) {
      setError('Las monedas de origen y destino deben ser diferentes');
      return;
    }

    onConvert(amountNum, from, to);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h2 className="card-title h4 mb-4">Convertidor de Divisas</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Monto */}
            <div className="col-12">
              <label htmlFor="amount" className="form-label">Monto</label>
              <input
                type="number"
                className="form-control"
                id="amount"
                data-testid="amount-input"
                placeholder="Ej: 100.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                disabled={isLoading}
              />
            </div>

            {/* Moneda origen */}
            <div className="col-md-6">
              <label htmlFor="from" className="form-label">Desde</label>
              <select
                className="form-select"
                id="from"
                data-testid="from-select"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                disabled={isLoading || !currencies}
              >
                {currencies && Object.entries(currencies).map(([code, name]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Moneda destino */}
            <div className="col-md-6">
              <label htmlFor="to" className="form-label">Hacia</label>
              <select
                className="form-select"
                id="to"
                data-testid="to-select"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                disabled={isLoading || !currencies}
              >
                {currencies && Object.entries(currencies).map(([code, name]) => (
                  <option key={code} value={code}>
                    {code} - {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón convertir */}
            <div className="col-12">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                data-testid="convert-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Convirtiendo...
                  </>
                ) : (
                  'Convertir'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-danger mt-3 mb-0" role="alert" data-testid="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
