import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const AUTH_URL = 'https://functions.poehali.dev/cb7a9da0-25ac-4890-8dd4-897159e511af';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) { setLoading(false); return; }
    fetch(AUTH_URL, { headers: { 'X-Auth-Token': savedToken } })
      .then(r => r.json())
      .then(data => {
        if (data.user) { setUser(data.user); setToken(savedToken); }
        else { localStorage.removeItem('auth_token'); setToken(null); }
      })
      .catch(() => { localStorage.removeItem('auth_token'); setToken(null); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Ошибка входа');
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name: string) => {
    const r = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, name }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Ошибка регистрации');
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    const t = localStorage.getItem('auth_token');
    if (t) {
      await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Auth-Token': t },
        body: JSON.stringify({ action: 'logout' }),
      }).catch(() => {});
    }
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}