import React, { useEffect, useMemo, useRef } from "react";

type RGB = [number, number, number];

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  driftX: number;
  driftY: number;
  colorIndex: number;
};

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function parseHexColor(hex: string): RGB | null {
  const raw = hex.trim().replace(/^#/, "");
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) return [r, g, b];
    return null;
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if (Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)) return [r, g, b];
    return null;
  }
  return null;
}

function parseRgbColor(input: string): RGB | null {
  const m = input
    .trim()
    .match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([0-9.]+))?\s*\)$/i);
  if (!m) return null;
  const r = Number(m[1]);
  const g = Number(m[2]);
  const b = Number(m[3]);
  if ([r, g, b].some((n) => !Number.isFinite(n))) return null;
  return [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))];
}

function toRgb(input: string): RGB | null {
  if (!input) return null;
  if (input.trim().startsWith("#")) return parseHexColor(input);
  if (input.trim().toLowerCase().startsWith("rgb")) return parseRgbColor(input);
  return null;
}

function rgba([r, g, b]: RGB, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${clamp01(a)})`;
}

function readCssVar(name: string, fallback: string) {
  const root = document.documentElement;
  const value = getComputedStyle(root).getPropertyValue(name).trim();
  return value || fallback;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const primary = toRgb(readCssVar("--primary", "#00d9ff")) ?? [0, 217, 255];
    const chart2 = toRgb(readCssVar("--chart-2", "#00b8d4")) ?? [0, 184, 212];
    const chart4 = toRgb(readCssVar("--chart-4", "#007a80")) ?? [0, 122, 128];
    const colors: RGB[] = [primary, chart2, chart4];

    let raf = 0;
    let stars: Star[] = [];

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const { innerWidth: w, innerHeight: h } = window;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = w * h;
      const count = Math.max(55, Math.min(160, Math.floor(density / 14000)));

      stars = Array.from({ length: count }, () => {
        const r = 0.6 + Math.random() * 1.7;
        const baseAlpha = 0.25 + Math.random() * 0.55;
        const twinkleSpeed = 0.6 + Math.random() * 1.6;
        const twinklePhase = Math.random() * Math.PI * 2;
        const drift = 0.01 + Math.random() * 0.03;
        const angle = Math.random() * Math.PI * 2;

        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          baseAlpha,
          twinkleSpeed,
          twinklePhase,
          driftX: Math.cos(angle) * drift,
          driftY: Math.sin(angle) * drift,
          colorIndex: Math.floor(Math.random() * colors.length),
        };
      });
    };

    const draw = (tMs: number) => {
      const t = tMs / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (const s of stars) {
        const tw = 0.68 + 0.32 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const a = clamp01(s.baseAlpha * tw);

        const c = colors[s.colorIndex] ?? colors[0];
        const glowR = s.r * 10;

        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR);
        g.addColorStop(0, rgba(c, a * 0.95));
        g.addColorStop(0.3, rgba(c, a * 0.35));
        g.addColorStop(1, rgba(c, 0));

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(c, a);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < -20) s.x = w + 20;
        if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20;
        if (s.y > h + 20) s.y = -20;
      }

      ctx.restore();
      raf = window.requestAnimationFrame(draw);
    };

    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });
    resize();

    if (prefersReducedMotion) {
      draw(performance.now());
      window.cancelAnimationFrame(raf);
      raf = 0;
    } else {
      raf = window.requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener("resize", onResize as any);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  return (
    <div className="site-animated-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="site-animated-bg__canvas" />
    </div>
  );
}
