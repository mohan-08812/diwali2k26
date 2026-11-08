import './StringLights.css';

/**
 * StringLights — Twinkling fairy lights strung across the top of the screen.
 * Uses CSS animations for sequential blinking.
 */
function StringLights() {
  const bulbCount = 20;
  const colors = ['#FFD700', '#FF4500', '#FF69B4', '#00FF88', '#FF8C00', '#E040FB', '#00BFFF', '#FF1493'];

  return (
    <div className="string-lights" aria-hidden="true">
      {/* Wire/string */}
      <svg className="wire" viewBox="0 0 1000 60" preserveAspectRatio="none">
        <path
          d="M0,10 Q50,50 100,10 Q150,50 200,10 Q250,50 300,10 Q350,50 400,10 Q450,50 500,10 Q550,50 600,10 Q650,50 700,10 Q750,50 800,10 Q850,50 900,10 Q950,50 1000,10"
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="2"
        />
      </svg>
      {/* Bulbs */}
      <div className="bulbs">
        {Array.from({ length: bulbCount }).map((_, i) => {
          const color = colors[i % colors.length];
          return (
            <div
              key={i}
              className="bulb-wrapper"
              style={{
                left: `${(i / (bulbCount - 1)) * 96 + 2}%`,
                top: `${Math.sin((i / (bulbCount - 1)) * Math.PI * 10) * 12 + 10}px`,
              }}
            >
              <div className="bulb-string"></div>
              <div
                className="bulb"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
                  animationDelay: `${i * 0.15}s`,
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StringLights;

