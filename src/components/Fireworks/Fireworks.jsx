import { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

const COLORS = [
  '#FFD700', '#FF8C00', '#FF4500', '#FF69B4',
  '#FF1493', '#00FF88', '#FF6347', '#FFA500',
  '#FFEF00', '#E040FB',
];

function heartShape(count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x: x * 0.28, y: y * 0.28 });
  }
  return points;
}

/**
 * Fireworks — High-performance 60fps HTML Canvas particle engine.
 *
 * Optimizations:
 * - Cap DPR at 2 to avoid huge 4K buffers
 * - In-place array filtering (no GC pressure)
 * - Single-pass drawing
 * - Direct arc draws without expensive shadowBlur
 * - Fast circular rocket trails
 */
const Fireworks = forwardRef(function Fireworks({ active = true, onBurst }, ref) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const intervalRef = useRef(null);
  const activeRef = useRef(active);

  useEffect(() => { activeRef.current = active; }, [active]);

  const createRocket = useCallback((x, y, targetY) => ({
    type: 'rocket',
    x, y,
    targetY: targetY ?? (Math.random() * 0.25 + 0.1) * (window.innerHeight || 800),
    vx: (Math.random() - 0.5) * 1.8,
    vy: -(Math.random() * 3 + 7),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    life: 1,
    trail: [],
  }), []);

  const createBurst = useCallback((x, y, color) => {
    const particles = [];
    const isHeart = Math.random() < 0.25;
    const count = isHeart ? 50 : Math.floor(Math.random() * 35 + 35);

    if (isHeart) {
      const heartPoints = heartShape(count);
      for (let i = 0; i < count; i++) {
        const pt = heartPoints[i];
        const speed = 1.3 + Math.random() * 0.8;
        particles.push({
          type: 'spark',
          x, y,
          vx: pt.x * speed,
          vy: pt.y * speed,
          color,
          life: 1,
          decay: 0.009 + Math.random() * 0.008,
          gravity: 0.035,
          size: Math.random() * 2 + 1.5,
          friction: 0.98,
        });
      }
    } else {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.25;
        const speed = Math.random() * 5 + 2;
        particles.push({
          type: 'spark',
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() < 0.25 ? COLORS[Math.floor(Math.random() * COLORS.length)] : color,
          life: 1,
          decay: 0.009 + Math.random() * 0.012,
          gravity: 0.045,
          size: Math.random() * 2.5 + 1.2,
          friction: 0.975,
        });
      }
    }

    // Glitter
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      particles.push({
        type: 'glitter',
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: '#FFF5CC',
        life: 1,
        decay: 0.016 + Math.random() * 0.012,
        gravity: 0.05,
        size: Math.random() * 1.5 + 0.5,
        friction: 0.96,
      });
    }

    return particles;
  }, []);

  const spawnFirework = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    particlesRef.current.push(createRocket(x, rect.height, y));
  }, [createRocket]);

  const launchRandom = useCallback(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = Math.random() * w * 0.8 + w * 0.1;
    particlesRef.current.push(createRocket(x, h, undefined));
  }, [createRocket]);

  const replay = useCallback(() => {
    particlesRef.current = [];
    for (let i = 0; i < 6; i++) {
      setTimeout(() => launchRandom(), i * 350);
    }
  }, [launchRandom]);

  useImperativeHandle(ref, () => ({ replay, spawnFirework }), [replay, spawnFirework]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = particlesRef.current;

    const animate = () => {
      // Semi-transparent fade
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(10, 0, 21, 0.18)';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      let writeIdx = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.type === 'rocket') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.04;

          p.trail.push(p.x, p.y);
          if (p.trail.length > 20) {
            p.trail.shift();
            p.trail.shift();
          }

          // Trail
          const tLen = p.trail.length;
          for (let t = 0; t < tLen; t += 2) {
            ctx.globalAlpha = (t / tLen) * 0.6;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.trail[t], p.trail[t + 1], 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          // Head
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#FFF5CC';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          if (p.y <= p.targetY || p.vy >= 0) {
            const burst = createBurst(p.x, p.y, p.color);
            for (let b = 0; b < burst.length; b++) particles.push(burst[b]);
            if (onBurst) onBurst();
          } else {
            particles[writeIdx++] = p;
          }
        } else {
          // Spark / glitter
          p.vx *= p.friction;
          p.vy *= p.friction;
          p.vy += p.gravity;
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;

          if (p.life > 0.01 && p.x > -10 && p.x < w + 10 && p.y < h + 10) {
            if (p.type === 'glitter') {
              const flicker = Math.sin(Date.now() * 0.015 + p.x) * 0.5 + 0.5;
              ctx.globalAlpha = p.life * flicker;
            } else {
              ctx.globalAlpha = p.life;
            }
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
            ctx.fill();

            particles[writeIdx++] = p;
          }
        }
      }

      particles.length = writeIdx;
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    if (activeRef.current) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => launchRandom(), i * 500 + 200);
      }
      intervalRef.current = setInterval(() => {
        if (activeRef.current) {
          launchRandom();
          if (Math.random() < 0.3) setTimeout(() => launchRandom(), 180);
        }
      }, 2000);
    }

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(intervalRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [createBurst, launchRandom, onBurst]);

  const handleClick = useCallback((e) => {
    spawnFirework(e.clientX, e.clientY);
  }, [spawnFirework]);

  return (
    <canvas
      ref={canvasRef}
      className="fireworks-canvas"
      onClick={handleClick}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        zIndex: 1,
      }}
    />
  );
});

export default Fireworks;
