# 💱 Cambio de Divisas

Aplicación web React para conversión de divisas en tiempo real usando la API de Frankfurter. Interfaz minimalista y responsive con Bootstrap 5.

## 📋 Características

- ✅ Conversión de divisas en tiempo real
- ✅ Más de 30 monedas disponibles
- ✅ Historial de conversiones persistente (localStorage)
- ✅ Diseño responsive y minimalista con Bootstrap 5
- ✅ Validación completa de formularios
- ✅ Manejo de errores y estados de carga

## 🛠️ Requisitos Previos

- **Node.js** LTS (v18.x o superior recomendado)
- **npm** (incluido con Node.js)
- Conexión a Internet (para consumir la API de Frankfurter)

## 🚀 Instalación y Ejecución

### Opción 1: PowerShell (Recomendado para Windows)

```powershell
# 1. Navegar al directorio del proyecto
cd C:\CPN\UNIR\ProgramacionIA\Cambio_Divisas

# 2. Instalar dependencias (si no se han instalado)
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en: http://localhost:5173
```

### Opción 2: CMD (Símbolo del sistema)

```cmd
REM 1. Navegar al directorio del proyecto
cd C:\CPN\UNIR\ProgramacionIA\Cambio_Divisas

REM 2. Instalar dependencias (si no se han instalado)
npm install

REM 3. Ejecutar en modo desarrollo
npm run dev

REM La aplicación estará disponible en: http://localhost:5173
```

### Comandos Disponibles

```powershell
# Modo desarrollo (con hot-reload)
npm run dev

# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview

# Linting del código
npm run lint
```

## 📁 Estructura del Proyecto

```
Cambio_Divisas/
├── src/
│   ├── api/
│   │   └── frankfurter.js       # Llamadas a la API de Frankfurter
│   ├── storage/
│   │   └── history.js            # Gestión de localStorage
│   ├── components/
│   │   ├── ConverterForm.jsx    # Formulario de conversión
│   │   └── HistoryTable.jsx     # Tabla de historial
│   ├── App.jsx                   # Componente principal
│   └── main.jsx                  # Punto de entrada
├── package.json
└── README.md
```

## 🌐 API Utilizada

**Frankfurter API** - API gratuita de tasas de cambio de divisas

- **Endpoint de monedas**: `https://api.frankfurter.app/currencies`
- **Endpoint de conversión**: `https://api.frankfurter.app/latest?amount={amount}&from={from}&to={to}`
- **Documentación oficial**: https://frankfurter.dev/

### Ejemplo de uso de la API

```javascript
// Obtener todas las monedas disponibles
GET https://api.frankfurter.app/currencies

// Convertir 100 USD a EUR
GET https://api.frankfurter.app/latest?amount=100&from=USD&to=EUR
```

## 💾 Persistencia de Datos

El historial de conversiones se almacena en **localStorage** del navegador con la clave `cambio_divisas_history`.

Cada entrada del historial incluye:
- `id`: Identificador único (timestamp + random)
- `createdAt`: Fecha y hora de la conversión (ISO string)
- `amount`: Monto original
- `from`: Código de moneda origen
- `to`: Código de moneda destino
- `rate`: Tasa de cambio aplicada
- `result`: Resultado de la conversión

**Límite**: Se conservan las últimas 20 conversiones.

## ✨ Características de la UI

### Diseño Responsive
- **Móvil**: Controles apilados verticalmente
- **Tablet/Desktop**: Grid de 2 columnas para selects de monedas

### Validaciones
- ✓ Monto debe ser número válido > 0
- ✓ Ambas monedas deben estar seleccionadas
- ✓ Monedas de origen y destino deben ser diferentes
- ✓ Mensajes de error claros y específicos

### Estados Visuales
- **Loading**: Spinner de Bootstrap durante carga de datos
- **Error**: Alertas Bootstrap para errores de red o validación
- **Success**: Card destacada con resultado de conversión

## 🔧 Tecnologías Utilizadas

- **React 18** - Biblioteca UI
- **Vite** - Build tool y dev server
- **Bootstrap 5** - Framework CSS
- **Frankfurter API** - Datos de divisas
- **localStorage** - Persistencia del historial

## 📝 Notas Importantes

1. **Endpoint correcto**: Se utiliza `https://api.frankfurter.app` (no `frankfurter.dev` directamente para las peticiones de API).

2. **Sin base de datos**: Todo el historial se guarda en localStorage del navegador. Si se borran los datos del navegador, se perderá el historial.

3. **Conexión a Internet requerida**: La aplicación necesita conexión para obtener las tasas de cambio actualizadas.

4. **Limitaciones de la API**: Frankfurter es una API gratuita sin autenticación. En producción considera límites de tasa si hay alto volumen de peticiones.

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```powershell
# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install
```

### Puerto 5173 ya en uso
```powershell
# Cambiar puerto en ejecución
npm run dev -- --port 3000
```

### No se cargan las monedas
- Verifica tu conexión a Internet
- Comprueba que la API de Frankfurter esté disponible: https://api.frankfurter.app/currencies
- Revisa la consola del navegador para errores

## 👨‍💻 Desarrollo

Para contribuir o modificar el proyecto:

1. Clona o navega al proyecto
2. Instala dependencias: `npm install`
3. Ejecuta en modo desarrollo: `npm run dev`
4. Realiza tus cambios
5. Prueba la compilación: `npm run build`

## 📄 Licencia

Proyecto educativo para UNIR - Programación IA

---

**Desarrollado con ❤️ usando React + Vite + Bootstrap 5**
