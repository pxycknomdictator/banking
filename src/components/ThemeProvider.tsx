"use client";

import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "banking-theme";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
    if (typeof window === "undefined") {
        return "light";
    }

    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "dark" || storedTheme === "light") {
        return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function isEditableTarget(target: EventTarget | null) {
    return (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
    );
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        function handleThemeShortcut(event: KeyboardEvent) {
            if (
                typeof event.key !== "string" ||
                event.key.toLowerCase() !== "d" ||
                event.metaKey ||
                event.ctrlKey ||
                event.altKey ||
                event.shiftKey ||
                isEditableTarget(event.target)
            ) {
                return;
            }

            event.preventDefault();
            setTheme((currentTheme) =>
                currentTheme === "dark" ? "light" : "dark"
            );
        }

        window.addEventListener("keydown", handleThemeShortcut);
        return () => window.removeEventListener("keydown", handleThemeShortcut);
    }, []);

    const value = useMemo(
        () => ({
            theme,
            toggleTheme: () =>
                setTheme((currentTheme) =>
                    currentTheme === "dark" ? "light" : "dark"
                )
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}
