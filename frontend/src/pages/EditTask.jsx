import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const EditTask = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assigned_to: "",
  });

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    const loadTask = async () => {

      try {

        const response = await api.get(
          `tasks/${id}/`
        );

        const task = response.data;

        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assigned_to:
            task.assigned_to || "",
        });

      } catch (error) {

        setError(
          error.response?.data?.error ||
          "Unable to load task."
        );

      } finally {

        setLoading(false);

      }
    };

    loadTask();

  }, [id]);

  useEffect(() => {

    const loadUsers = async () => {

      if (
        user?.role !== "SUPER_ADMIN" &&
        user?.role !== "MANAGER"
      ) {
        return;
      }

      try {

        const response = await api.get(
          "users/"
        );

        setUsers(response.data);

      } catch (error) {

        console.error(error);

      }
    };

    loadUsers();

  }, [user]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    try {

      const data = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
      };

      if (
        user?.role === "SUPER_ADMIN" ||
        user?.role === "MANAGER"
      ) {

        data.assigned_to =
          formData.assigned_to
            ? Number(formData.assigned_to)
            : null;
      }

      await api.patch(
        `tasks/${id}/`,
        data
      );

      navigate("/tasks");

    } catch (error) {

      setError(
        JSON.stringify(
          error.response?.data ||
          "Unable to update task."
        )
      );

    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="form-container">

        <h1>Edit Task</h1>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <form
          className="task-form"
          onSubmit={handleSubmit}
        >

          <label>Title</label>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >

            <option value="TODO">
              To Do
            </option>

            <option value="IN_PROGRESS">
              In Progress
            </option>

            <option value="COMPLETED">
              Completed
            </option>

          </select>

          <label>Priority</label>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >

            <option value="LOW">
              Low
            </option>

            <option value="MEDIUM">
              Medium
            </option>

            <option value="HIGH">
              High
            </option>

          </select>

          {(user?.role === "SUPER_ADMIN" ||
            user?.role === "MANAGER") && (

            <>
              <label>Assign To</label>

              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
              >

                <option value="">
                  Not Assigned
                </option>

                {users.map((user) => (

                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.username} - {user.role}
                  </option>

                ))}

              </select>
            </>

          )}

          <div className="form-actions">

            <button type="submit">
              Update Task
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                navigate("/tasks")
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </>
  );
};

export default EditTask;