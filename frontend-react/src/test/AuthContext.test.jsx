import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';

// Mockear api para no hacer llamadas reales
vi.mock('../api/client.js', () => ({
  api: {
    verifyOtp: vi.fn(),
  },
}));

import { api } from '../api/client.js';

// Componente helper para exponer el contexto en los tests
function AuthConsumer() {
  const { user, isAuth, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="isAuth">{String(isAuth)}</span>
      <span data-testid="user">{user ? JSON.stringify(user) : 'null'}</span>
      <button onClick={() => login('a@b.com', '123456')}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('isAuth es false cuando no hay sesión', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('isAuth').textContent).toBe('false');
  });

  it('user es null cuando no hay sesión guardada', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('login guarda el token y actualiza isAuth', async () => {
    const fakeUser = { id: 1, email: 'a@b.com', role: 'candidate' };
    api.verifyOtp.mockResolvedValue({ access_token: 'tok', user: fakeUser });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('isAuth').textContent).toBe('true');
    });

    expect(localStorage.getItem('pp_token')).toBe('tok');
  });

  it('login actualiza el objeto user', async () => {
    const fakeUser = { id: 7, email: 'z@z.com', role: 'business' };
    api.verifyOtp.mockResolvedValue({ access_token: 'tok2', user: fakeUser });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toContain('z@z.com');
    });
  });

  it('logout limpia isAuth y user', async () => {
    const fakeUser = { id: 1 };
    api.verifyOtp.mockResolvedValue({ access_token: 'tok', user: fakeUser });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // primero hacemos login
    await act(async () => {
      screen.getByText('login').click();
    });
    await waitFor(() => {
      expect(screen.getByTestId('isAuth').textContent).toBe('true');
    });

    // ahora logout
    await act(async () => {
      screen.getByText('logout').click();
    });

    expect(screen.getByTestId('isAuth').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });

  it('logout limpia localStorage', async () => {
    const fakeUser = { id: 1 };
    api.verifyOtp.mockResolvedValue({ access_token: 'tok', user: fakeUser });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('login').click();
    });
    await act(async () => {
      screen.getByText('logout').click();
    });

    expect(localStorage.getItem('pp_token')).toBeNull();
    expect(localStorage.getItem('pp_user')).toBeNull();
  });

  it('carga la sesión previa de localStorage al montar', () => {
    // simula sesión persistida
    localStorage.setItem('pp_token', 'old-tok');
    localStorage.setItem('pp_user', JSON.stringify({ id: 99, role: 'admin' }));

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('isAuth').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toContain('99');
  });
});
