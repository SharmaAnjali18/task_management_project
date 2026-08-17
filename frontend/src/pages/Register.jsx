import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {

      await register(formData);

      setMessage(
        "Registration successful. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {

      if (error.response?.data) {
        setError(
          JSON.stringify(error.response.data)
        );
      } else {
        setError("Registration failed");
      }

    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h1>Task Manager</h1>

        <h2>Create Account</h2>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {message && (
          <div className="success">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Username</label>

          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>First Name</label>

          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <label>Last Name</label>

          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Register;