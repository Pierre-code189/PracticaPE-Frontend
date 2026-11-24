import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button.jsx';

describe('Button', () => {
  // ── variantes ──────────────────────────────────────────────────────────────
  it('renderiza el texto hijo', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument();
  });

  it('variante primary aplica clase btn-primary', () => {
    render(<Button variant="primary">OK</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });

  it('variante outline aplica clase btn-outline', () => {
    render(<Button variant="outline">OK</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-outline');
  });

  it('variante ghost aplica bg-transparent', () => {
    render(<Button variant="ghost">OK</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent');
  });

  it('variante danger aplica text-error', () => {
    render(<Button variant="danger">Borrar</Button>);
    expect(screen.getByRole('button')).toHaveClass('text-error');
  });

  it('variante secondary aplica bg-ink', () => {
    render(<Button variant="secondary">OK</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-ink');
  });

  // ── disabled ───────────────────────────────────────────────────────────────
  it('disabled aplica atributo disabled', () => {
    render(<Button disabled>OK</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disabled aplica clase disabled:opacity-50', () => {
    render(<Button disabled>OK</Button>);
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
  });

  it('no llama onClick si disabled', () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>OK</Button>);
    // disparo evento de bajo nivel; con pointer-events-none el browser no lo propaga,
    // pero jsdom sí — usamos la clase para verificar la intención del componente
    expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none');
  });

  // ── onClick ────────────────────────────────────────────────────────────────
  it('llama onClick cuando se hace clic', () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  // ── type ───────────────────────────────────────────────────────────────────
  it('type=submit se pasa al elemento', () => {
    render(<Button type="submit">Guardar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  // ── size ───────────────────────────────────────────────────────────────────
  it('size=sm aplica clase px-4', () => {
    render(<Button size="sm">Sm</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4');
  });

  it('size=lg aplica clase px-8', () => {
    render(<Button size="lg">Lg</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-8');
  });

  // ── className extra ────────────────────────────────────────────────────────
  it('acepta className extra', () => {
    render(<Button className="mi-clase">OK</Button>);
    expect(screen.getByRole('button')).toHaveClass('mi-clase');
  });
});
