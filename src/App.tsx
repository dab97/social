import { useEffect, useState } from "react";
import { SocialsData } from "./types/socials";
import { BentoGrid } from "./components/bento-grid";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, RefreshIcon, Home01Icon, Calendar03Icon } from "@hugeicons/core-free-icons";
import { Button } from "./components/ui/button";

export default function App() {
  const [data, setData] = useState<SocialsData | null>(null);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = () => {
    setData(null);
    setError(false);
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let cancelled = false;

    fetch("/data/socials.json", { cache: "no-cache" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: SocialsData) => {
        if (cancelled) return;
        if (!Array.isArray(json?.socials) || !json?.site?.title) {
          throw new Error("Некорректный формат данных");
        }
        setData(json);
      })
      .catch((err) => {
        console.error("Ошибка загрузки socials.json:", err);
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Skip-link: первый фокусируемый элемент (better-accessibility) */}
      <a href="#content" className="skip-link">
        Перейти к содержимому
      </a>
      {/* 1. Плавающая капсула Liquid Glass — на мобильных скрыта (тема и ссылки в нижнем баре) */}
      <header className="hidden sm:block sticky top-0 z-40 w-full px-3 sm:px-5 pt-3 pointer-events-none">
        <div className="glass-header pointer-events-auto max-w-6xl mx-auto h-14 rounded-full flex items-center justify-between gap-3 pl-2.5 pr-2.5 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl backdrop-saturate-150 border border-white/70 dark:border-white/15 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_4px_12px_rgba(15,23,42,0.06),inset_0_1px_0_0_rgba(255,255,255,0.75)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/favicon.svg"
              alt=""
              className="w-9 h-9 rounded-full shrink-0 shadow-xs"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm leading-tight text-foreground truncate">Филиал РГСУ в г. Минске</span>
              <span className="text-xs text-muted-foreground leading-tight truncate">Социальные сети</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* 2. Герой */}
      <main id="content" className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 pb-4 sm:pb-8">
        <section className="space-y-2 sm:space-y-3">
          <h1 className="font-display font-bold uppercase text-5xl sm:text-display text-foreground text-balance">
            {data ? data.site.title : "Мы в соцсетях"}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {data
              ? data.site.subtitle
              : "Присоединяйтесь к официальным сообществам филиала"}
          </p>
        </section>

        {/* 3. Bento-сетка карточек */}
        {data ? (
          <BentoGrid socials={data.socials} />
        ) : error ? (
          <div role="alert" className="squircle bg-card border border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto border border-rose-200 dark:border-rose-900">
              <HugeiconsIcon icon={AlertCircleIcon} size={22} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-foreground">Не удалось загрузить данные</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Проверьте подключение к сети или обновите страницу.
              </p>
            </div>
            <Button onClick={retry} className="rounded-xl gap-2 h-10 px-4">
              <HugeiconsIcon icon={RefreshIcon} size={15} strokeWidth={1.5} />
              Повторить попытку
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`squircle animate-pulse border border-slate-200/80 dark:border-slate-800 bg-card p-5 min-h-[180px] ${
                  i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 mb-4" />
                <div className="h-4 w-1/3 bg-slate-200/70 dark:bg-slate-800 rounded mb-3" />
                <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-800 rounded mb-2" />
                <div className="h-3 w-2/3 bg-slate-200/70 dark:bg-slate-800 rounded mb-6" />
                <div className="h-11 w-full rounded-xl bg-slate-200/70 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 4. Футер */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800/60 bg-transparent text-xs text-muted-foreground mt-6 sm:mt-8 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] mb-14 sm:mb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-medium text-foreground text-xs sm:text-sm">
              Филиал РГСУ в г. Минске
              <span className="hidden sm:inline font-normal text-muted-foreground text-xs"> · ул. Народная, 21</span>
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              © {new Date().getFullYear()} РГСУ · Официальные сообщества филиала
            </p>
          </div>
          <a
            href="https://spravka.rgsu.by"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary dark:hover:text-rgsu-ice transition-colors py-1"
          >
            Заказ справок и документов
          </a>
        </div>
      </footer>

      {/* 5. Мобильный нижний бар (как у spravka): внешний сайт, справки, тема — под большой палец */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-t border-slate-200/60 dark:border-slate-800/60 pb-[env(safe-area-inset-bottom,0px)]"
        aria-label="Мобильная навигация"
      >
        <div className="grid grid-cols-3 h-14 max-w-xs mx-auto px-4">
          <a
            href="https://rgsu.by/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-rgsu-ice active:scale-95 transition"
          >
            <HugeiconsIcon icon={Home01Icon} size={20} strokeWidth={1.5} />
            <span className="text-xs font-medium leading-none">Сайт</span>
          </a>
          <a
            href="https://spravka.rgsu.by/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-rgsu-ice active:scale-95 transition"
          >
            <HugeiconsIcon icon={Calendar03Icon} size={20} strokeWidth={1.5} />
            <span className="text-xs font-medium leading-none">Справки</span>
          </a>
          <div className="flex flex-col items-center justify-center gap-1 text-slate-600 dark:text-slate-400">
            <ThemeSwitcher className="w-8 h-8" />
            <span className="text-xs font-medium leading-none">Тема</span>
          </div>
        </div>
      </nav>
    </div>
  );
}
