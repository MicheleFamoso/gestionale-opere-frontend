import { useEffect, useState } from "react";
import ThemeToggle from "../Utility/ThemeToggle";
import OperaViewer from "./OperaViewer";

/* ─── Staggered fade-in ──────────────────────────────────────────────── */
const gridStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Cinzel:wght@400&display=swap');

  .gallery-root {
    --gap: clamp(1rem, 2.5vw, 2rem);
    --col: 3;
    padding: var(--gap) 0 6rem;
  }

  @media (min-width: 768px)  { .gallery-root { --col: 4; } }

  /* numero opere piccolo in alto a sinistra */
  .gallery-count {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: oklch(65% 0.005 285);
    margin-bottom: 2.5rem;
    padding: 0 0.25rem;
  }

  /* griglia */
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(var(--col), 1fr);
    gap: var(--gap);
  }

  /* singola card */
  .gallery-card {
    cursor: pointer;
    opacity: 0;
    transform: translateY(18px);
    animation: card-in 0.55s cubic-bezier(.4,0,.2,1) forwards;
  }

  @keyframes card-in {
    to { opacity: 1; transform: translateY(0); }
  }

  .gallery-card:hover .gallery-img-wrap img {
    transform: scale(1.03);
  }

  .gallery-card:hover .gallery-line {
    width: 100%;
  }

  /* wrapper immagine — aspect ratio fisso */
  .gallery-img-wrap {
    width: 100%;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: oklch(96% 0 0);
    position: relative;
  }

  .gallery-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(.4,0,.2,1);
    display: block;
  }

  /* indice opera — overlay top-right */
  .gallery-index {
    position: absolute;
    top: 0.6rem;
    right: 0.7rem;
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: oklch(55% 0 0);
    background: oklch(100% 0 0 / 0.75);
    padding: 0.15rem 0.4rem;
    backdrop-filter: blur(4px);
  }

  /* testo sotto */
  .gallery-caption {
    padding: 0.65rem 0.1rem 0;
  }

  /* lineetta animata */
  .gallery-line {
    height: 1px;
    width: 1.5rem;
    background: oklch(75% 0.183 55.934);
    margin-bottom: 0.45rem;
    transition: width 0.4s cubic-bezier(.4,0,.2,1);
  }

  .gallery-opera-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(0.8rem, 1.4vw, 1rem);
    font-weight: 300;
    color: oklch(20% 0.005 285);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gallery-opera-meta {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: oklch(60% 0.005 285);
    margin-top: 0.2rem;
    text-transform: uppercase;
  }
`;

const Home = () => {
  const [opere, setOpere] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleOpere = async () => {
    try {
      const response = await fetch("http://localhost:3000/opera");
      if (!response.ok) throw new Error("Errore nel recupero delle opere");
      const data = await response.json();
      setOpere(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleOpere();
  }, []);

  return (
    <>
      <style>{gridStyles}</style>

      <div className="gallery-root mx-4 md:mx-0">
        <ThemeToggle />

        {opere.length > 0 && (
          <div className="gallery-count">
            {String(opere.length).padStart(2, "0")} opere
          </div>
        )}

        <div className="gallery-grid">
          {opere.map((opera, index) => (
            <div
              key={opera.id}
              className="gallery-card"
              style={{ animationDelay: `${index * 55}ms` }}
              onClick={() => setSelectedIndex(index)}
            >
              {/* immagine */}
              <div className="gallery-img-wrap">
                <img
                  src={opera.foto[0]?.linkFotoMin}
                  alt={opera.nomeOpera?.it || "Opera"}
                  loading="lazy"
                />
                {opera.indice && (
                  <span className="gallery-index">
                    {String(opera.indice).padStart(2, "0")}
                  </span>
                )}
              </div>

              {/* caption */}
              <div className="gallery-caption">
                <div className="gallery-line" />
                <div className="gallery-opera-title">
                  {opera.nomeOpera?.it || opera.nomeOpera?.en || "—"}
                </div>
                <div className="gallery-opera-meta">
                  {opera.dataOpera && new Date(opera.dataOpera).getFullYear()}
                  {opera.dataOpera && opera.materiale && " · "}
                  {opera.materiale?.it || opera.materiale?.en}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <OperaViewer
          opere={opere}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
};

export default Home;
