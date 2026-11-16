import { Navigate, Outlet } from "react-router";

interface ProtectedRouteProps {
  isAllowed: boolean;
  redirect?: string;
}

export default function ProtectedRoute({
  isAllowed,
  redirect = "/signin",
}: ProtectedRouteProps) {
  return isAllowed ? <Outlet /> : <Navigate to={redirect} replace />;
}
