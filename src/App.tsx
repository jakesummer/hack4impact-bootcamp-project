import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AuthPage from "./pages/AuthPage.tsx";

function App() {
  const currentUser = false; // todo: set up authentication

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          // once authentication is set up we can have this display AdminDashboard or VolunteerDashboard depending on permissions
          element={
            currentUser ? <AdminDashboard /> : <Navigate to="signin" replace />
          }
        />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup"/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
