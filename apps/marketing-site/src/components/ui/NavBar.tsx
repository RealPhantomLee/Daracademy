"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun, BookOpen } from "lucide-react";

export default function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "night">("light");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize theme from HTML data attribute
  useEffect(() => {
    const htmlElement = document.documentElement;
    const currentTheme = (htmlElement.getAttribute("data-theme") || "light") as
      | "light"
      | "night";
    setTheme(currentTheme);
  }, []);

  // Toggle theme
  const handleThemeToggle = () => {
    const htmlElement = document.documentElement;
    const newTheme = theme === "light" ? "night" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // IntersectionObserver to detect hero section
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]) {
        setIsScrolled(!entries[0].isIntersecting);
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0,
    });

    // Target the first large hero-like section (usually main or section)
    const heroSection =
      document.querySelector("main") || document.querySelector("section");
    if (heroSection) {
      observerRef.current.observe(heroSection);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <BookOpen
            size={24}
            className="text-accent-primary"
            strokeWidth={1.5}
          />
          <span className="text-2xl font-serif font-bold text-text-primary">
            Daracademy
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("home")}
            className="text-text-primary hover:text-accent-primary transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="text-text-primary hover:text-accent-primary transition-colors"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("subjects")}
            className="text-text-primary hover:text-accent-primary transition-colors"
          >
            Subjects
          </button>
          <button
            onClick={() => scrollToSection("schedule")}
            className="text-text-primary hover:text-accent-primary transition-colors"
          >
            Schedule
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-text-primary hover:text-accent-primary transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Right section: Theme toggle + Login */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg hover:bg-accent-primary/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon size={20} className="text-text-primary" />
            ) : (
              <Sun size={20} className="text-text-primary" />
            )}
          </button>

          <a
            href="#"
            className="text-text-primary hover:text-accent-primary transition-colors font-medium"
          >
            Student Login
          </a>
        </div>
      </div>
    </nav>
  );
}
