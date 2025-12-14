import React, { useState, useEffect } from 'react';
import ConverterForm from './components/ConverterForm';
import HistoryTable from './components/HistoryTable';
import { fetchCurrencies, convertCurrency } from './api/frankfurter';
import { getHistory, saveConversion, clearHistory } from './storage/history';

function App() {
  const [currencies, setCurrencies] = useState(null);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Cargar monedas al montar el componente
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoadingCurrencies(true);
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencies();
    setHistory(getHistory());
  }, []);

  const handleConvert = async (amount, from, to) => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const conversionData = await convertCurrency(amount, from, to);
      setResult(conversionData);
      
      // Guardar en historial
      saveConversion(conversionData);
      setHistory(getHistory());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-primary">💱 Cambio de Divisas</h1>
          <p className="text-muted">Conversor de monedas con tasas de cambio en tiempo real</p>
        </div>

        {/* Error global */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>Error:</strong> {error}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setError('')}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Formulario de conversión */}
        <div className="row justify-content-center mb-4">
          <div className="col-lg-6">
            {loadingCurrencies ? (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="text-muted mb-0">Cargando monedas disponibles...</p>
                </div>
              </div>
            ) : (
              <ConverterForm 
                currencies={currencies}
                onConvert={handleConvert}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>

        {/* Resultado de la conversión */}
        {result && (
          <div className="row justify-content-center mb-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-success">
                <div className="card-body">
                  <h3 className="card-title h5 text-success mb-3">
                    ✓ Resultado de la Conversión
                  </h3>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="p-3 bg-light rounded">
                        <div className="small text-muted mb-1">Monto original</div>
                        <div className="h4 mb-0">
                          {result.amount.toLocaleString('es-ES', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })} <span className="text-muted">{result.from}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="p-3 bg-success bg-opacity-10 rounded">
                        <div className="small text-muted mb-1">Resultado</div>
                        <div className="h4 mb-0 text-success">
                          {result.result.toLocaleString('es-ES', { 
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2 
                          })} <span className="text-muted">{result.to}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="small text-muted text-center">
                        Tasa de cambio: 1 {result.from} = {result.rate.toFixed(4)} {result.to}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Historial */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <HistoryTable 
              history={history}
              onClear={handleClearHistory}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 text-muted small">
          <p className="mb-0">
            Datos proporcionados por{' '}
            <a 
              href="https://frankfurter.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              Frankfurter API
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
