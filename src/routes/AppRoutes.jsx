import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth
import Login from "../pages/Authentification/Login";
import UserRegisterPage from "../pages/Authentification/Register";
import ForgotPassword from "../pages/Authentification/ForgotPassword";

// Pages principales
import HomePage from "../pages/HomePage";
import Dashboard from "../pages/DashboardClient";
import DashboardClient from "../pages/DashboardClient";

// Alignement
import Allignement from "../pages/Allignement";
//import AlignmentList from "../pages/AlignmentList";
import AlignmentDetailsPage from "../pages/AlignmentDetailsPage";
import AlignmentListPage from "../pages/AlignmentListPage";

// Autres
import PermisConstruction from "../components/PermisConstruction";
import ConstructionListPage from "../pages/ConstructionListPage";
import ConstructionDetailsPage from '../pages/ConstructionDetailsPage';

// Admin & Profile
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UsersList from "../pages/Admin/UsersList";
import RoleManagement from "../pages/RoleAppli/Role";

// 🔒 Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => ({
    user: state.user?.user || null,
  }));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/permis" element={<PermisConstruction />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
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
        {/* <Route
          path="/liste-demandes"
          element={
            <ProtectedRoute>
              <AlignmentTable />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/alignement-list"
          element={
            <ProtectedRoute>
              <AlignmentListPage />
            </ProtectedRoute>
          }
        />
        {/*<Route
          path="/alignements"
          element={
            <ProtectedRoute>
              <AlignmentList />
            </ProtectedRoute>
          }
        />*/}
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
        <Route path="/permis-details/:id" element={
          <ProtectedRoute>
            <ConstructionDetailsPage />
          </ProtectedRoute>
        } />

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
      </Routes>
    </Router>
  );
}

export default App;
