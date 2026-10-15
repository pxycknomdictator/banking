"use client";

import { useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "banking-theme";

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

    return children;
}
