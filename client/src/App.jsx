import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CallPage from "./pages/CallPage";

function App() {
  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center  bg-black text-white font-mono ">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/call/:roomId" element={<CallPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
