import { useEffect, useRef, useState } from "react";

/**
 * CustomCursor — punto minimal che segue il mouse
 * Si ingrandisce su elementi cliccabili (a, button, [data-cursor])
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Nascondi cursore nativo su tutto il documento
    document.documentElement.style.cursor = "none";

    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Il puntino segue istantaneamente
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }

      // Hover check
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const clickable = el?.closest(
        "a, button, [role='button'], [data-cursor='pointer'], .gallery-card, .ov-close, .ov-opera-nav, .ov-foto-nav, .ov-dot, .ov-progress-dot",
      );
      setHovered(!!clickable);
    };

    // L'anello segue con lerp (lag morbido)
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.12;
      ring.current.y += (pos.current.y - ring.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <style>{`
        .cc-dot, .cc-ring {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
        }

        /* Punto centrale */
        .cc-dot {
          width: 5px;
          height: 5px;
          background: oklch(20% 0.005 285);
          border-radius: 50%;
          margin-left: -2.5px;
          margin-top: -2.5px;
          transition: transform 0.1s, opacity 0.2s;
        }

        /* Anello esterno con lag */
        .cc-ring {
          width: 32px;
          height: 32px;
          border: 1px solid oklch(20% 0.005 285 / 0.35);
          border-radius: 50%;
          margin-left: -16px;
          margin-top: -16px;
          transition:
            width   0.3s cubic-bezier(.4,0,.2,1),
            height  0.3s cubic-bezier(.4,0,.2,1),
            margin  0.3s cubic-bezier(.4,0,.2,1),
            border-color 0.3s,
            background   0.3s;
        }

        /* Stato hover — anello si riempie e rimpicciolisce */
        .cc-ring.hovered {
          width: 12px;
          height: 12px;
          margin-left: -6px;
          margin-top: -6px;
          background: oklch(75% 0.183 55.934 / 0.25);
          border-color: oklch(75% 0.183 55.934 / 0.8);
        }

        /* Nascondi cursore nativo su tutti gli elementi interattivi */
        * { cursor: none !important; }
      `}</style>

      <div className="cc-dot" ref={dotRef} />
      <div className={`cc-ring ${hovered ? "hovered" : ""}`} ref={ringRef} />
    </>
  );
};

export default CustomCursor;
