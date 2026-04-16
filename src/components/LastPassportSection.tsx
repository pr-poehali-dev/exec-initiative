import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

interface PassportData {
  name: string;
  address: string;
  area: string;
  year: string;
  floors: string;
  imagePreview: string | null;
  grade: string;
  date: string;
}

export default function LastPassportSection() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('lastPassport');

  if (!raw) return null;

  let data: PassportData;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }

  const gradeColor: Record<string, string> = {
    A: 'text-emerald-400',
    B: 'text-yellow-400',
    C: 'text-orange-400',
  };

  const gradeLabel: Record<string, string> = {
    A: 'Высокая',
    B: 'Средняя',
    C: 'Удовлетворительная',
  };

  const savings: Record<string, string> = {
    A: 'до 40%',
    B: 'до 25%',
    C: 'до 15%',
  };

  return (
    <section className="bg-gray-950 px-8 py-16 md:px-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Icon name="Home" size={18} />
            </div>
            <div>
              <p className="text-xs text-white/40">Последний оформленный</p>
              <p className="font-medium text-white">Энергопаспорт квартиры</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/passport')}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="Plus" size={14} />
            Новый паспорт
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between bg-emerald-500/10 px-5 py-3">
            <div className="flex items-center gap-2">
              <Icon name="Leaf" size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Энергопаспорт</span>
            </div>
            <span className="text-xs text-white/40">{data.date}</span>
          </div>

          <div className="p-5 space-y-5">
            {/* Фото плана */}
            {data.imagePreview && (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img
                  src={data.imagePreview}
                  alt="План квартиры"
                  className="w-full max-h-44 object-contain bg-white/5"
                />
                <p className="px-4 py-2 text-xs text-white/40">План квартиры</p>
              </div>
            )}

            {/* Данные о квартире */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Icon name="ClipboardList" size={15} className="text-emerald-400" />
                <p className="text-sm font-medium text-white/70">Данные о квартире</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-white/40">Владелец</p>
                  <p className="font-medium text-white">{data.name || '—'}</p>
                </div>
                <div>
                  <p className="text-white/40">Адрес</p>
                  <p className="font-medium text-white">{data.address || '—'}</p>
                </div>
                <div>
                  <p className="text-white/40">Площадь</p>
                  <p className="font-medium text-white">{data.area} м²</p>
                </div>
                <div>
                  <p className="text-white/40">Год постройки</p>
                  <p className="font-medium text-white">{data.year}</p>
                </div>
                <div>
                  <p className="text-white/40">Этаж</p>
                  <p className="font-medium text-white">{data.floors || '—'}</p>
                </div>
                <div>
                  <p className="text-white/40">Дата оформления</p>
                  <p className="font-medium text-white">{data.date}</p>
                </div>
              </div>
            </div>

            {/* Класс */}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4">
              <div>
                <p className="text-xs text-white/40">Класс энергоэффективности</p>
                <p className={cn('mt-0.5 text-4xl font-bold', gradeColor[data.grade])}>{data.grade}</p>
                <p className={cn('text-xs font-medium', gradeColor[data.grade])}>{gradeLabel[data.grade]}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">Потенциал экономии</p>
                <p className="mt-0.5 text-2xl font-semibold text-white">{savings[data.grade]}</p>
                <p className="text-xs text-white/40">от текущих расходов</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
