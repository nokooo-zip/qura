import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import ClientEditor from "./pages/ClientEditor";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/client/:id"
        element={
          <ProtectedRoute>
            <ClientEditor />
          </ProtectedRoute>
        }
      />

      {/* QR destination */}
      <Route path="/profile/:slug" element={<PublicProfile />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
