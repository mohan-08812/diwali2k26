import './Rangoli.css';

/**
 * Rangoli — A decorative circular pattern at the bottom center with a pulsing glow.
 * Uses an SVG pattern for the traditional rangoli design.
 */
function Rangoli() {
  // Generate petal paths for a symmetric rangoli
  const petalCount = 12;
  const petals = Array.from({ length: petalCount }).map((_, i) => {
    const angle = (i / petalCount) * 360;
    return angle;
  });

  return (
    <div className="rangoli-container" aria-hidden="true">
      <div className="rangoli-glow"></div>
      <svg className="rangoli-svg" viewBox="-60 -60 120 120" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle ring */}
        <circle cx="0" cy="0" r="55" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
        <circle cx="0" cy="0" r="50" fill="none" stroke="#FF8C00" strokeWidth="1" opacity="0.4" />

        {/* Dot ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return (
            <circle
              key={`dot-${i}`}
              cx={Math.cos(a) * 52}
              cy={Math.sin(a) * 52}
              r="1.5"
              fill={i % 2 === 0 ? '#FFD700' : '#FF4500'}
              opacity="0.7"
            />
          );
        })}

        {/* Large petals */}
        {petals.map((angle, i) => (
          <g key={`petal-${i}`} transform={`rotate(${angle})`}>
            <ellipse
              cx="0"
              cy="-30"
              rx="8"
              ry="18"
              fill={i % 3 === 0 ? '#FF4500' : i % 3 === 1 ? '#FFD700' : '#FF69B4'}
              opacity="0.5"
              stroke="#FFD700"
              strokeWidth="0.5"
            />
          </g>
        ))}

        {/* Small inner petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * 360 + 22.5;
          return (
            <g key={`inner-${i}`} transform={`rotate(${angle})`}>
              <ellipse
                cx="0"
                cy="-15"
                rx="5"
                ry="10"
                fill={i % 2 === 0 ? '#FF8C00' : '#E040FB'}
                opacity="0.6"
                stroke="#FFD700"
                strokeWidth="0.3"
              />
            </g>
          );
        })}

        {/* Center flower */}
        <circle cx="0" cy="0" r="8" fill="#FF4500" opacity="0.7" stroke="#FFD700" strokeWidth="1" />
        <circle cx="0" cy="0" r="4" fill="#FFD700" opacity="0.9" />
        <circle cx="0" cy="0" r="2" fill="#FFF5CC" />

        {/* Inner circle ring */}
        <circle cx="0" cy="0" r="22" fill="none" stroke="#FFD700" strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

export default Rangoli;

