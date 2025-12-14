import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mockServer;
let viteServer;

// Función para esperar que un servidor esté listo
async function waitForServer(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fetch(url);
      return true;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error(`Servidor no disponible en ${url} después de ${maxAttempts} intentos`);
}

// Función para iniciar mock server
function startMockServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando Mock Server...');
    
    mockServer = spawn('node', ['mockServer.js'], {
      env: { ...process.env, PORT: '5050' },
      stdio: 'inherit',
      shell: true
    });

    mockServer.on('error', (error) => {
      console.error('❌ Error al iniciar Mock Server:', error);
      reject(error);
    });

    // Esperar a que el servidor esté listo
    setTimeout(() => {
      waitForServer('http://localhost:5050/currencies')
        .then(() => {
          console.log('✅ Mock Server listo');
          resolve();
        })
        .catch(reject);
    }, 2000);
  });
}

// Función para iniciar Vite
function startViteServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando Vite Server...');
    
    viteServer = spawn('npm', ['run', 'dev'], {
      env: { ...process.env, VITE_API_BASE_URL: 'http://localhost:5050' },
      stdio: 'inherit',
      shell: true
    });

    viteServer.on('error', (error) => {
      console.error('❌ Error al iniciar Vite:', error);
      reject(error);
    });

    // Esperar a que Vite esté listo
    setTimeout(() => {
      waitForServer('http://localhost:5173')
        .then(() => {
          console.log('✅ Vite Server listo');
          resolve();
        })
        .catch(reject);
    }, 5000);
  });
}

// Función para ejecutar tests
function runTests() {
  return new Promise((resolve, reject) => {
    console.log('🧪 Ejecutando tests E2E...\n');
    
    const jest = spawn('npx', ['jest', '--config', 'jest.e2e.config.js', '--runInBand'], {
      stdio: 'inherit',
      shell: true
    });

    jest.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ Tests E2E completados exitosamente');
        resolve();
      } else {
        console.log(`\n❌ Tests E2E fallaron con código ${code}`);
        reject(new Error(`Tests fallaron con código ${code}`));
      }
    });

    jest.on('error', (error) => {
      console.error('❌ Error al ejecutar tests:', error);
      reject(error);
    });
  });
}

// Función para detener servidores
function stopServers() {
  console.log('\n🛑 Deteniendo servidores...');
  
  if (mockServer) {
    mockServer.kill('SIGTERM');
    console.log('✅ Mock Server detenido');
  }
  
  if (viteServer) {
    viteServer.kill('SIGTERM');
    console.log('✅ Vite Server detenido');
  }
}

// Manejo de señales para limpieza
process.on('SIGINT', () => {
  stopServers();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopServers();
  process.exit(0);
});

// Ejecutar todo el flujo
async function main() {
  try {
    console.log('========================================');
    console.log('🧪 EJECUTANDO PRUEBAS E2E');
    console.log('========================================\n');

    // 1. Iniciar Mock Server
    await startMockServer();

    // 2. Iniciar Vite
    await startViteServer();

    // 3. Ejecutar tests
    await runTests();

    // 4. Detener servidores
    stopServers();

    console.log('\n========================================');
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');
    console.log('========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ ERROR EN PRUEBAS E2E');
    console.error('========================================');
    console.error(error);
    
    stopServers();
    process.exit(1);
  }
}

main();
