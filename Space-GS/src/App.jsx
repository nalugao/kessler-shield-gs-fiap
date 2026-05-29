import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Layout from "./components/Layout"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        
        </Route>
      </Routes>
    
    </BrowserRouter>
  );
}


export default App;

export default App
