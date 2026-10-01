import { useTheme } from "@/context/theme-provider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher = forwardRef<HTMLButtonElement, ThemeSwitcherProps>(
  function ThemeSwitcher({ className }, ref) {
    const { theme, setTheme } = useTheme();

    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        // 36px — как кружок логотипа в шапке: одинаковые отступы от краёв капсулы
        "relative w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-rgsu-ice hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-[0.96] transition",
        className
      )}
        aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      >
        {/* Солнце (появляется в тёмной теме для перехода на светлую) */}
        <HugeiconsIcon
          icon={Sun03Icon}
          size={18}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 m-auto transition-[opacity,transform,filter] duration-200 ease-vs",
            isDark
              ? "scale-100 opacity-100 blur-0"
              : "scale-25 opacity-0 blur-[4px] pointer-events-none"
          )}
        />
        {/* Луна (в светлой теме для перехода на тёмную) — расположение как у солнца */}
        <HugeiconsIcon
          icon={Moon02Icon}
          size={18}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 m-auto transition-[opacity,transform,filter] duration-200 ease-vs",
            isDark
              ? "scale-25 opacity-0 blur-[4px] pointer-events-none"
              : "scale-100 opacity-100 blur-0"
          )}
        />
        <span className="sr-only">Переключить тему</span>
      </button>
    );
  }
);
