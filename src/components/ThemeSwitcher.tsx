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
          "relative w-9 h-9 rounded-full text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-rgsu-ice hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95 transition",
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
            "absolute inset-0 m-auto transition-[opacity,transform] duration-200",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-95 opacity-0 pointer-events-none"
          )}
        />
        {/* Луна (в светлой теме для перехода на тёмную) */}
        <HugeiconsIcon
          icon={Moon02Icon}
          size={18}
          strokeWidth={1.5}
          className={cn(
            "absolute inset-0 m-auto transition-[opacity,transform] duration-200",
            isDark
              ? "rotate-90 scale-95 opacity-0 pointer-events-none"
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <span className="sr-only">Переключить тему</span>
      </button>
    );
  }
);
