import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/context/AuthContext';

const ADMIN_URL = 'https://functions.poehali.dev/a47e1070-e24d-4da8-89ec-764b9718e20d';

interface UserRow {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
  passport_count: number;
}

interface PassportRow {
  id: number;
  name: string;
  address: string;
  area: string;
  year: string;
  floors: string;
  grade: string;
  date: string;
  created_at: string;
  user_email: string;
}

const gradeColor: Record<string, string> = { A: 'text-emerald-400', B: 'text-yellow-400', C: 'text-orange-400' };

export default function Admin() {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<'users' | 'passports'>('users');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [passports, setPassports] = useState<PassportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) navigate('/');
  }, [user, authLoading, navigate]);

  const fetchUsers = () => {
    if (!token) return;
    setLoading(true);
    fetch(`${ADMIN_URL}?action=users`, { headers: { 'X-Auth-Token': token } })
      .then(r => r.json())
      .then(d => { if (d.users) setUsers(d.users); })
      .finally(() => setLoading(false));
  };

  const fetchPassports = () => {
    if (!token) return;
    setLoading(true);
    fetch(`${ADMIN_URL}?action=passports`, { headers: { 'X-Auth-Token': token } })
      .then(r => r.json())
      .then(d => { if (d.passports) setPassports(d.passports); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token || authLoading) return;
    if (tab === 'users') fetchUsers();
    else fetchPassports();
  }, [tab, token, authLoading]);

  const toggleRole = async (userId: number, currentRole: string) => {
    if (!token) return;
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setRoleLoading(userId);
    await fetch(ADMIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Auth-Token': token },
      body: JSON.stringify({ action: 'set_role', user_id: userId, role: newRole }),
    });
    setRoleLoading(null);
    fetchUsers();
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
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/account')}
              className="flex items-center gap-2 text-white/60 transition hover:text-white"
            >
              <Icon name="ArrowLeft" size={18} />
              <span className="text-sm">Аккаунт</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-400">
                <Icon name="Shield" size={16} />
              </div>
              <span className="font-semibold text-white">Панель администратора</span>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1">
            <Icon name="ShieldCheck" size={14} className="text-red-400" />
            <span className="text-xs font-medium text-red-400">Администратор</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">

        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-3xl font-bold text-white">{users.length}</p>
            <p className="mt-1 text-sm text-white/40">Пользователей</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-3xl font-bold text-emerald-400">{passports.length || users.reduce((s, u) => s + u.passport_count, 0)}</p>
            <p className="mt-1 text-sm text-white/40">Паспортов</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <p className="text-3xl font-bold text-red-400">{users.filter(u => u.role === 'admin').length}</p>
            <p className="mt-1 text-sm text-white/40">Администраторов</p>
          </div>
        </div>

        {/* Табы */}
        <div className="flex gap-2 rounded-xl border border-white/10 bg-white/5 p-1 w-fit">
          <button
            onClick={() => setTab('users')}
            className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition', tab === 'users' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}
          >
            <Icon name="Users" size={15} />
            Пользователи
          </button>
          <button
            onClick={() => setTab('passports')}
            className={cn('flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition', tab === 'passports' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70')}
          >
            <Icon name="FileText" size={15} />
            Все паспорта
          </button>
        </div>

        {/* Контент */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-emerald-400" />
          </div>
        ) : tab === 'users' ? (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs text-white/40">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Имя</th>
                  <th className="px-5 py-3">Роль</th>
                  <th className="px-5 py-3">Паспортов</th>
                  <th className="px-5 py-3">Дата</th>
                  <th className="px-5 py-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className={cn('border-b border-white/5 transition hover:bg-white/5', i % 2 === 0 ? '' : 'bg-white/2')}>
                    <td className="px-5 py-3 text-white/40">{u.id}</td>
                    <td className="px-5 py-3 text-white">{u.email}</td>
                    <td className="px-5 py-3 text-white/70">{u.name || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', u.role === 'admin' ? 'bg-red-500/15 text-red-400' : 'bg-white/10 text-white/50')}>
                        {u.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/70">{u.passport_count}</td>
                    <td className="px-5 py-3 text-white/40">{u.created_at}</td>
                    <td className="px-5 py-3">
                      {u.email !== user?.email && (
                        <button
                          onClick={() => toggleRole(u.id, u.role)}
                          disabled={roleLoading === u.id}
                          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
                        >
                          {roleLoading === u.id ? '...' : u.role === 'admin' ? 'Снять роль' : 'Сделать админом'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="py-12 text-center text-white/30">Нет пользователей</div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs text-white/40">
                  <th className="px-5 py-3">ID</th>
                  <th className="px-5 py-3">Пользователь</th>
                  <th className="px-5 py-3">Владелец</th>
                  <th className="px-5 py-3">Адрес</th>
                  <th className="px-5 py-3">Площадь</th>
                  <th className="px-5 py-3">Класс</th>
                  <th className="px-5 py-3">Дата</th>
                </tr>
              </thead>
              <tbody>
                {passports.map((p, i) => (
                  <tr key={p.id} className={cn('border-b border-white/5 transition hover:bg-white/5', i % 2 === 0 ? '' : 'bg-white/2')}>
                    <td className="px-5 py-3 text-white/40">{p.id}</td>
                    <td className="px-5 py-3 text-white/60 text-xs">{p.user_email}</td>
                    <td className="px-5 py-3 text-white">{p.name || '—'}</td>
                    <td className="px-5 py-3 text-white/70">{p.address || '—'}</td>
                    <td className="px-5 py-3 text-white/70">{p.area} м²</td>
                    <td className="px-5 py-3">
                      <span className={cn('text-lg font-bold', gradeColor[p.grade])}>{p.grade}</span>
                    </td>
                    <td className="px-5 py-3 text-white/40">{p.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {passports.length === 0 && (
              <div className="py-12 text-center text-white/30">Нет паспортов</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
