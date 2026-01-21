import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "../pages/Authentification/Login";
import UserRegisterPage from "../pages/Authentification/Register";
import ForgotPassword from "../pages/Authentification/ForgotPassword";
import ResetPassword from "../pages/Authentification/ResetPassword";

// Pages principales
import HomePage from "../pages/HomePage";
import DashboardClient from "../pages/DashboardClient";

// Alignement
import Allignement from "../pages/Allignement";
import AlignmentDetailsPage from "../pages/AlignmentDetailsPage";
import AlignmentListPage from "../pages/AlignmentListPage";

// Autres
import PermisConstruction from "../components/PermisConstruction";
import ConstructionListPage from "../pages/ConstructionListPage";
import ConstructionDetailsPage from '../pages/ConstructionDetailsPage';
import PermisRemblai from '../pages/PermisRemblai';

// Admin & Profile
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UsersList from "../components/Users/UsersList";
import RoleManagement from "../pages/RoleAppli/Role";

/**
 * ProtectedRoute vérifie uniquement localStorage (clé "user").
 * Si la valeur est absente / invalide => redirect vers /login
 */
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("access_token");
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * PublicRoute vérifie si l'utilisateur est authentifié.
 * Si authentifié => redirect vers /
 */
const PublicRoute = ({ children }) => {
  const user = localStorage.getItem("access_token");
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><UserRegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/permis" element={<PermisConstruction />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardClient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-client"
          element={
            <ProtectedRoute>
              <DashboardClient />
            </ProtectedRoute>
          }
        />

        {/* Alignement */}
        <Route
          path="/alignement"
          element={
            <ProtectedRoute>
              <Allignement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alignement-list"
          element={
            <ProtectedRoute>
              <AlignmentListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alignment-details/:id"
          element={
            <ProtectedRoute>
              <AlignmentDetailsPage />
            </ProtectedRoute>
          }
        />

        {/* Permis */}
        <Route
          path="/permis-list"
          element={
            <ProtectedRoute>
              <ConstructionListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/permis-details/:id"
          element={
            <ProtectedRoute>
              <ConstructionDetailsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/permis-remblai"
          element={
            <ProtectedRoute>
              <PermisRemblai />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RoleManagement"
          element={
            <ProtectedRoute>
              <RoleManagement />
            </ProtectedRoute>
          }
        />

        {/* Catch-all pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;