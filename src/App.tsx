import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Passport from "./pages/Passport";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/context/AuthContext";

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="fixed bottom-4 right-4 text-xs text-white/30 pointer-events-none select-none">
        Основатель сайта Ухлинов Александр
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;