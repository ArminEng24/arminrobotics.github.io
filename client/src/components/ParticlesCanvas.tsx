import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
};

export default function ParticlesCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let particles: Particle[] = [];
    let raf = 0;

    function resize() {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.6 - 0.1,
          size: Math.random() * 3 + 0.5,
          life: Math.random() * 100 + 100,
        });
      }
    }

    function step() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // subtle grid glow background
      // draw soft gradient
      const g = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.8);
      g.addColorStop(0, 'rgba(0,217,255,0.02)');
      g.addColorStop(1, 'rgba(10,14,39,0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        // draw
        ctx.beginPath();
        const alpha = Math.max(0, Math.min(1, p.life / 200));
        ctx.fillStyle = `rgba(0,217,255,${alpha * 0.6})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(0,217,255,0.9)';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // remove
        if (p.life <= 0 || p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) {
          particles.splice(i, 1);
        }
      }

      // occasionally spawn
      if (particles.length < 40 && Math.random() < 0.35) spawn();

      raf = requestAnimationFrame(step);
    }

    resize();
    spawn();
    raf = requestAnimationFrame(step);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%' }} />;
}
