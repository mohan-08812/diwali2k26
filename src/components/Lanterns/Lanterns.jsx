import './Lanterns.css';

/**
 * Lanterns — Floating akash kandil (sky lanterns) that rise slowly with a gentle sway.
 * Each lantern is a CSS-drawn shape with a warm glow.
 */
function Lanterns() {
  const lanterns = [
    { left: '10%', delay: '0s', duration: '25s', size: 1 },
    { left: '30%', delay: '5s', duration: '30s', size: 0.8 },
    { left: '55%', delay: '2s', duration: '22s', size: 1.1 },
    { left: '75%', delay: '8s', duration: '28s', size: 0.9 },
    { left: '90%', delay: '4s', duration: '26s', size: 0.7 },
  ];

  return (
    <div className="lanterns-container" aria-hidden="true">
      {lanterns.map((l, i) => (
        <div
          key={i}
          className="lantern"
          style={{
            left: l.left,
            animationDelay: l.delay,
            animationDuration: l.duration,
            transform: `scale(${l.size})`,
          }}
        >
          {/* Inner glow */}
          <div className="lantern-glow"></div>
          {/* Lantern body */}
          <div className="lantern-body">
            <div className="lantern-top"></div>
            <div className="lantern-middle">
              <div className="lantern-pattern"></div>
            </div>
            <div className="lantern-bottom"></div>
          </div>
          {/* String/tassel */}
          <div className="lantern-tassel"></div>
        </div>
      ))}
    </div>
  );
}

export default Lanterns;

