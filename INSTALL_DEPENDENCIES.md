# 📦 INSTALACIÓN DE DEPENDENCIAS - TESTING

## Comando Único (Recomendado)

### PowerShell o CMD

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @babel/core @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy selenium-webdriver chromedriver express cors node-fetch
```

---

## Comandos Separados por Categoría

### 1. Jest y Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Qué hace**: Instala Jest (framework de testing) y React Testing Library para testear componentes React.

---

### 2. Babel (Para transformar JSX)

```bash
npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-jest
```

**Qué hace**: Permite que Jest entienda y ejecute código JSX/React.

---

### 3. Identity Object Proxy (Para CSS)

```bash
npm install --save-dev identity-obj-proxy
```

**Qué hace**: Mock de CSS modules para que Jest no falle al importar archivos CSS.

---

### 4. Selenium WebDriver (Para E2E)

```bash
npm install --save-dev selenium-webdriver chromedriver
```

**Qué hace**: Instala Selenium y el driver de Chrome para pruebas End-to-End automatizadas.

**Requisito**: Tener Google Chrome instalado.

---

### 5. Express y CORS (Para Mock Server)

```bash
npm install --save-dev express cors
```

**Qué hace**: Instala Express (servidor web) y CORS para el mock server de pruebas E2E.

---

### 6. Node-Fetch (Para el runner E2E)

```bash
npm install --save-dev node-fetch
```

**Qué hace**: Permite hacer peticiones HTTP desde Node.js (usado por el runner de E2E).

---

## Verificar Instalación

Después de instalar, verifica que el `package.json` incluya todas estas dependencias en `devDependencies`:

```bash
npm list --depth=0
```

Deberías ver:

```
├── @babel/core
├── @babel/preset-env
├── @babel/preset-react
├── @testing-library/jest-dom
├── @testing-library/react
├── @testing-library/user-event
├── babel-jest
├── chromedriver
├── cors
├── express
├── identity-obj-proxy
├── jest
├── node-fetch
├── selenium-webdriver
```

---

## Próximos Pasos

Una vez instaladas las dependencias:

1. **Ejecutar tests unitarios**:
   ```bash
   npm test
   ```

2. **Ejecutar con cobertura**:
   ```bash
   npm run test:coverage
   ```

3. **Ejecutar tests E2E**:
   ```bash
   npm run e2e
   ```

---

## Troubleshooting Instalación

### Error: `npm ERR! peer dependencies`

**Solución**: Usa `--legacy-peer-deps`
```bash
npm install --legacy-peer-deps --save-dev <paquetes>
```

### Error: `chromedriver` no se instala

**Solución**: Instala manualmente la versión compatible con tu Chrome
```bash
# Verifica versión de Chrome en chrome://version
npm install --save-dev chromedriver@119  # Reemplaza con tu versión
```

### Error: `EACCES` (permisos)

**Solución en Windows**: Ejecuta PowerShell/CMD como Administrador

---

## Resumen de Tamaños

Estas dependencias ocuparán aproximadamente:

- **node_modules**: ~350 MB
- **Tiempo de instalación**: 2-5 minutos (depende de conexión)

---

**¡Listo para empezar a testear! 🚀**
