import { vi } from 'vitest';

// Mock global de Font Awesome
vi.mock('@fortawesome/fontawesome-free', () => ({}));

// Configurar mocks globales
Object.defineProperty(window, 'confirm', {
  value: vi.fn(() => true),
  writable: true,
});

Object.defineProperty(window, 'alert', {
  value: vi.fn(),
  writable: true,
});

// Mock de console.error para evitar ruido en los tests
const originalConsoleError = console.error;
console.error = vi.fn((...args) => {
  // Solo mostrar errores que no sean de testing
  if (!args.some(arg => typeof arg === 'string' && arg.includes('test'))) {
    originalConsoleError(...args);
  }
});

// Configurar timezone para pruebas consistentes
process.env.TZ = 'UTC';
