import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import api from "../services/api";

const Users = () => {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const response = await api.get(
          "users/"
        );

        setUsers(response.data);

      } catch (error) {

        setError(
          error.response?.data?.error ||
          "Unable to load users."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchUsers();

  }, []);

  return (
    <>
      <Navbar />

      <div className="container">

        <h1>Users</h1>

        {loading && (
          <p>Loading users...</p>
        )}

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {!loading && !error && (

          <div className="table-container">

            <table>

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Role</th>
                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    <td>
                      {user.id}
                    </td>

                    <td>
                      {user.username}
                    </td>

                    <td>
                      {user.email}
                    </td>

                    <td>
                      {user.first_name}{" "}
                      {user.last_name}
                    </td>

                    <td>
                      <span className="role-badge">
                        {user.role}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </>
  );
};

export default Users;