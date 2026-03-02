import { useEffect, useState } from "react";

const Home = () => {
  const [opere, setOpere] = useState([]);
  const HandleOpere = async () => {
    try {
      const response = await fetch("http://localhost:3000/opera");
      if (!response.ok) {
        throw new Error("Errore nel recupero delle opere");
      }
      const data = await response.json();
      setOpere(data);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    HandleOpere();
  }, []);
  return (
    <div>
      <h1>Ciao</h1>

      {opere.map((opera) => (
        <div key={opera.id}>
          <h1>{opera.nomeOpera.it}</h1>
          {opera.foto.map((fote) => (
            <h2 key={fote.id}>{fote.dimensione}</h2>
          ))}
        </div>
      ))}
    </div>
  );
};
export default Home;
