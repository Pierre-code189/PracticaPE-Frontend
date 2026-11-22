import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from '../components/Input.jsx';

describe('Input', () => {
  // ── label ──────────────────────────────────────────────────────────────────
  it('renderiza el input básico sin label ni error', () => {
    render(<Input name="email" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('muestra el label cuando se proporciona', () => {
    render(<Input label="Correo" name="email" />);
    expect(screen.getByText('Correo')).toBeInTheDocument();
  });

  it('el label apunta al input mediante htmlFor', () => {
    render(<Input label="Nombre" id="nombre" name="nombre" />);
    const label = screen.getByText('Nombre');
    expect(label).toHaveAttribute('for', 'nombre');
  });

  it('usa name como id cuando no se da id', () => {
    render(<Input label="Correo" name="correo" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'correo');
  });

  it('no renderiza label cuando no se pasa', () => {
    render(<Input name="email" />);
    expect(screen.queryByRole('label')).toBeNull();
  });

  // ── error ──────────────────────────────────────────────────────────────────
  it('muestra el mensaje de error', () => {
    render(<Input name="email" error="Campo requerido" />);
    expect(screen.getByText('Campo requerido')).toBeInTheDocument();
  });

  it('el error tiene clase text-red-400', () => {
    render(<Input name="email" error="Error!" />);
    expect(screen.getByText('Error!')).toHaveClass('text-red-400');
  });

  it('no renderiza span de error cuando no hay error', () => {
    const { container } = render(<Input name="email" />);
    // ningún span con clase text-red-400
    expect(container.querySelector('.text-red-400')).toBeNull();
  });

  // ── props pasadas al input ─────────────────────────────────────────────────
  it('pasa placeholder al input', () => {
    render(<Input name="q" placeholder="Busca..." />);
    expect(screen.getByPlaceholderText('Busca...')).toBeInTheDocument();
  });

  it('pasa type=password', () => {
    render(<Input name="pass" type="password" />);
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });

  it('acepta className extra en el wrapper', () => {
    const { container } = render(<Input name="x" className="mb-4" />);
    expect(container.firstChild).toHaveClass('mb-4');
  });
});
