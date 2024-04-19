import "./index.css";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/SignUp";

import { useAuth } from "./context/AuthContext";

const App = () => {
  const auth = useAuth();

  return (
    <main>
      <Navbar />

      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </main>
  );
};

export default App;
