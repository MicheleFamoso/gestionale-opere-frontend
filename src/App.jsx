import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="p-4">
        {" "}
        {/* Container daisyUI */}
        <Routes>
          <Route path="/" element={"Ciao"} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
