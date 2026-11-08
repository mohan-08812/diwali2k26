import './Diyas.css';

/**
 * Diyas — A row of flickering diya (oil lamp) flames along the bottom.
 * Each diya has a flame, a glowing halo, and a clay body.
 */
function Diyas() {
  const diyaCount = 9;

  return (
    <div className="diyas-container" aria-hidden="true">
      {Array.from({ length: diyaCount }).map((_, i) => (
        <div
          key={i}
          className="diya"
          style={{ animationDelay: `${i * 0.15}s` }}
        >
          {/* Glow halo behind the flame */}
          <div className="diya-halo" style={{ animationDelay: `${i * 0.2}s` }}></div>
          {/* Flame */}
          <div className="diya-flame-wrap" style={{ animationDelay: `${i * 0.25}s` }}>
            <div className="diya-flame-outer"></div>
            <div className="diya-flame-core"></div>
          </div>
          {/* Wick */}
          <div className="diya-wick"></div>
          {/* Clay body */}
          <div className="diya-clay">
            <div className="diya-clay-inner"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Diyas;

