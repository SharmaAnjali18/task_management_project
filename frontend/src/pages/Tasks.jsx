import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {

  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  const fetchTasks = async () => {

    setLoading(true);
    setError("");

    try {

      const params = {
        page,
      };

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.priority) {
        params.priority = filters.priority;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      const response = await api.get(
        "tasks/",
        { params }
      );

      setTasks(response.data.results || []);

      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });

    } catch (error) {

      console.error(error);

      setError(
        "Unable to load tasks."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filters.status, filters.priority]);

  const handleFilterChange = (e) => {

    setPage(1);

    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {

    e.preventDefault();

    setPage(1);

    fetchTasks();
  };

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.delete(
        `tasks/${id}/`
      );

      fetchTasks();

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Unable to delete task."
      );

    }
  };

  const canCreateTask =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER";

  const canDeleteTask =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER";

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="page-header">

          <h1>Tasks</h1>

          {canCreateTask && (
            <Link
              to="/tasks/create"
              className="primary-btn"
            >
              + Create Task
            </Link>
          )}

        </div>

        {/* Filters */}

        <div className="filter-card">

          <form onSubmit={handleSearch}>

            <input
              name="search"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
            />

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">
                All Status
              </option>

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

            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >

              <option value="">
                All Priority
              </option>

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

            <button type="submit">
              Search
            </button>

          </form>

        </div>

        {loading && (
          <p>Loading tasks...</p>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="empty-state">
            No tasks found.
          </div>
        )}

        {/* Task Cards */}

        <div className="task-grid">

          {tasks.map((task) => (

            <div
              className="task-card"
              key={task.id}
            >

              <div className="task-card-header">

                <h3>
                  {task.title}
                </h3>

                <span
                  className={`status ${task.status.toLowerCase()}`}
                >
                  {task.status}
                </span>

              </div>

              <p>
                {task.description}
              </p>

              <div className="task-info">

                <span>
                  Priority:
                  <strong>
                    {" "}{task.priority}
                  </strong>
                </span>

                <span>
                  Created by:
                  <strong>
                    {" "}{task.created_by}
                  </strong>
                </span>

                <span>
                  Assigned to:
                  <strong>
                    {" "}
                    {task.assigned_to_username ||
                      "Not assigned"}
                  </strong>
                </span>

              </div>

              <div className="task-actions">

                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="edit-btn"
                >
                  Edit
                </Link>

                {canDeleteTask && (
                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(task.id)
                    }
                  >
                    Delete
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

        {/* Pagination */}

        <div className="pagination">

          <button
            disabled={!pagination.previous}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {page}
          </span>

          <button
            disabled={!pagination.next}
            onClick={() =>
              setPage((prev) => prev + 1)
            }
          >
            Next
          </button>

        </div>

      </div>
    </>
  );
};

export default Tasks;