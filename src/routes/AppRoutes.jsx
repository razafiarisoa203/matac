import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import LandingPage from "../pages/LandingPage";
import Login from "../pages/Authentification/Login";
import UserRegisterPage from '../pages/Authentification/Register';
import Dashboard from "../pages/Dashboard";
import Allignement from "../pages/Allignement";
import AlignmentList from "../pages/AlignmentList";
import AlignmentDetails from "../pages/AlignmentDetails";
import ForgotPassword from "../pages/Authentification/ForgotPassword";
import HomePage from "../pages/HomePage";
import PermisConstruction from "../components/PermisConstruction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alignement" element={<Allignement />} />
        <Route path="/alignements" element={<AlignmentList />} />
        <Route path="/alignment-list" element={<AlignmentList />} />
        <Route path="/alignements/:id" element={<AlignmentDetails />} />
        <Route path="/alignment-details/:id" element={<AlignmentDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/permis" element={<PermisConstruction />} />
      </Routes>
    </Router>
  );
}

export default App;
