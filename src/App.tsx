import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Calculator from "./pages/Calculator";
import { Routes, Route } from "react-router-dom";
import useWeb3 from "./web3/webConfig/web3";
import { useEffect } from "react";

function App() {
  const { web3 } = useWeb3();

  useEffect(() => {
    const Web = web3;
    console.log(Web);
  }, [web3]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calculator" element={<Calculator />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
