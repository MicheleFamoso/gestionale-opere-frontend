import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./component/public/Home";
import CustomCursor from "./component/CustomCursor";
function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        {" "}
        <Route path="/" element={<Home></Home>}></Route>
        <Route></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
