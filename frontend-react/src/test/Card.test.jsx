import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/Card.jsx';

describe('Card', () => {
  it('renderiza el contenido hijo', () => {
    render(<Card>Hola</Card>);
    expect(screen.getByText('Hola')).toBeInTheDocument();
  });

  it('aplica clase "card"', () => {
    const { container } = render(<Card>X</Card>);
    expect(container.firstChild).toHaveClass('card');
  });

  it('acepta className extra', () => {
    const { container } = render(<Card className="shadow-lg">X</Card>);
    expect(container.firstChild).toHaveClass('shadow-lg');
  });
});

describe('CardHeader', () => {
  it('renderiza hijo', () => {
    render(<CardHeader>Cabecera</CardHeader>);
    expect(screen.getByText('Cabecera')).toBeInTheDocument();
  });

  it('aplica mb-3', () => {
    const { container } = render(<CardHeader>X</CardHeader>);
    expect(container.firstChild).toHaveClass('mb-3');
  });
});

describe('CardTitle', () => {
  it('renderiza como h3', () => {
    render(<CardTitle>Título</CardTitle>);
    expect(screen.getByRole('heading', { level: 3, name: 'Título' })).toBeInTheDocument();
  });

  it('aplica font-bold', () => {
    render(<CardTitle>T</CardTitle>);
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('font-bold');
  });
});

describe('CardDescription', () => {
  it('renderiza como párrafo', () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    expect(container.querySelector('p')).toHaveTextContent('Desc');
  });

  it('aplica text-muted', () => {
    const { container } = render(<CardDescription>D</CardDescription>);
    expect(container.firstChild).toHaveClass('text-muted');
  });
});

describe('CardContent', () => {
  it('renderiza el hijo', () => {
    render(<CardContent>Contenido</CardContent>);
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('renderiza el hijo', () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('aplica border-t', () => {
    const { container } = render(<CardFooter>F</CardFooter>);
    expect(container.firstChild).toHaveClass('border-t');
  });
});

describe('Card slots compuestos', () => {
  it('renderiza todos los slots juntos', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Oferta</CardTitle>
          <CardDescription>Descripción corta</CardDescription>
        </CardHeader>
        <CardContent>Cuerpo</CardContent>
        <CardFooter>Acción</CardFooter>
      </Card>
    );
    expect(screen.getByText('Oferta')).toBeInTheDocument();
    expect(screen.getByText('Descripción corta')).toBeInTheDocument();
    expect(screen.getByText('Cuerpo')).toBeInTheDocument();
    expect(screen.getByText('Acción')).toBeInTheDocument();
  });
});
