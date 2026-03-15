import { useEffect, useRef, useState, useCallback } from "react";

/**
 * OperaViewer — lightbox fullscreen per collezione d'arte
 *
 * Props:
 *   opere        — array di opere dall'API
 *   initialIndex — indice dell'opera da aprire (null = chiuso)
 *   onClose      — callback per chiudere la lightbox
 */
const OperaViewer = ({ opere, initialIndex, onClose }) => {
  const [operaIndex, setOperaIndex] = useState(initialIndex ?? 0);
  const [fotoIndex, setFotoIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState(null); // "left" | "right"
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const opera = opere[operaIndex];

  // Reset foto quando cambia opera
  useEffect(() => {
    setFotoIndex(0);
  }, [operaIndex]);

  // Sync quando cambia initialIndex dall'esterno
  useEffect(() => {
    if (initialIndex !== null) {
      setOperaIndex(initialIndex);
    }
  }, [initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") navigateOpera(-1);
      if (e.key === "ArrowRight") navigateOpera(1);
      if (e.key === "ArrowUp") navigateFoto(-1);
      if (e.key === "ArrowDown") navigateFoto(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const navigateOpera = useCallback(
    (dir) => {
      const next = operaIndex + dir;
      if (next < 0 || next >= opere.length || transitioning) return;
      setDirection(dir === -1 ? "left" : "right");
      setTransitioning(true);
      setTimeout(() => {
        setOperaIndex(next);
        setTransitioning(false);
        setDirection(null);
      }, 300);
    },
    [operaIndex, opere.length, transitioning],
  );

  const navigateFoto = useCallback(
    (dir) => {
      const next = fotoIndex + dir;
      if (!opera || next < 0 || next >= opera.foto.length) return;
      setFotoIndex(next);
    },
    [fotoIndex, opera],
  );

  // Touch / swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50) navigateOpera(-1);
      if (dx < -50) navigateOpera(1);
    } else {
      if (dy > 50) navigateFoto(-1);
      if (dy < -50) navigateFoto(1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!opera) return null;

  const foto = opera.foto[fotoIndex];
  const hasPrevOpera = operaIndex > 0;
  const hasNextOpera = operaIndex < opere.length - 1;
  const hasPrevFoto = fotoIndex > 0;
  const hasNextFoto = fotoIndex < opera.foto.length - 1;

  return (
    <>
      <div
        className="ov-overlay"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top bar */}
        <div className="ov-topbar">
          <span className="ov-counter">
            {String(operaIndex + 1).padStart(2, "0")} /{" "}
            {String(opere.length).padStart(2, "0")}
          </span>
          <span className="ov-title-top">
            {opera.nomeOpera?.it || opera.nomeOpera?.en || "—"}
          </span>
          <button className="ov-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Main */}
        <div className="ov-main">
          {/* Immagine */}
          <div className="ov-image-panel">
            {/* Nav opera sx/dx */}
            <button
              className="ov-opera-nav prev"
              disabled={!hasPrevOpera}
              onClick={() => navigateOpera(-1)}
              title="Opera precedente (←)"
            >
              ‹
            </button>
            <button
              className="ov-opera-nav next"
              disabled={!hasNextOpera}
              onClick={() => navigateOpera(1)}
              title="Opera successiva (→)"
            >
              ›
            </button>

            {/* Frecce foto su/giù */}
            {opera.foto.length > 1 && (
              <>
                <button
                  className="ov-foto-nav top"
                  disabled={!hasPrevFoto}
                  onClick={() => navigateFoto(-1)}
                  title="Foto precedente (↑)"
                >
                  ↑
                </button>
                <button
                  className="ov-foto-nav bottom"
                  disabled={!hasNextFoto}
                  onClick={() => navigateFoto(1)}
                  title="Foto successiva (↓)"
                >
                  ↓
                </button>
              </>
            )}

            <div
              className={`ov-image-wrap ${
                transitioning
                  ? direction === "left"
                    ? "slide-left"
                    : "slide-right"
                  : ""
              }`}
            >
              <img
                key={`${operaIndex}-${fotoIndex}`}
                src={foto?.linkFotoMin}
                alt={opera.nomeOpera?.it || "Opera"}
              />
            </div>

            {/* Dot indicatori foto */}
            {opera.foto.length > 1 && (
              <div className="ov-foto-dots">
                {opera.foto.map((_, i) => (
                  <div
                    key={i}
                    className={`ov-dot ${i === fotoIndex ? "active" : ""}`}
                    onClick={() => setFotoIndex(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="ov-info-panel">
            {/* Titolo */}
            <div>
              <div className="ov-label">Titolo</div>
              <div className="ov-info-title">
                {opera.nomeOpera?.it || "—"}
                {opera.nomeOpera?.en &&
                  opera.nomeOpera.en !== opera.nomeOpera?.it && (
                    <>
                      <br />
                      <em>{opera.nomeOpera.en}</em>
                    </>
                  )}
              </div>
            </div>

            <div className="ov-divider" />

            {/* Meta */}
            <div className="ov-meta-grid">
              {opera.dataOpera && (
                <div className="ov-meta-item">
                  <div className="ov-label">Anno</div>
                  <div className="ov-meta-value">
                    {new Date(opera.dataOpera).getFullYear()}
                  </div>
                </div>
              )}
              {opera.materiale && (
                <div className="ov-meta-item">
                  <div className="ov-label">Materiale</div>
                  <div className="ov-meta-value">
                    {opera.materiale.it || opera.materiale.en}
                  </div>
                </div>
              )}
              {opera.supporto && (
                <div className="ov-meta-item">
                  <div className="ov-label">Supporto</div>
                  <div className="ov-meta-value">
                    {opera.supporto.it || opera.supporto.en}
                  </div>
                </div>
              )}
              {opera.indice && (
                <div className="ov-meta-item">
                  <div className="ov-label">N° opera</div>
                  <div className="ov-meta-value">#{opera.indice}</div>
                </div>
              )}
            </div>

            {/* Categorie */}
            {opera.categoria?.length > 0 && (
              <>
                <div className="ov-divider" />
                <div>
                  <div className="ov-label">Categorie</div>
                  <div style={{ marginTop: "0.5rem" }}>
                    {opera.categoria.map((cat) => (
                      <span key={cat.id} className="ov-categoria-tag">
                        {cat.nomeCategoria?.it ||
                          cat.nomeCategoria?.en ||
                          cat.descrizioneUsoPersonale}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Foto corrente info */}
            {opera.foto.length > 1 && (
              <>
                <div className="ov-divider" />
                <div className="ov-foto-label">
                  Foto {fotoIndex + 1} di {opera.foto.length}
                  {foto?.descrizione?.it && ` — ${foto.descrizione.it}`}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom — progress opere */}
        {opere.length > 1 && (
          <div className="ov-bottombar">
            {opere.map((_, i) => (
              <div
                key={i}
                className={`ov-progress-dot ${i === operaIndex ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (i !== operaIndex) {
                    setDirection(i > operaIndex ? "right" : "left");
                    setTransitioning(true);
                    setTimeout(() => {
                      setOperaIndex(i);
                      setTransitioning(false);
                      setDirection(null);
                    }, 300);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OperaViewer;
