"use client";

import { useEffect, useMemo, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  icon: "book" | "star" | "pencil" | "graduation";
  layer: 1 | 2 | 3;
};

// Deterministic seeded random for hydration consistency
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function GradientBackground() {
  const [scrollOffset, setScrollOffset] = useState({
    layer1: 0,
    layer2: 0,
    layer3: 0,
  });

  // Generate particles with deterministic seeding
  const particles = useMemo<Particle[]>(() => {
    const count = 27;
    const result: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const rand1 = seededRandom(i * 1.1);
      const rand2 = seededRandom(i * 2.3);
      const rand3 = seededRandom(i * 3.7);
      const rand4 = seededRandom(i * 5.11);
      const rand5 = seededRandom(i * 7.13);

      const icons: Array<"book" | "star" | "pencil" | "graduation"> = [
        "book",
        "star",
        "pencil",
        "graduation",
      ];

      result.push({
        id: i,
        x: rand1 * 100,
        y: rand2 * 100,
        size: 8 + rand3 * 12,
        opacity: 0.1 + rand4 * 0.25,
        icon: icons[Math.floor(rand5 * 4)],
        layer: ((i % 3) + 1) as 1 | 2 | 3,
      });
    }

    return result;
  }, []);

  // SVG icons
  const renderIcon = (type: string, size: number) => {
    switch (type) {
      case "book":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path
              d="M8 4v12m8-12v12"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        );
      case "star":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case "pencil":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        );
      case "graduation":
        return (
          <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3L2 8v2h2v7c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-7h2V8l-10-5z" />
            <path
              d="M12 10.5c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z"
              fill="rgba(255,255,255,0.3)"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Scroll listener with parallax
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrollOffset({
        layer1: scrollY * 0.05,
        layer2: scrollY * 0.12,
        layer3: scrollY * 0.25,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Gradient mesh background */}
      <div className="gradient-mesh" />

      {/* Parallax particles - Layer 1 (slowest) */}
      <div
        style={{
          transform: `translateY(${scrollOffset.layer1}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {particles
          .filter((p) => p.layer === 1)
          .map((particle) => (
            <div
              key={`layer1-${particle.id}`}
              style={{
                position: "fixed",
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                color: "var(--color-gold)",
                opacity: particle.opacity,
              }}
            >
              {renderIcon(particle.icon, particle.size)}
            </div>
          ))}
      </div>

      {/* Parallax particles - Layer 2 (medium) */}
      <div
        style={{
          transform: `translateY(${scrollOffset.layer2}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {particles
          .filter((p) => p.layer === 2)
          .map((particle) => (
            <div
              key={`layer2-${particle.id}`}
              style={{
                position: "fixed",
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                color: "var(--color-sage)",
                opacity: particle.opacity,
              }}
            >
              {renderIcon(particle.icon, particle.size)}
            </div>
          ))}
      </div>

      {/* Parallax particles - Layer 3 (fastest) */}
      <div
        style={{
          transform: `translateY(${scrollOffset.layer3}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {particles
          .filter((p) => p.layer === 3)
          .map((particle) => (
            <div
              key={`layer3-${particle.id}`}
              style={{
                position: "fixed",
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                color: "var(--color-slate-blue)",
                opacity: particle.opacity,
              }}
            >
              {renderIcon(particle.icon, particle.size)}
            </div>
          ))}
      </div>
    </div>
  );
}
