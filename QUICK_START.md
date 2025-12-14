# ⚡ QUICK START GUIDE - Testing Setup

## 🚀 Instalación Rápida (5 minutos)

### 1️⃣ Instalar Dependencias de Testing

Copia y pega este comando en PowerShell o CMD:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @babel/core @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy selenium-webdriver chromedriver express cors node-fetch
```

⏱️ **Tiempo estimado**: 2-3 minutos

---

### 2️⃣ Verificar que Todo Funcione

#### Tests Unitarios

```bash
npm test
```

✅ **Resultado esperado**: 45 tests pasando

#### Tests con Cobertura

```bash
npm run test:coverage
```

✅ **Resultado esperado**: Cobertura >70% en todas las métricas

#### Tests E2E

```bash
npm run e2e
```

✅ **Resultado esperado**: 7 tests E2E pasando

---

## 📋 Checklist Rápido

- [ ] Instaladas dependencias (`npm install --save-dev ...`)
- [ ] `npm test` ejecuta sin errores
- [ ] `npm run test:coverage` muestra >70% cobertura
- [ ] Chrome instalado (para E2E)
- [ ] `npm run e2e` ejecuta sin errores

---

## 🆘 Problemas Comunes

### ❌ Error: "jest: command not found"

**Solución**:
```bash
npm install
```

### ❌ Error: "ChromeDriver version mismatch"

**Solución**:
```bash
# Verifica versión de Chrome: chrome://version
npm install --save-dev chromedriver@<tu_version>
```

### ❌ Puerto 5173 o 5050 ocupado

**Solución**:
```powershell
# PowerShell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess -Force
```

```cmd
:: CMD
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## 📚 Documentación Completa

Si necesitas más detalles, consulta:

1. **[TESTING.md](TESTING.md)** - Guía completa de testing
2. **[INSTALL_DEPENDENCIES.md](INSTALL_DEPENDENCIES.md)** - Instalación detallada
3. **[RESUMEN_ENTREGABLES.md](RESUMEN_ENTREGABLES.md)** - Resumen ejecutivo

---

## 🎯 Comandos Esenciales

```bash
# Tests unitarios
npm test

# Tests con watch (TDD)
npm run test:watch

# Cobertura
npm run test:coverage

# E2E
npm run e2e

# E2E headless
HEADLESS=true npm run e2e

# Mock server (manual)
npm run mock-server
```

---

## ✅ ¡Todo Listo!

Si todos los comandos anteriores funcionan, ¡estás listo para empezar a testear! 🎉

### Próximos pasos:

1. Explora los tests en `src/**/*.test.{js,jsx}`
2. Modifica un componente y ve los tests fallar
3. Arregla el componente y ve los tests pasar
4. Ejecuta E2E para ver Selenium en acción

**¡Happy Testing!** 🧪
