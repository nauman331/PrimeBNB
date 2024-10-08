import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { InitWeb3 } from "./web3/webConfig/web3";
function App() {
  useEffect(()=> { 
    const initWeb3Provider = async () => { 
      const web3 = await InitWeb3();
      if (web3) {
        console.log("Web3 initialized successfully", web3);
       }
    }
    initWeb3Provider()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/calculator" element={<Calculator />} />
    </Routes>
  );
}

export default App;
