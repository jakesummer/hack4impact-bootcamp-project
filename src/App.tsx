import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

function App() {
  const currentUser = false; // todo: set up authentication

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          // once authentication is set up we can have this display AdminDashboard or VolunteerDashboard depending on permissions
          element={
            currentUser ? <AdminDashboard /> : <Navigate to="login" replace />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
