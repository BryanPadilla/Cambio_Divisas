import { Builder, By, until, Key } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';

const APP_URL = 'http://localhost:5173';
const TIMEOUT = 10000;

describe('E2E Tests - Cambio de Divisas', () => {
  let driver;
  let options;

  beforeAll(async () => {
    options = new chrome.Options();
    
    // Configurar headless si se requiere
    if (process.env.HEADLESS === 'true') {
      options.addArguments('--headless');
      options.addArguments('--disable-gpu');
    }
    
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--window-size=1920,1080');

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    await driver.manage().setTimeouts({ implicit: TIMEOUT });
  }, 30000);

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  beforeEach(async () => {
    // Limpiar localStorage antes de cada test
    await driver.get(APP_URL);
    await driver.executeScript('window.localStorage.clear()');
    await driver.navigate().refresh();
  });

  test('E2E-01: Flujo feliz - Conversión exitosa', async () => {
    await driver.get(APP_URL);

    // Esperar a que cargue el formulario
    const amountInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="amount-input"]')),
      TIMEOUT
    );

    // Ingresar datos
    await amountInput.clear();
    await amountInput.sendKeys('100');

    const fromSelect = await driver.findElement(By.css('[data-testid="from-select"]'));
    await fromSelect.sendKeys('USD');

    const toSelect = await driver.findElement(By.css('[data-testid="to-select"]'));
    await toSelect.sendKeys('EUR');

    // Click en convertir
    const convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    // Esperar resultado
    const result = await driver.wait(
      until.elementLocated(By.css('[data-testid="conversion-result"]')),
      TIMEOUT
    );

    expect(await result.isDisplayed()).toBe(true);
    
    const resultText = await result.getText();
    expect(resultText).toContain('Resultado');
  }, 30000);

  test('E2E-02: Validación - Valor negativo muestra alert', async () => {
    await driver.get(APP_URL);

    const amountInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="amount-input"]')),
      TIMEOUT
    );

    await amountInput.clear();
    await amountInput.sendKeys('-10');

    const convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    // Verificar mensaje de error
    const errorMessage = await driver.wait(
      until.elementLocated(By.css('[data-testid="error-message"]')),
      TIMEOUT
    );

    expect(await errorMessage.isDisplayed()).toBe(true);
    const errorText = await errorMessage.getText();
    expect(errorText).toContain('válido');
  }, 30000);

  test('E2E-03: Validación - Misma moneda muestra alert', async () => {
    await driver.get(APP_URL);

    const amountInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="amount-input"]')),
      TIMEOUT
    );

    await amountInput.clear();
    await amountInput.sendKeys('100');

    const fromSelect = await driver.findElement(By.css('[data-testid="from-select"]'));
    await fromSelect.sendKeys('USD');

    const toSelect = await driver.findElement(By.css('[data-testid="to-select"]'));
    await toSelect.sendKeys('USD');

    const convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.css('[data-testid="error-message"]')),
      TIMEOUT
    );

    expect(await errorMessage.isDisplayed()).toBe(true);
    const errorText = await errorMessage.getText();
    expect(errorText).toContain('diferentes');
  }, 30000);

  test('E2E-04: Validación - Sin valor muestra alert', async () => {
    await driver.get(APP_URL);

    const convertButton = await driver.wait(
      until.elementLocated(By.css('[data-testid="convert-button"]')),
      TIMEOUT
    );

    await convertButton.click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.css('[data-testid="error-message"]')),
      TIMEOUT
    );

    expect(await errorMessage.isDisplayed()).toBe(true);
    const errorText = await errorMessage.getText();
    expect(errorText).toContain('válido');
  }, 30000);

  test('E2E-05: Historial - Se guarda conversión', async () => {
    await driver.get(APP_URL);

    // Realizar conversión
    const amountInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="amount-input"]')),
      TIMEOUT
    );

    await amountInput.clear();
    await amountInput.sendKeys('50');

    const convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    // Esperar resultado
    await driver.wait(
      until.elementLocated(By.css('[data-testid="conversion-result"]')),
      TIMEOUT
    );

    // Verificar que aparece en historial
    const historyTable = await driver.wait(
      until.elementLocated(By.css('[data-testid="history-table"]')),
      TIMEOUT
    );

    expect(await historyTable.isDisplayed()).toBe(true);
    
    const historyText = await historyTable.getText();
    expect(historyText).toContain('50');
  }, 30000);

  test('E2E-06: Historial - Limpiar historial', async () => {
    await driver.get(APP_URL);

    // Realizar conversión primero
    const amountInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="amount-input"]')),
      TIMEOUT
    );

    await amountInput.clear();
    await amountInput.sendKeys('25');

    const convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    // Esperar historial
    await driver.wait(
      until.elementLocated(By.css('[data-testid="history-table"]')),
      TIMEOUT
    );

    // Click en limpiar historial
    const clearButton = await driver.findElement(By.css('[data-testid="clear-history-button"]'));
    await clearButton.click();

    // Aceptar confirmación
    await driver.wait(until.alertIsPresent(), TIMEOUT);
    const alert = await driver.switchTo().alert();
    await alert.accept();

    // Verificar que el historial está vacío
    await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'No hay conversiones en el historial')]")),
      TIMEOUT
    );

    const emptyMessage = await driver.findElement(
      By.xpath("//*[contains(text(), 'No hay conversiones en el historial')]")
    );
    expect(await emptyMessage.isDisplayed()).toBe(true);
  }, 30000);

  test('E2E-07: Múltiples conversiones sucesivas', async () => {
    await driver.get(APP_URL);

    const amountInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="amount-input"]')),
      TIMEOUT
    );

    // Primera conversión
    await amountInput.clear();
    await amountInput.sendKeys('10');
    
    let convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    await driver.wait(
      until.elementLocated(By.css('[data-testid="conversion-result"]')),
      TIMEOUT
    );

    // Segunda conversión
    await driver.sleep(500); // Pequeña pausa entre conversiones
    await amountInput.clear();
    await amountInput.sendKeys('20');
    
    convertButton = await driver.findElement(By.css('[data-testid="convert-button"]'));
    await convertButton.click();

    await driver.wait(
      until.elementLocated(By.css('[data-testid="conversion-result"]')),
      TIMEOUT
    );

    // Verificar que hay 2 entradas en historial
    const historyTable = await driver.findElement(By.css('[data-testid="history-table"]'));
    const rows = await historyTable.findElements(By.css('tbody tr'));
    
    expect(rows.length).toBe(2);
  }, 30000);
});
