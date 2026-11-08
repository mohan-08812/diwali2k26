import { useRef, useEffect } from 'react';

/**
 * BokehOverlay — High-performance Canvas bokeh / sparkle overlay.
 * Uses a single canvas render loop instead of 30 heavy DOM nodes.
 */
function BokehOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

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

    // 25 lightweight bokeh circles
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * (w || 800),
      y: Math.random() * (h || 600),
      radius: Math.random() * 8 + 3,
      alpha: Math.random() * 0.25 + 0.05,
      speedY: -(Math.random() * 0.4 + 0.15),
      speedX: (Math.random() - 0.5) * 0.3,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let frameId;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.phase += p.pulseSpeed;

        // Wrap around
        if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `rgba(255, 245, 204, ${currentAlpha})`);
        grad.addColorStop(0.5, `rgba(255, 215, 0, ${currentAlpha * 0.5})`);
        grad.addColorStop(1, 'rgba(255, 215, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  );
}

export default BokehOverlay;
