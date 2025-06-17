import { signOut } from "next-auth/react";

const LogoutButton = ({ children, className = "" }) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className={`text-red-600 hover:text-red-800 transition-colors ${className}`}
    >
      {children || "Logout"}
    </button>
  );
};

export default LogoutButton;
