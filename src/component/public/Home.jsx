import { useEffect, useState } from "react";
import ThemeToggle from "../Utility/ThemeToggle";

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
    <div className="mx-4 md:mx-0">
      <ThemeToggle />
      <button className="btn btn-primary">ciao a tutti</button>
      <div className=" ">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 ">
          {opere.map((opera) => (
            <div key={opera.id} className="flex justify-center items-center ">
              <img src={opera.foto[0].linkFotoMin} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Home;
