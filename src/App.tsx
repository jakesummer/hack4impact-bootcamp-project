import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./App.css";
import WorkerDashboard from "./pages/WorkerDashboard.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DonationsPage from "./pages/DonationsPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import DonationsManagementPage from "./pages/DonationsManagementPage.tsx";

function App() {
  const currentUser = false; // todo: set up authentication

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          // once authentication is set up we can have this display WorkerDashboard or ParticipantDashboard depending on permissions
          element={
            currentUser ? <WorkerDashboard /> : <Navigate to="signin" replace />
          }
        />
        <Route
          path="/donations"
          element={
            currentUser ? <DonationsPage /> : <Navigate to="signin" replace />
          }
        >
          <Route path="/donations/manage" element={<DonationsManagementPage />} />
        </Route>
        <Route
          path="/wishlist"
          element={
            currentUser ? <WishlistPage /> : <Navigate to="signin" replace />
          }
        />
        <Route path="/signin" element={<AuthPage mode="signin" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
