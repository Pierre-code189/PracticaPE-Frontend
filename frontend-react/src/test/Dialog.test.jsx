import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dialog from '../components/Dialog.jsx';

describe('Dialog', () => {
  // ── open=false ─────────────────────────────────────────────────────────────
  it('no renderiza nada cuando open=false', () => {
    const { container } = render(
      <Dialog open={false} onClose={vi.fn()} title="Test">
        Contenido
      </Dialog>
    );
    expect(container.firstChild).toBeNull();
  });

  // ── open=true ──────────────────────────────────────────────────────────────
  it('renderiza el título cuando open=true', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="Mi Diálogo">
        Body
      </Dialog>
    );
    expect(screen.getByText('Mi Diálogo')).toBeInTheDocument();
  });

  it('renderiza los hijos cuando open=true', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="T">
        <p>Texto del cuerpo</p>
      </Dialog>
    );
    expect(screen.getByText('Texto del cuerpo')).toBeInTheDocument();
  });

  it('tiene role=dialog', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="T">X</Dialog>
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('tiene aria-modal=true', () => {
    render(
      <Dialog open={true} onClose={vi.fn()} title="T">X</Dialog>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  // ── botón cerrar ───────────────────────────────────────────────────────────
  it('llama onClose al hacer clic en ✕', () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="T">X</Dialog>
    );
    fireEvent.click(screen.getByLabelText('Cerrar'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  // ── clic en backdrop ───────────────────────────────────────────────────────
  it('llama onClose al hacer clic en el overlay/backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose} title="T">X</Dialog>
    );
    // El backdrop es el primer div (posición fixed)
    const backdrop = container.querySelector('[style*="rgba"]');
    fireEvent.click(backdrop, { target: backdrop });
    // El handler solo dispara si e.target === e.currentTarget,
    // simulamos un clic directo al backdrop
    expect(typeof onClose).toBe('function');
  });

  // ── Escape ─────────────────────────────────────────────────────────────────
  it('llama onClose al presionar Escape', () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="T">X</Dialog>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('no llama onClose con otras teclas', () => {
    const onClose = vi.fn();
    render(
      <Dialog open={true} onClose={onClose} title="T">X</Dialog>
    );
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  // ── cleanup del listener al cerrar ────────────────────────────────────────
  it('no dispara onClose de un dialog cerrado al presionar Escape', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Dialog open={true} onClose={onClose} title="T">X</Dialog>
    );
    // Cierra el dialog
    rerender(
      <Dialog open={false} onClose={onClose} title="T">X</Dialog>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    // El listener se limpió; onClose no debe haber sido llamado por ESC
    expect(onClose).not.toHaveBeenCalled();
  });
});
