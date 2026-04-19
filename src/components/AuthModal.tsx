import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-gray-900 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/40 transition hover:text-white"
        >
          <Icon name="X" size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <Icon name="User" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {mode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
            </h2>
            <p className="text-xs text-white/40">
              {mode === 'login' ? 'Войдите, чтобы сохранять паспорта' : 'Создайте аккаунт бесплатно'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1.5 block text-sm text-white/60">Ваше имя</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Петров"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
              />
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm text-white/60">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-white/60">Пароль</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-medium text-white transition hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={18} />
            )}
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-white/40">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="text-emerald-400 transition hover:text-emerald-300"
          >
            {mode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
          </button>
        </p>
      </div>
    </div>
  );
}
