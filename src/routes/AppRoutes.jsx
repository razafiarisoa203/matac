import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import UserRegisterPage from '../pages/Register';
import Dashboard from "../pages/Dashboard";
import Allignement from "../pages/Allignement";
import AlignmentList from "../pages/AlignmentList";
import AlignmentDetails from "../pages/AlignmentDetails";
import ForgotPassword from "../pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alignement" element={<Allignement />} />
        <Route path="/alignements" element={<AlignmentList />} />
        <Route path="/alignment-list" element={<AlignmentList />} />
        <Route path="/alignements/:id" element={<AlignmentDetails />} />
        <Route path="/alignment-details/:id" element={<AlignmentDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
