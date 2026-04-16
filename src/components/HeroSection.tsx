import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Icon from '@/components/ui/icon';

const images = [
  'https://cdn.poehali.dev/projects/88a80fac-072e-4271-93be-97f1cdd3202b/files/85f5d3fd-edab-494e-a3f3-e6686c897fa5.jpg',
  'https://cdn.poehali.dev/projects/88a80fac-072e-4271-93be-97f1cdd3202b/files/5b5a9fc5-8194-4666-bf47-7e2fe434d45b.jpg',
  'https://cdn.poehali.dev/projects/88a80fac-072e-4271-93be-97f1cdd3202b/files/6c405b7c-ed42-40f1-8afa-de479938471b.jpg',
  'https://cdn.poehali.dev/projects/88a80fac-072e-4271-93be-97f1cdd3202b/files/d1597458-fb8a-4c48-89d1-2bb218af8d35.jpg',
];

const stats = [
  { icon: 'Zap', label: 'Экономия энергии', value: 'до 40%' },
  { icon: 'ClipboardCheck', label: 'Паспортов выдано', value: '0' },
  { icon: 'TrendingDown', label: 'Снижение счетов', value: 'от 3 800 ₽/год' },
];

const VK_VIDEO_URL = 'https://vkvideo.ru/video_ext.php?oid=-71283397&id=456239274&hd=2';

export default function HeroSection() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-950">
      <div className="absolute inset-0">
        {images.map((src, index) => (
          <div
            key={src}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000 ease-in-out',
              currentIndex === index ? 'opacity-100' : 'opacity-0'
            )}
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-8 md:px-16">
          <div className="flex max-w-2xl flex-col gap-8">

            {/* Badge */}
            <div
              className={cn(
                'transform transition-all duration-700 ease-out',
                isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              )}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400">
                <Icon name="Leaf" size={14} />
                Цифровая платформа энергоэффективности
              </span>
            </div>

            {/* Headline */}
            <div
              className={cn(
                'transform transition-all duration-1000 delay-150 ease-out',
                isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              )}
            >
              <h1 className="text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl">
                Энергопаспорт
                <br />
                <span className="font-semibold text-emerald-400">вашей квартиры</span>
              </h1>
            </div>

            {/* Description */}
            <div
              className={cn(
                'transform transition-all duration-1000 delay-300 ease-out',
                isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              )}
            >
              <p className="max-w-lg text-lg font-light leading-relaxed text-white/70">
                Комплексная оценка энергоэффективности жилья и персонализированные рекомендации по снижению затрат на коммунальные услуги.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={cn(
                'transform transition-all duration-1000 delay-500 ease-out',
                isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              )}
            >
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/passport')}
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 font-medium text-white transition-all hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <Icon name="FileText" size={18} />
                  Получить паспорт
                </button>
                <button
                  onClick={() => setVideoOpen(true)}
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-light text-white backdrop-blur-sm transition-all hover:bg-white/10"
                >
                  <Icon name="PlayCircle" size={18} />
                  Как это работает
                </button>
              </div>
            </div>

            {/* Stats */}
            <div
              className={cn(
                'transform transition-all duration-1000 delay-700 ease-out',
                isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
              )}
            >
              <div className="flex flex-wrap gap-8 border-t border-white/10 pt-8">
                {stats.map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <Icon name={icon} size={18} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{value}</p>
                      <p className="text-xs text-white/50">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
            >
              <Icon name="X" size={28} />
            </button>
            <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-2xl">
              <iframe
                src={VK_VIDEO_URL}
                className="h-full w-full"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Slide indicators */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'h-1 transition-all duration-300',
              currentIndex === index ? 'w-12 bg-emerald-400' : 'w-8 bg-white/30 hover:bg-white/50'
            )}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}