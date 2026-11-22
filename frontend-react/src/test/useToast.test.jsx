import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { useToast } from '../hooks/useToast.js';

// Componente helper que expone toast al DOM
function ToastTrigger({ msg, kind }) {
  const toast = useToast();
  return (
    <button onClick={() => toast(msg, kind)}>trigger</button>
  );
}

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'setTimeout', 'clearTimeout'] });
    // limpiar cualquier toast previo en el body
    document.querySelectorAll('.pp-toast').forEach(el => el.remove());
  });
  afterEach(() => {
    vi.useRealTimers();
    document.querySelectorAll('.pp-toast').forEach(el => el.remove());
  });

  it('crea un elemento .pp-toast en document.body al disparar', () => {
    const { getByText } = render(<ToastTrigger msg="Guardado" kind="success" />);
    act(() => {
      getByText('trigger').click();
    });
    const toastEl = document.querySelector('.pp-toast');
    expect(toastEl).not.toBeNull();
    expect(toastEl).toBeInTheDocument();
  });

  it('el toast muestra el mensaje correcto', () => {
    const { getByText } = render(<ToastTrigger msg="Hola Toast" />);
    act(() => {
      getByText('trigger').click();
    });
    const toastEl = document.querySelector('.pp-toast');
    expect(toastEl.textContent).toBe('Hola Toast');
  });

  it('el toast tiene role=status', () => {
    const { getByText } = render(<ToastTrigger msg="X" />);
    act(() => {
      getByText('trigger').click();
    });
    const toastEl = document.querySelector('.pp-toast');
    expect(toastEl.getAttribute('role')).toBe('status');
  });

  it('guarda el kind en data-kind', () => {
    const { getByText } = render(<ToastTrigger msg="X" kind="error" />);
    act(() => {
      getByText('trigger').click();
    });
    const toastEl = document.querySelector('.pp-toast');
    expect(toastEl.dataset.kind).toBe('error');
  });

  it('reutiliza el mismo elemento en llamadas sucesivas', () => {
    const { getByText } = render(<ToastTrigger msg="Uno" />);
    act(() => { getByText('trigger').click(); });
    act(() => { getByText('trigger').click(); });
    const toasts = document.querySelectorAll('.pp-toast');
    expect(toasts.length).toBe(1);
  });

  it('agrega la clase pp-show tras requestAnimationFrame', () => {
    // jsdom implementa RAF como setTimeout(fn, 0) internamente;
    // con fake timers, avanzar > 0ms lo ejecuta antes del timeout de 3200ms
    const { container } = render(<ToastTrigger msg="RAF show test" />);
    act(() => {
      container.querySelector('button').click();
      // Avanzar suficiente para el RAF (setTimeout 0) pero no para el timeout (3200ms)
      vi.advanceTimersByTime(100);
    });
    const toastEl = document.querySelector('.pp-toast');
    expect(toastEl).not.toBeNull();
    expect(toastEl.classList.contains('pp-show')).toBe(true);
  });

  it('elimina la clase pp-show tras 3200ms', () => {
    const { getByText } = render(<ToastTrigger msg="X" />);
    act(() => {
      getByText('trigger').click();
      vi.runAllTimers(); // ejecuta RAF + el setTimeout de 3200ms
    });
    const toastEl = document.querySelector('.pp-toast');
    expect(toastEl.classList.contains('pp-show')).toBe(false);
  });
});
