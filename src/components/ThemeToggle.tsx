"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const mounted = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot
    );

    const isDark = mounted && theme === "dark";

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-50 overflow-hidden rounded-full bg-background/80 shadow-sm backdrop-blur-sm cursor-pointer"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            title={`Switch to ${isDark ? "light" : "dark"} theme`}
        >
            <Sun
                aria-hidden="true"
                className={`absolute transition-all duration-300 ${
                    isDark
                        ? "rotate-90 scale-0 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                }`}
            />
            <Moon
                aria-hidden="true"
                className={`absolute transition-all duration-300 ${
                    isDark
                        ? "rotate-0 scale-100 opacity-100"
                        : "-rotate-90 scale-0 opacity-0"
                }`}
            />
            <span className="sr-only">
                {isDark ? "Use light theme" : "Use dark theme"}
            </span>
        </Button>
    );
}
