import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {

  const { user } = useAuth();

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Dashboard</h1>

        <div className="welcome-card">

          <h2>
            Welcome, {user?.username}
          </h2>

          <p>
            Role: <strong>{user?.role}</strong>
          </p>

        </div>

        <div className="dashboard-grid">

          <Link
            to="/tasks"
            className="dashboard-card"
          >
            <h2>Tasks</h2>
            <p>
              View and manage your tasks.
            </p>
          </Link>

          {(user?.role === "SUPER_ADMIN" ||
            user?.role === "MANAGER") && (

            <Link
              to="/users"
              className="dashboard-card"
            >
              <h2>Users</h2>
              <p>
                View system users.
              </p>
            </Link>

          )}

        </div>

      </div>
    </>
  );
};

export default Dashboard;