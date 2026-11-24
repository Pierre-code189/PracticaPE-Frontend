import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../components/Badge.jsx';

describe('Badge', () => {
  it('renderiza el texto hijo', () => {
    render(<Badge>Publicada</Badge>);
    expect(screen.getByText('Publicada')).toBeInTheDocument();
  });

  it('variante default aplica text-muted', () => {
    render(<Badge variant="default">X</Badge>);
    expect(screen.getByText('X')).toHaveClass('text-muted');
  });

  it('sin variant usa default (text-muted)', () => {
    render(<Badge>X</Badge>);
    expect(screen.getByText('X')).toHaveClass('text-muted');
  });

  it('variante cyan aplica text-cyan', () => {
    render(<Badge variant="cyan">Cyan</Badge>);
    expect(screen.getByText('Cyan')).toHaveClass('text-cyan');
  });

  it('variante violet aplica text-violet', () => {
    render(<Badge variant="violet">Violet</Badge>);
    expect(screen.getByText('Violet')).toHaveClass('text-violet');
  });

  it('variante success aplica text-green-400', () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText('OK')).toHaveClass('text-green-400');
  });

  it('variante danger aplica text-error', () => {
    render(<Badge variant="danger">Error</Badge>);
    expect(screen.getByText('Error')).toHaveClass('text-error');
  });

  it('variante inválida cae en default (text-muted)', () => {
    render(<Badge variant="unknown">?</Badge>);
    expect(screen.getByText('?')).toHaveClass('text-muted');
  });

  it('acepta className extra', () => {
    render(<Badge className="mt-2">Tag</Badge>);
    expect(screen.getByText('Tag')).toHaveClass('mt-2');
  });

  it('es un elemento span', () => {
    const { container } = render(<Badge>Test</Badge>);
    expect(container.querySelector('span')).toBeInTheDocument();
  });

  it('aplica uppercase y tracking-widest', () => {
    render(<Badge>Abc</Badge>);
    const el = screen.getByText('Abc');
    expect(el).toHaveClass('uppercase');
    expect(el).toHaveClass('tracking-widest');
  });
});
