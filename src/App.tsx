import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import WorkerDashboard from "./pages/WorkerDashboard.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import DonationsPage from "./pages/DonationsPage.tsx";
import WishlistPage from "./pages/WishlistPage.tsx";
import DonationsManagementPage from "./pages/DonationsManagementPage.tsx";
import useAuth from "./hooks/useAuth.tsx";
import ParticipantDashboard from "./pages/ParticipantDashboard.tsx";
import UnauthorizedPage from "./pages/UnauthorizedPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  const { currentUser, userData } = useAuth();
  const isParticipant = userData?.accountType === "participant";

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <ProtectedRoute isAllowed={currentUser === null} redirect="/" />
          }
        >
          <Route path="/signin" element={<AuthPage mode="signin" />} />
          <Route path="signup" element={<AuthPage mode="signup" />} />
        </Route>

        <Route element={<ProtectedRoute isAllowed={currentUser !== null} />}>
          <Route
            path="/"
            element={
              isParticipant ? <ParticipantDashboard /> : <WorkerDashboard />
            }
          />
          <Route
            path="/donations"
            element={isParticipant ? <UnauthorizedPage /> : <DonationsPage />}
          >
            <Route
              path="/donations/manage"
              element={
                isParticipant ? (
                  <UnauthorizedPage />
                ) : (
                  <DonationsManagementPage />
                )
              }
            />
          </Route>
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
