import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  money,
  fecha,
  initials,
  salario,
  debounce,
  saveSession,
  currentUser,
  clearSession,
  esc,
} from '../api/utils.js';

// ── money ────────────────────────────────────────────────────────────────────
describe('money()', () => {
  it('formatea un número entero', () => {
    expect(money(1500)).toMatch(/^S\//);
    expect(money(1500)).toContain('1');
  });

  it('formatea string numérico', () => {
    expect(money('2500')).toMatch(/^S\//);
  });

  it('devuelve "S/ 0" para string sin dígitos (strip deja 0)', () => {
    // money('abc'): strip deja '', Number('')===0, isFinite(0)===true → 'S/ 0'
    expect(money('abc')).toBe('S/ 0');
  });

  it('formatea cero', () => {
    expect(money(0)).toBe('S/ 0');
  });

  it('ignora caracteres no numéricos y formatea', () => {
    expect(money('1,500.00')).toMatch(/^S\//);
  });
});

// ── fecha ────────────────────────────────────────────────────────────────────
describe('fecha()', () => {
  it('devuelve string vacío con input falsy', () => {
    expect(fecha('')).toBe('');
    expect(fecha(null)).toBe('');
    expect(fecha(undefined)).toBe('');
  });

  it('formatea una fecha ISO', () => {
    const result = fecha('2024-06-15');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    // debe contener el año
    expect(result).toContain('2024');
  });

  it('devuelve el string original si la fecha es inválida', () => {
    expect(fecha('no-es-fecha')).toBe('no-es-fecha');
  });
});

// ── initials ─────────────────────────────────────────────────────────────────
describe('initials()', () => {
  it('extrae iniciales de nombre y apellido', () => {
    expect(initials('Juan Pérez')).toBe('JP');
  });

  it('usa solo la primera letra de cada palabra (máx 2)', () => {
    expect(initials('Ana María López')).toBe('AM');
  });

  it('nombre de una sola palabra', () => {
    expect(initials('Carlos')).toBe('C');
  });

  it('devuelve ? con input vacío', () => {
    expect(initials('')).toBe('?');
    expect(initials(null)).toBe('?');
    expect(initials(undefined)).toBe('?');
  });

  it('devuelve mayúsculas', () => {
    expect(initials('gabriel silva')).toBe('GS');
  });
});

// ── salario ──────────────────────────────────────────────────────────────────
describe('salario()', () => {
  it('devuelve vacío si no hay oferta', () => {
    expect(salario(null)).toBe('');
    expect(salario(undefined)).toBe('');
  });

  it('devuelve vacío si no hay salary', () => {
    expect(salario({})).toBe('');
    expect(salario({ salary: '' })).toBe('');
  });

  it('agrega prefijo S/ y sufijo /m si falta', () => {
    const result = salario({ salary: '1200' });
    expect(result).toMatch(/^S\//);
    expect(result).toMatch(/\/m$/);
  });

  it('no duplica S/ si ya lo tiene', () => {
    const result = salario({ salary: 'S/ 1200' });
    // no debe empezar con "S/ S/"
    expect(result.startsWith('S/ S/')).toBe(false);
    expect(result).toMatch(/^S\//);
  });

  it('no agrega /m si ya tiene /mes', () => {
    const result = salario({ salary: 'S/ 1200/mes' });
    expect(result).not.toMatch(/\/m\/m/);
  });
});

// ── debounce ─────────────────────────────────────────────────────────────────
describe('debounce()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('no invoca la función inmediatamente', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);
    debouncedFn('x');
    expect(fn).not.toHaveBeenCalled();
  });

  it('invoca la función tras el delay', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);
    debouncedFn('x');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('x');
  });

  it('cancela llamadas intermedias (trailing)', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 300);
    debouncedFn('a');
    debouncedFn('b');
    debouncedFn('c');
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledOnce();
    expect(fn).toHaveBeenCalledWith('c');
  });

  it('usa 300ms por defecto', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn); // sin ms explícito
    debouncedFn();
    vi.advanceTimersByTime(299);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledOnce();
  });
});

// ── esc ──────────────────────────────────────────────────────────────────────
describe('esc()', () => {
  it('escapa caracteres HTML peligrosos', () => {
    expect(esc('<script>')).toBe('&lt;script&gt;');
    expect(esc('"hola"')).toBe('&quot;hola&quot;');
    expect(esc("it's")).toBe('it&#39;s');
    expect(esc('a & b')).toBe('a &amp; b');
  });

  it('devuelve string vacío con null/undefined', () => {
    expect(esc(null)).toBe('');
    expect(esc(undefined)).toBe('');
  });
});

// ── session helpers ──────────────────────────────────────────────────────────
describe('session helpers (saveSession / currentUser / clearSession)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saveSession guarda token y user', () => {
    saveSession('tok123', { id: 1, email: 'a@b.com' });
    expect(localStorage.getItem('pp_token')).toBe('tok123');
    expect(localStorage.getItem('pp_user')).toContain('a@b.com');
  });

  it('currentUser devuelve null cuando no hay sesión', () => {
    expect(currentUser()).toBeNull();
  });

  it('currentUser devuelve el objeto guardado', () => {
    saveSession('tok', { id: 42, role: 'candidate' });
    expect(currentUser()).toEqual({ id: 42, role: 'candidate' });
  });

  it('clearSession limpia localStorage', () => {
    saveSession('tok', { id: 1 });
    clearSession();
    expect(localStorage.getItem('pp_token')).toBeNull();
    expect(localStorage.getItem('pp_user')).toBeNull();
    expect(currentUser()).toBeNull();
  });
});
