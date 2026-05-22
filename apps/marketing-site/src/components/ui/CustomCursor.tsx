"use client";

import { useRef, useEffect, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  // Quill feather SVG inline
  const quillSVG = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Feather shaft */}
      <path
        d="M 12 2 Q 11 4 11 8 Q 11 12 12 18 Q 13 12 13 8 Q 13 4 12 2"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      {/* Feather vanes */}
      <path
        d="M 8 6 Q 10 6 11 8"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 16 6 Q 14 6 13 8"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 7 10 Q 10 10 11 12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 17 10 Q 14 10 13 12"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 8 14 Q 10 14 11 16"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M 16 14 Q 14 14 13 16"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Feather tip */}
      <circle cx="12" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      if (cursorRef.current) {
        cursorRef.current.classList.add("clicking");
      }

      // Create ink ripple
      const ripple = document.createElement("div");
      ripple.className = "animate-ink-ripple";
      ripple.style.position = "fixed";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      ripple.style.width = "20px";
      ripple.style.height = "20px";
      ripple.style.borderRadius = "50%";
      ripple.style.backgroundColor = "var(--color-gold)";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "9998";
      ripple.style.transformOrigin = "center";
      ripple.style.animation = "ink-ripple 0.6s ease-out forwards";
      document.body.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      if (cursorRef.current) {
        cursorRef.current.classList.remove("clicking");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Smooth interpolation animation loop
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.1,
        y: prev.y + (targetPos.y - prev.y) * 0.1,
      }));
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetPos]);

  return (
    <div
      ref={cursorRef}
      className="cursor-quill"
      style={{
        transform: `translate(${mousePos.x}px, ${mousePos.y}px) rotate(-35deg)`,
      }}
    >
      <div style={{ color: "var(--color-gold)" }}>{quillSVG}</div>
    </div>
  );
}
