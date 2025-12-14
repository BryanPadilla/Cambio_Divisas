import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5050;

// Configuración
app.use(cors());
app.use(express.json());

// Variable para simular diferentes escenarios
let simulateMode = 'success'; // 'success', 'timeout', 'error'

// Datos mock
const mockCurrencies = {
  USD: 'United States Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  JPY: 'Japanese Yen',
  CAD: 'Canadian Dollar',
  AUD: 'Australian Dollar',
  CHF: 'Swiss Franc'
};

const exchangeRates = {
  'USD-EUR': 0.95,
  'EUR-USD': 1.05,
  'USD-GBP': 0.79,
  'GBP-USD': 1.27,
  'USD-JPY': 149.5,
  'JPY-USD': 0.0067,
  'EUR-JPY': 160,
  'JPY-EUR': 0.00625,
  'GBP-EUR': 1.17,
  'EUR-GBP': 0.85
};

// Endpoint para obtener monedas
app.get('/currencies', async (req, res) => {
  console.log('[Mock Server] GET /currencies');

  if (simulateMode === 'timeout') {
    console.log('[Mock Server] Simulando timeout...');
    // No responde nunca
    return;
  }

  if (simulateMode === 'error') {
    console.log('[Mock Server] Simulando error 500');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  // Simular delay de red
  setTimeout(() => {
    res.json(mockCurrencies);
  }, 100);
});

// Endpoint para conversión
app.get('/latest', async (req, res) => {
  const { amount, from, to } = req.query;

  console.log(`[Mock Server] GET /latest?amount=${amount}&from=${from}&to=${to}`);

  if (simulateMode === 'timeout') {
    console.log('[Mock Server] Simulando timeout...');
    // No responde nunca
    return;
  }

  if (simulateMode === 'error') {
    console.log('[Mock Server] Simulando error 500');
    return res.status(500).json({ error: 'Conversion failed' });
  }

  // Validaciones
  if (!amount || !from || !to) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const amountNum = parseFloat(amount);
  if (isNaN(amountNum) || amountNum <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Buscar tasa de cambio
  const rateKey = `${from}-${to}`;
  let rate = exchangeRates[rateKey];

  // Si no existe la tasa directa, calcular inversa
  if (!rate) {
    const inverseKey = `${to}-${from}`;
    const inverseRate = exchangeRates[inverseKey];
    if (inverseRate) {
      rate = 1 / inverseRate;
    } else {
      // Tasa por defecto
      rate = 1.0;
    }
  }

  const result = amountNum * rate;

  // Simular delay de red
  setTimeout(() => {
    res.json({
      amount: amountNum,
      base: from,
      date: new Date().toISOString().split('T')[0],
      rates: {
        [to]: result
      }
    });
  }, 100);
});

// Endpoint para cambiar modo de simulación (útil para tests)
app.post('/mock/mode', (req, res) => {
  const { mode } = req.body;
  if (['success', 'timeout', 'error'].includes(mode)) {
    simulateMode = mode;
    console.log(`[Mock Server] Modo cambiado a: ${mode}`);
    res.json({ mode: simulateMode });
  } else {
    res.status(400).json({ error: 'Invalid mode' });
  }
});

// Endpoint para obtener modo actual
app.get('/mock/mode', (req, res) => {
  res.json({ mode: simulateMode });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Mock Server ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Modo actual: ${simulateMode}`);
  console.log(`\nEndpoints disponibles:`);
  console.log(`  GET  /currencies`);
  console.log(`  GET  /latest?amount=X&from=Y&to=Z`);
  console.log(`  POST /mock/mode (body: { "mode": "success|timeout|error" })`);
  console.log(`  GET  /mock/mode`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('\n[Mock Server] Recibida señal SIGTERM, cerrando...');
  server.close(() => {
    console.log('[Mock Server] Servidor cerrado');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n[Mock Server] Recibida señal SIGINT, cerrando...');
  server.close(() => {
    console.log('[Mock Server] Servidor cerrado');
    process.exit(0);
  });
});

export default app;
