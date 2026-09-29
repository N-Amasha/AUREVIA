import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { clearAuth } from "../../api/authStorage";

export default function SignOutButton({
  className = "",
}) {
  const navigate = useNavigate();

  function handleSignOut() {
    clearAuth();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}