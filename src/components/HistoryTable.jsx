import React from 'react';

export default function HistoryTable({ history, onClear }) {
  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todo el historial? Esta acción no se puede deshacer.')) {
      onClear();
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!history || history.length === 0) {
    return (
      <div className="card shadow-sm mt-4">
        <div className="card-body text-center text-muted py-5">
          <p className="mb-0">No hay conversiones en el historial</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="card-title h5 mb-0">Historial de Conversiones</h3>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={handleClear}
          >
            Limpiar Historial
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th className="text-end">Monto</th>
                <th>De</th>
                <th>A</th>
                <th className="text-end">Resultado</th>
                <th className="text-end">Tasa</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td className="text-nowrap small">{formatDate(entry.createdAt)}</td>
                  <td className="text-end">
                    {entry.amount.toLocaleString('es-ES', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </td>
                  <td>
                    <span className="badge bg-secondary">{entry.from}</span>
                  </td>
                  <td>
                    <span className="badge bg-primary">{entry.to}</span>
                  </td>
                  <td className="text-end fw-bold">
                    {entry.result.toLocaleString('es-ES', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </td>
                  <td className="text-end small text-muted">
                    {entry.rate.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-muted small mt-2">
          Mostrando las últimas {history.length} conversión(es)
        </div>
      </div>
    </div>
  );
}
