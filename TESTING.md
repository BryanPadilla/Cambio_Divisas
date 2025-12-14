# 🧪 Testing Documentation - Cambio de Divisas

Este documento contiene toda la información necesaria para ejecutar las pruebas automatizadas del proyecto Cambio de Divisas.

## 📋 Tabla de Contenidos

1. [Instalación de Dependencias](#instalación-de-dependencias)
2. [Configuración](#configuración)
3. [Pruebas Jest (Unit + Integration)](#pruebas-jest-unit--integration)
4. [Pruebas E2E con Selenium](#pruebas-e2e-con-selenium)
5. [Mock Server](#mock-server)
6. [Troubleshooting](#troubleshooting)

---

## 📦 Instalación de Dependencias

### Opción 1: PowerShell

```powershell
# Dependencias de Jest y Testing Library
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Babel para transformar JSX en Jest
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest

# Identity-obj-proxy para CSS modules
npm install --save-dev identity-obj-proxy

# Selenium WebDriver para E2E
npm install --save-dev selenium-webdriver chromedriver

# Express y CORS para Mock Server
npm install --save-dev express cors

# Node-fetch para el runner de E2E
npm install --save-dev node-fetch
```

### Opción 2: CMD

```cmd
:: Mismos comandos que PowerShell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest
npm install --save-dev identity-obj-proxy
npm install --save-dev selenium-webdriver chromedriver
npm install --save-dev express cors
npm install --save-dev node-fetch
```

### Instalación de un solo comando

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @babel/core @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy selenium-webdriver chromedriver express cors node-fetch
```

---

## ⚙️ Configuración

### Archivos de configuración creados:

- **`jest.config.js`** - Configuración principal de Jest
- **`babel.config.cjs`** - Configuración de Babel para JSX
- **`src/setupTests.js`** - Setup global de Jest (mocks de localStorage, fetch, etc.)
- **`jest.e2e.config.js`** - Configuración específica para E2E
- **`.env.example`** - Ejemplo de variables de entorno

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto (opcional):

```env
VITE_API_BASE_URL=https://api.frankfurter.app
```

Para pruebas E2E, el runner automáticamente usa `http://localhost:5050`.

---

## 🧪 Pruebas Jest (Unit + Integration)

### Ejecutar todas las pruebas

```bash
npm test
```

### Ejecutar en modo watch

```bash
npm run test:watch
```

### Generar reporte de cobertura

```bash
npm run test:coverage
```

El reporte se genera en la carpeta `coverage/`.

### Estructura de Tests

```
src/
├── api/
│   ├── fetchWithTimeout.test.js      # Tests del wrapper de timeout
│   └── frankfurter.test.js           # Tests de llamadas a API
├── storage/
│   └── history.test.js               # Tests de localStorage
├── components/
│   ├── ConverterForm.test.jsx        # Tests del formulario
│   └── HistoryTable.test.jsx         # Tests de la tabla
└── App.test.jsx                      # Tests de integración
```

### Casos de Prueba Cubiertos

#### ✅ Casos de Éxito
1. Conversión 10 USD → EUR
2. Conversión 25 EUR → JPY
3. Conversión 100 GBP → USD

#### ❌ Validaciones y Errores
1. Valor negativo → No llama API, muestra error
2. Misma moneda (from === to) → No llama API, muestra error
3. Sin valor (vacío/NaN/0) → No llama API, muestra error
4. Error de conexión → Muestra mensaje de error
5. Timeout → Muestra "Tiempo de espera agotado"

#### 💾 Persistencia
1. Guarda conversiones con estructura correcta
2. Limita historial a 20 entradas
3. Limpia historial correctamente

### Ver resultados en terminal

```
PASS  src/api/fetchWithTimeout.test.js
PASS  src/api/frankfurter.test.js
PASS  src/storage/history.test.js
PASS  src/components/ConverterForm.test.jsx
PASS  src/components/HistoryTable.test.jsx
PASS  src/App.test.jsx

Test Suites: 6 passed, 6 total
Tests:       45 passed, 45 total
```

---

## 🌐 Pruebas E2E con Selenium

### Pre-requisitos

1. **Google Chrome** instalado
2. **ChromeDriver** compatible con tu versión de Chrome (se instala automáticamente con el paquete)

### Ejecutar pruebas E2E

```bash
npm run e2e
```

Este comando:
1. Inicia el Mock Server en `http://localhost:5050`
2. Inicia Vite en `http://localhost:5173`
3. Ejecuta las pruebas E2E con Selenium
4. Detiene ambos servidores al finalizar

### Ejecutar en modo headless

```bash
# PowerShell
$env:HEADLESS="true"; npm run e2e

# CMD
set HEADLESS=true && npm run e2e

# Bash/Git Bash
HEADLESS=true npm run e2e
```

### Casos E2E Cubiertos

1. **E2E-01**: Flujo feliz - Conversión exitosa
2. **E2E-02**: Validación - Valor negativo muestra alert
3. **E2E-03**: Validación - Misma moneda muestra alert
4. **E2E-04**: Validación - Sin valor muestra alert
5. **E2E-05**: Historial - Se guarda conversión
6. **E2E-06**: Historial - Limpiar historial
7. **E2E-07**: Múltiples conversiones sucesivas

### Estructura E2E

```
e2e/
├── app.e2e.test.js       # Tests E2E con Selenium
└── run-e2e.js            # Runner que orquesta mock server + vite + tests
```

---

## 🎭 Mock Server

El Mock Server simula la API de Frankfurter para pruebas E2E.

### Iniciar manualmente

```bash
npm run mock-server
```

El servidor estará disponible en `http://localhost:5050`

### Endpoints disponibles

- **GET** `/currencies` - Retorna lista de monedas
- **GET** `/latest?amount=X&from=Y&to=Z` - Retorna conversión
- **POST** `/mock/mode` - Cambia modo de simulación (success/timeout/error)
- **GET** `/mock/mode` - Obtiene modo actual

### Cambiar modo de simulación

```bash
# Modo éxito (default)
curl -X POST http://localhost:5050/mock/mode -H "Content-Type: application/json" -d "{\"mode\": \"success\"}"

# Modo timeout (no responde)
curl -X POST http://localhost:5050/mock/mode -H "Content-Type: application/json" -d "{\"mode\": \"timeout\"}"

# Modo error (retorna 500)
curl -X POST http://localhost:5050/mock/mode -H "Content-Type: application/json" -d "{\"mode\": \"error\"}"
```

---

## 🔧 Troubleshooting

### Problema: `jest: command not found`

**Solución**: Asegúrate de haber instalado las dependencias:
```bash
npm install
```

### Problema: Tests de Jest fallan con error de JSX

**Solución**: Verifica que `babel.config.cjs` existe y está configurado correctamente.

### Problema: ChromeDriver no compatible

**Solución**:
1. Verifica tu versión de Chrome: `chrome://version`
2. Instala ChromeDriver compatible:
   ```bash
   npm install --save-dev chromedriver@<version>
   ```

### Problema: Puerto 5173 o 5050 ya en uso

**Solución**:
```powershell
# PowerShell - Encontrar proceso usando puerto
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess

# Matar proceso
Stop-Process -Id <PID>
```

```cmd
:: CMD - Matar proceso en puerto
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Problema: Tests E2E fallan con timeout

**Solución**:
1. Asegúrate de que el Mock Server esté corriendo
2. Verifica que Vite esté corriendo
3. Aumenta el timeout en `jest.e2e.config.js`:
   ```js
   testTimeout: 120000 // 2 minutos
   ```

### Problema: Error de CORS en Mock Server

**Solución**: El Mock Server ya tiene CORS habilitado. Verifica que:
1. El Mock Server esté corriendo
2. La variable `VITE_API_BASE_URL` esté correctamente configurada

### Problema: localStorage no funciona en tests

**Solución**: Ya está mockeado en `setupTests.js`. Si necesitas reiniciarlo:
```js
beforeEach(() => {
  localStorage.clear();
});
```

### Problema: Tests de React fallan con "Cannot find module 'react'"

**Solución**:
```bash
npm install react react-dom
```

### Problema: E2E falla con "Chrome failed to start"

**Solución**:
1. Instala Chrome si no lo tienes
2. Ejecuta en modo headless:
   ```bash
   HEADLESS=true npm run e2e
   ```

---

## 📊 Cobertura de Código

Objetivo de cobertura configurado en `jest.config.js`:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

Para ver el reporte de cobertura detallado:

```bash
npm run test:coverage
# Luego abrir: coverage/lcov-report/index.html
```

---

## 🚀 Flujo de Trabajo Recomendado

### Desarrollo con TDD

1. Escribe el test
2. Ejecuta `npm run test:watch`
3. Implementa el código
4. Verifica que el test pase
5. Refactoriza

### Antes de hacer commit

```bash
npm test && npm run e2e
```

### CI/CD

Agrega estos comandos a tu pipeline:

```yaml
- name: Run Unit Tests
  run: npm test

- name: Run E2E Tests
  run: npm run e2e
  env:
    HEADLESS: true
```

---

## 📝 Notas Importantes

1. **data-testid**: Todos los elementos interactivos tienen `data-testid` para facilitar testing
2. **fetchWithTimeout**: Implementado con `AbortController` para manejar timeouts
3. **API_BASE_URL**: Configurable via `VITE_API_BASE_URL` para permitir mock server
4. **Historial**: Limitado a 20 entradas, se guarda en `localStorage` con clave `cambio_divisas_history`

---

## 🆘 Soporte

Si encuentras problemas no documentados aquí:

1. Verifica que todas las dependencias estén instaladas
2. Revisa los logs de error en consola
3. Asegúrate de que los puertos 5050 y 5173 estén disponibles
4. Verifica que Chrome y ChromeDriver estén actualizados

---

## ✅ Checklist de Testing

- [ ] Instaladas todas las dependencias
- [ ] `npm test` ejecuta sin errores
- [ ] Cobertura > 70% en todas las métricas
- [ ] Mock Server inicia correctamente
- [ ] `npm run e2e` ejecuta sin errores
- [ ] Tests pasan en modo headless
- [ ] No hay warnings en consola

---

**¡Feliz Testing! 🎉**
