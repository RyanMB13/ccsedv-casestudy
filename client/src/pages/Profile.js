import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data.user);
      } catch (err) {
        setError("Access denied. Please login.");
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {error && <p className="text-red-600">{error}</p>}

      {user ? (
        <div>
          <table className="w-full border border-collapse mb-4" border="1" cellPadding="6">
            <thead>
              <tr className="bg-gray-200">
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Previous Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}</td>
                <td>{user.previousLogin ? new Date(user.previousLogin).toLocaleString() : "N/A"}</td>
                <td>
                  <button
                    onClick={handleChangePassword}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Change Password
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;