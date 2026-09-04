import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth SSO
import Login from "../pages/Authentification/Login";
import Callback from "../pages/Authentification/Callback";
import RegisterComplete from "../pages/Authentification/RegisterComplete";

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
import PrescriptionUrbanisme from '../pages/PrescriptionUrbanisme';

// Admin & Profile
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UsersList from "../components/Users/UsersList";
import RoleManagement from "../pages/RoleAppli/Role";

// Route protégée (vérifie le JWT via /serviceauth/auth/verify-token)
import PrivateRoute from "../components/auth/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/register-complete" element={<RegisterComplete />} />
        <Route path="/permis" element={<PermisConstruction />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardClient />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard-client"
          element={
            <PrivateRoute>
              <DashboardClient />
            </PrivateRoute>
          }
        />

        {/* Alignement */}
        <Route
          path="/alignement"
          element={
            <PrivateRoute>
              <Allignement />
            </PrivateRoute>
          }
        />
        <Route
          path="/alignement-list"
          element={
            <PrivateRoute>
              <AlignmentListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/alignment-details/:id"
          element={
            <PrivateRoute>
              <AlignmentDetailsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/prescription-urbanisme"
          element={
            <PrivateRoute>
              <PrescriptionUrbanisme />
            </PrivateRoute>
          }
        />

        {/* Permis */}
        <Route
          path="/permis-list"
          element={
            <PrivateRoute>
              <ConstructionListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/permis-details/:id"
          element={
            <PrivateRoute>
              <ConstructionDetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/permis-remblai"
          element={
            <PrivateRoute>
              <PermisRemblai />
            </PrivateRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/RoleManagement"
          element={
            <PrivateRoute>
              <RoleManagement />
            </PrivateRoute>
          }
        />

        {/* Catch-all pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
