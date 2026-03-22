import { useEffect, useState } from "react";
import ThemeToggle from "../Utility/ThemeToggle";
import OperaViewer from "./OperaViewer";

/* ─── Staggered fade-in ──────────────────────────────────────────────── */

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
      <div className="gallery-root mx-4 md:mx-0">
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
