import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Passport from "./pages/Passport";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/passport" element={<Passport />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;