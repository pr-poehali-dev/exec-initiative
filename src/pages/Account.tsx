import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

const PASSPORTS_URL = 'https://functions.poehali.dev/7a637593-2914-4837-9bb2-0fd276698cd7';

interface PassportData {
  id?: number;
  name: string;
  address: string;
  area: string;
  year: string;
  floors: string;
  imagePreview: string | null;
  grade: string;
  date: string;
}

const gradeColor: Record<string, string> = { A: 'text-emerald-400', B: 'text-yellow-400', C: 'text-orange-400' };
const gradeLabel: Record<string, string> = { A: 'Высокая', B: 'Средняя', C: 'Удовлетворительная' };
const savings: Record<string, string> = { A: 'до 40%', B: 'до 25%', C: 'до 15%' };

export default function Account() {
  const navigate = useNavigate();
  const { user, token, logout, loading: authLoading } = useAuth();
  const [passports, setPassports] = useState<PassportData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/');
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(PASSPORTS_URL, { headers: { 'X-Auth-Token': token } })
      .then(r => r.json())
      .then(data => { if (data.passports) setPassports(data.passports); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
          >
            <Icon name="ArrowLeft" size={18} />
            <span className="text-sm">На главную</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="LogOut" size={15} />
            Выйти
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-8">

        {/* Профиль */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Icon name="User" size={32} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">{user?.name || 'Пользователь'}</h1>
                <p className="text-sm text-white/50">{user?.email}</p>
                {user?.role === 'admin' && (
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                    <Icon name="ShieldCheck" size={11} />
                    Администратор
                  </span>
                )}
              </div>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                <Icon name="Shield" size={16} />
                Панель администратора
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-400">{passports.length}</p>
              <p className="mt-1 text-xs text-white/40">Паспортов</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {passports.filter(p => p.grade === 'A').length}
              </p>
              <p className="mt-1 text-xs text-white/40">Класс A</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {passports.reduce((sum, p) => sum + (parseFloat(p.area) || 0), 0).toFixed(0)} м²
              </p>
              <p className="mt-1 text-xs text-white/40">Общая площадь</p>
            </div>
          </div>
        </div>

        {/* Паспорта */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-white">Мои энергопаспорта</h2>
            <button
              onClick={() => navigate('/passport')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-400"
            >
              <Icon name="Plus" size={14} />
              Новый паспорт
            </button>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
            </div>
          )}

          {!loading && passports.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/3 py-16 text-center">
              <Icon name="FileText" size={40} className="mx-auto mb-4 text-white/20" />
              <p className="text-white/40">Паспортов пока нет</p>
              <button
                onClick={() => navigate('/passport')}
                className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition"
              >
                Оформить первый
              </button>
            </div>
          )}

          <div className="space-y-4">
            {passports.map((p, i) => (
              <div key={p.id ?? i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="flex items-center justify-between bg-emerald-500/10 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Leaf" size={15} className="text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-400">Энергопаспорт</span>
                  </div>
                  <span className="text-xs text-white/40">{p.date}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-white">{p.address || '—'}</p>
                      <p className="text-sm text-white/50">Владелец: {p.name || '—'}</p>
                      <div className="flex gap-4 pt-1 text-xs text-white/40">
                        <span>{p.area} м²</span>
                        <span>{p.year} г.</span>
                        <span>{p.floors} этаж</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn('text-3xl font-bold', gradeColor[p.grade])}>{p.grade}</p>
                      <p className={cn('text-xs', gradeColor[p.grade])}>{gradeLabel[p.grade]}</p>
                      <p className="mt-1 text-sm font-semibold text-white">{savings[p.grade]}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 text-xs text-white/30 pointer-events-none select-none">
        Основатель сайта Ухлинов Александр
      </div>
    </div>
  );
}