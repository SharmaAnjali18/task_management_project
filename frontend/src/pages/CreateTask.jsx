import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

const CreateTask = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assigned_to: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const response = await api.get(
          "users/"
        );

        setUsers(response.data);

      } catch (error) {

        console.error(error);

      }
    };

    fetchUsers();

  }, []);

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
        ...formData,
        assigned_to:
          formData.assigned_to
            ? Number(formData.assigned_to)
            : null,
      };

      await api.post(
        "tasks/",
        data
      );

      navigate("/tasks");

    } catch (error) {

      console.error(error);

      setError(
        JSON.stringify(
          error.response?.data ||
          "Unable to create task."
        )
      );

    }
  };

  return (
    <>
      <Navbar />

      <div className="form-container">

        <h1>Create Task</h1>

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

          <label>Assign To</label>

          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
          >

            <option value="">
              Select User
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

          <div className="form-actions">

            <button type="submit">
              Create Task
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

export default CreateTask;