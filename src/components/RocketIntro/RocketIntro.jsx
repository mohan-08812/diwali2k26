import { useRef, useEffect } from 'react';

/**
 * RocketIntro — Dramatic intro sequence:
 * 1. A Diwali rocket launches from the bottom with a sparkling trail
 * 2. It accelerates upward with wobble and sparks
 * 3. Massive explosion with shockwave rings + screen flash
 * 4. Calls onComplete after the explosion settles
 */

const BURST_COLORS = [
  '#FFD700', '#FF8C00', '#FF4500', '#FF69B4',
  '#FF1493', '#FFA500', '#FFEF00', '#E040FB', '#00FF88',
];

function RocketIntro({ onComplete }) {
  const canvasRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x for perf

    let w, h;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle pool
    const particles = [];
    const MAX_PARTICLES = 500;

    // Rocket state
    const rocketStartX = w / 2;
    const rocketStartY = h + 10;
    const rocketEndY = h * 0.28;
    const rocketDuration = 1600; // ms
    let rocketX = rocketStartX;
    let rocketY = rocketStartY;
    let exploded = false;
    let flashAlpha = 0;
    let ring1 = { radius: 0, alpha: 0 };
    let ring2 = { radius: 0, alpha: 0 };
    let ring3 = { radius: 0, alpha: 0 };

    const startTime = performance.now();

    // Easing functions
    const easeIn = (t) => t * t * t;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);

    function addParticle(p) {
      if (particles.length < MAX_PARTICLES) particles.push(p);
    }

    // Create explosion burst
    function createBurst(x, y, count) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const speed = Math.random() * 7 + 2.5;
        addParticle({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
          life: 1,
          decay: 0.004 + Math.random() * 0.007,
          size: Math.random() * 4 + 2,
          gravity: 0.025 + Math.random() * 0.02,
          friction: 0.98,
        });
      }
    }

    // Create sparkle/glitter
    function createGlitter(x, y, count) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 0.5;
        addParticle({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: '#FFF5CC',
          life: 1,
          decay: 0.005 + Math.random() * 0.005,
          size: Math.random() * 2 + 0.5,
          gravity: 0.01,
          friction: 0.995,
          glitter: true,
        });
      }
    }

    let frameId;
    function animate(now) {
      const elapsed = now - startTime;

      // Clear — fast fade for trails
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = exploded ? 'rgba(10, 0, 21, 0.06)' : 'rgba(10, 0, 21, 0.18)';
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';

      // ── ROCKET PHASE ──
      if (elapsed < rocketDuration) {
        const p = Math.min(elapsed / rocketDuration, 1);
        // Acceleration curve: fast start, slight slow at top
        const eased = p < 0.75 ? easeIn(p / 0.75) * 0.75 : 0.75 + easeOut((p - 0.75) / 0.25) * 0.25;

        rocketY = rocketStartY - (rocketStartY - rocketEndY) * eased;
        rocketX = rocketStartX + Math.sin(p * 12) * 4; // wobble

        // Rocket head glow — radial gradient
        ctx.globalAlpha = 1;
        const grad = ctx.createRadialGradient(rocketX, rocketY, 0, rocketX, rocketY, 20);
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.2, 'rgba(255,245,204,0.7)');
        grad.addColorStop(0.5, 'rgba(255,215,0,0.3)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(rocketX - 20, rocketY - 20, 40, 40);

        // Rocket dot
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(rocketX, rocketY, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Trail particles — multiple per frame for thick trail
        const trailCount = Math.min(4, 2 + Math.floor(p * 3));
        for (let j = 0; j < trailCount; j++) {
          addParticle({
            x: rocketX + (Math.random() - 0.5) * 8,
            y: rocketY + Math.random() * 10 + 2,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 3 + 1.5,
            color: Math.random() < 0.4 ? '#FF8C00' : Math.random() < 0.7 ? '#FFD700' : '#FFF5CC',
            life: 1,
            decay: 0.025 + Math.random() * 0.03,
            size: Math.random() * 3 + 1,
            gravity: 0.015,
            friction: 0.97,
          });
        }

        // Side sparks
        if (Math.random() < 0.4) {
          const side = Math.random() < 0.5 ? -1 : 1;
          addParticle({
            x: rocketX, y: rocketY,
            vx: side * (Math.random() * 4 + 1.5),
            vy: Math.random() * 2 - 0.5,
            color: '#FFF5CC',
            life: 1,
            decay: 0.05 + Math.random() * 0.04,
            size: Math.random() * 2 + 0.5,
            gravity: 0.06,
            friction: 0.95,
          });
        }
      }

      // ── EXPLOSION ──
      if (elapsed >= rocketDuration && !exploded) {
        exploded = true;
        flashAlpha = 0.7;
        ring1 = { radius: 0, alpha: 1 };

        // Primary burst
        createBurst(rocketX, rocketY, 140);
        createGlitter(rocketX, rocketY, 50);

        // Delayed secondary burst + ring
        setTimeout(() => {
          createBurst(rocketX, rocketY, 80);
          ring2 = { radius: 0, alpha: 0.7 };
        }, 150);

        // Third ring
        setTimeout(() => {
          ring3 = { radius: 0, alpha: 0.5 };
          createGlitter(rocketX, rocketY, 30);
        }, 350);
      }

      // Screen flash
      if (flashAlpha > 0.005) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = flashAlpha;
        const flashGrad = ctx.createRadialGradient(rocketX, rocketY, 0, rocketX, rocketY, Math.max(w, h));
        flashGrad.addColorStop(0, 'rgba(255,215,0,0.8)');
        flashGrad.addColorStop(0.3, 'rgba(255,140,0,0.4)');
        flashGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, w, h);
        flashAlpha *= 0.88;
        ctx.globalCompositeOperation = 'lighter';
      }

      // Expanding rings
      const drawRing = (ring, color, lineW, speed) => {
        if (ring.alpha > 0.01) {
          ring.radius += speed;
          ring.alpha *= 0.96;
          ctx.globalAlpha = ring.alpha;
          ctx.strokeStyle = color;
          ctx.lineWidth = lineW * ring.alpha;
          ctx.beginPath();
          ctx.arc(rocketX, rocketY, ring.radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      };
      drawRing(ring1, '#FFD700', 4, 9);
      drawRing(ring2, '#FF8C00', 3, 6);
      drawRing(ring3, '#FF69B4', 2, 4);

      // ── UPDATE PARTICLES ──
      let writeIdx = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.life -= p.decay;

        if (p.life > 0.01) {
          // Draw
          if (p.glitter) {
            const flicker = Math.sin(now * 0.015 + p.x * 0.1) * 0.5 + 0.5;
            ctx.globalAlpha = p.life * flicker;
          } else {
            ctx.globalAlpha = p.life;
          }
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.life), 0, Math.PI * 2);
          ctx.fill();

          particles[writeIdx++] = p; // compact in-place
        }
      }
      particles.length = writeIdx;

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      // ── COMPLETION CHECK ──
      if (exploded && elapsed > rocketDuration + 2200 && !doneRef.current) {
        doneRef.current = true;
        onComplete();
        return;
      }

      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 50,
      }}
    />
  );
}

export default RocketIntro;

