import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-brand">
        <Link to="/dashboard">
          Task Manager
        </Link>
      </div>

      <div className="navbar-links">

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/tasks">
          Tasks
        </Link>

        {(user?.role === "SUPER_ADMIN" ||
          user?.role === "MANAGER") && (
          <Link to="/users">
            Users
          </Link>
        )}

        <span className="user-info">
          {user?.username} ({user?.role})
        </span>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
};

export default Navbar;