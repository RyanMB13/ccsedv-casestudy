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
    <div>
      <h2>Profile</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.lastLogin && (
            <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
          )}
          {user.previousLogin && (
            <p><strong>Previous Login:</strong> {new Date(user.previousLogin).toLocaleString()}</p>
          )}
          <button onClick={handleChangePassword}>Change Password</button>
        </div>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}

export default Profile;