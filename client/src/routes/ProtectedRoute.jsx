import { Navigate, Outlet } from "react-router-dom";
import useSession from "../hooks/useSession";

function ProtectedRoute({ allowedRoles }) {
  const [session] = useSession();

  if (!session?.user) {
    return <Navigate to="auth/sign-in" replace />;
  }

  const hasValidRoles = allowedRoles.some((role) => session?.user?.groups.includes(role));

  if (!hasValidRoles) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
