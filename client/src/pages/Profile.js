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
      <h2 className="text-3xl font-bold mb-6">👤 Profile</h2>

      {error && <p className="text-red-600">{error}</p>}

      {user ? (
        <div>
          <table className="w-full border border-collapse mb-4 text-center" border="1" cellPadding="6">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Last Login</th>
                <th className="px-4 py-2">Previous Login</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
                </td> {/* 2.1.12*/}
                <td className="px-4 py-2">
                  {user.previousLogin ? new Date(user.previousLogin).toLocaleString() : "N/A"}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={handleChangePassword}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
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