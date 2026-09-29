import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { getAuth } from "../../api/authStorage";

const ROLE_HOME_ROUTES = {
  CUSTOMER: "/customer",
  ADMINISTRATOR: "/admin",
  CASHIER: "/cashier",
  EVENT_COORDINATOR: "/event-coordinator",
  INVENTORY_MANAGER: "/inventory",
  HR_MANAGER: "/hr",
  RESTAURANT_MANAGER: "/restaurant-manager",
  CHEF: "/chef",
  RESTAURANT_STAFF: "/",
};

export default function ProtectedRoute({
  allowedRoles,
  children,
}) {
  const location = useLocation();
  const authData = getAuth();

  if (!authData?.accessToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  if (
    allowedRoles?.length > 0 &&
    !allowedRoles.includes(authData.role)
  ) {
    const destination =
      ROLE_HOME_ROUTES[authData.role] ?? "/";

    return (
      <Navigate
        to={destination}
        replace
      />
    );
  }

  return children;
}