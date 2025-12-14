import '@testing-library/jest-dom';

// Mock para import.meta
global.importMeta = {
  env: {
    VITE_API_BASE_URL: 'https://api.frankfurter.app'
  }
};

// Mock para localStorage - crear objeto con funciones mock
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock para fetch
global.fetch = jest.fn();

// Mock para window.confirm
global.confirm = jest.fn();

// Reset mocks antes de cada test
beforeEach(() => {
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  global.fetch.mockClear();
  global.confirm.mockClear();
});
