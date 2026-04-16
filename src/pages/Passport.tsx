import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

type Step = 'form' | 'loading' | 'result';

interface FormData {
  name: string;
  address: string;
  area: string;
  year: string;
  floors: string;
  image: File | null;
  imagePreview: string | null;
}

const EFFICIENCY_GRADES = ['A', 'A', 'A', 'B', 'B', 'C'];

export default function Passport() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('form');
  const [grade] = useState(() => EFFICIENCY_GRADES[Math.floor(Math.random() * EFFICIENCY_GRADES.length)]);
  const [form, setForm] = useState<FormData>({
    name: '',
    address: '',
    area: '',
    year: '',
    floors: '',
    image: null,
    imagePreview: null,
  });

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

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('loading');
    setTimeout(() => setStep('result'), 3000);
  };

  const passportDate = new Date().toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/60 transition-colors hover:text-white"
        >
          <Icon name="ArrowLeft" size={18} />
          <span className="text-sm">На главную</span>
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-12">

        {/* STEP: FORM */}
        {step === 'form' && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                <Icon name="FileText" size={12} />
                Оформление энергопаспорта
              </span>
              <h1 className="text-3xl font-light text-white">
                Расскажите о вашей квартире
              </h1>
              <p className="mt-2 text-white/50">
                Заполните данные и загрузите план — мы рассчитаем энергоэффективность
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Image upload */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  План / схема квартиры
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all',
                    form.imagePreview
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  )}
                >
                  {form.imagePreview ? (
                    <img
                      src={form.imagePreview}
                      alt="План квартиры"
                      className="max-h-48 rounded-lg object-contain"
                    />
                  ) : (
                    <>
                      <Icon name="Upload" size={32} className="mb-3 text-white/30" />
                      <p className="text-sm text-white/50">Нажмите чтобы загрузить фото или план</p>
                      <p className="mt-1 text-xs text-white/30">JPG, PNG до 10 МБ</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>

              {/* Fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-white/60">Ваше имя</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Иван Петров"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60 focus:bg-white/8"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-white/60">Адрес квартиры</label>
                  <input
                    required
                    value={form.address}
                    onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                    placeholder="ул. Ленина, 12, кв. 34"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60 focus:bg-white/8"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-white/60">Площадь, м²</label>
                  <input
                    required
                    type="number"
                    value={form.area}
                    onChange={(e) => setForm((p) => ({ ...p, area: e.target.value }))}
                    placeholder="54"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-white/60">Год постройки дома</label>
                  <input
                    required
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="1985"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm text-white/60">Этаж</label>
                  <input
                    required
                    type="number"
                    value={form.floors}
                    onChange={(e) => setForm((p) => ({ ...p, floors: e.target.value }))}
                    placeholder="5"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-white placeholder-white/30 outline-none transition focus:border-emerald-500/60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3.5 font-medium text-white transition hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <Icon name="Zap" size={18} />
                Рассчитать энергопаспорт
              </button>
            </form>
          </div>
        )}

        {/* STEP: LOADING */}
        {step === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/20" />
              <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-emerald-400" />
              <Icon name="Zap" size={32} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-light text-white">Анализируем данные...</h2>
            <p className="mt-3 text-white/50">Рассчитываем энергоэффективность вашего жилья</p>
            <div className="mt-8 space-y-3 text-left">
              {[
                'Обрабатываем план квартиры',
                'Анализируем тепловые характеристики',
                'Формируем рекомендации',
              ].map((text, i) => (
                <div
                  key={text}
                  className="flex items-center gap-3 text-sm text-white/40"
                  style={{ animationDelay: `${i * 0.8}s` }}
                >
                  <Icon name="CheckCircle" size={16} className="text-emerald-500/60" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP: RESULT */}
        {step === 'result' && (
          <div className="animate-fade-in text-center">
            {/* Celebration */}
            <div className="mb-8 flex flex-col items-center">
              <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/30">
                <Icon name="Award" size={52} className="text-emerald-400" />
                <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white shadow-lg">
                  ✓
                </div>
              </div>
              <h1 className="text-3xl font-semibold text-white">Вы получили паспорт!</h1>
              <p className="mt-2 text-white/50">Энергопаспорт квартиры успешно сформирован</p>
            </div>

            {/* Passport card */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left backdrop-blur-sm">
              {/* Card header */}
              <div className="flex items-center justify-between bg-emerald-500/15 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Icon name="Leaf" size={20} className="text-emerald-400" />
                  <span className="font-medium text-emerald-400">Энергопаспорт</span>
                </div>
                <span className="text-xs text-white/40">{passportDate}</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Uploaded image */}
                {form.imagePreview && (
                  <div className="overflow-hidden rounded-xl border border-white/10">
                    <img
                      src={form.imagePreview}
                      alt="План квартиры"
                      className="w-full max-h-48 object-contain bg-white/5"
                    />
                    <p className="px-4 py-2 text-xs text-white/40">Загруженный план квартиры</p>
                  </div>
                )}

                {/* Данные о квартире */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="Home" size={16} className="text-emerald-400" />
                    <p className="text-sm font-medium text-white/70">Данные о квартире</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/40">Владелец</p>
                      <p className="font-medium text-white">{form.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Адрес</p>
                      <p className="font-medium text-white">{form.address || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Площадь</p>
                      <p className="font-medium text-white">{form.area} м²</p>
                    </div>
                    <div>
                      <p className="text-white/40">Год постройки</p>
                      <p className="font-medium text-white">{form.year}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Этаж</p>
                      <p className="font-medium text-white">{form.floors || '—'}</p>
                    </div>
                    <div>
                      <p className="text-white/40">Дата оформления</p>
                      <p className="font-medium text-white">{passportDate}</p>
                    </div>
                  </div>
                </div>

                {/* Grade */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-white/40">Класс энергоэффективности</p>
                      <p className={cn('mt-1 text-5xl font-bold', gradeColor[grade])}>{grade}</p>
                      <p className={cn('text-sm font-medium', gradeColor[grade])}>{gradeLabel[grade]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40">Потенциал экономии</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{savings[grade]}</p>
                      <p className="text-xs text-white/40">от текущих расходов</p>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <p className="mb-3 text-sm font-medium text-white/60">Топ рекомендации</p>
                  <div className="space-y-2">
                    {[
                      { icon: 'Thermometer', text: 'Утеплить стены и перекрытия' },
                      { icon: 'Wind', text: 'Заменить окна на энергосберегающие' },
                      { icon: 'Droplets', text: 'Установить счётчики тепла и воды' },
                    ].map(({ icon, text }) => (
                      <div key={text} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-2.5 text-sm text-white/70">
                        <Icon name={icon} size={16} className="text-emerald-400 shrink-0" />
                        {text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setStep('form'); setForm({ name: '', address: '', area: '', year: '', floors: '', image: null, imagePreview: null }); }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-3 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <Icon name="Plus" size={16} />
              Оформить ещё один паспорт
            </button>
          </div>
        )}
      </div>
    </div>
  );
}