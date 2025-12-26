import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/utils';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id?: string;
  animate?: boolean;
}

export default function AnimatedSection({ children, id, animate = true, className, ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Enable animation styles only when JS is available.
    document.documentElement.classList.add('scroll-anim');

    const el = ref.current;
    if (!el) return;

    if (!animate) return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      el.classList.add('active');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('active');
            observer.unobserve(entry.target);
          }
        }
      },
      {
        root: null,
        threshold: 0.62,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={cn('snap-section', animate && 'section-animate', className)}
      {...rest}
    >
      {children}
    </section>
  );
}
