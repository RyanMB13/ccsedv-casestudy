import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 shadow">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <Link to="/" className="text-xl font-bold hover:text-gray-300">
            HackermanApp
          </Link>

          {token && (
            <>
              <Link to="/profile" className="hover:text-gray-300">
                Profile
              </Link>

              {role === "ADMIN" && (
                <>
                  <Link to="/admin-dashboard" className="hover:text-gray-300">
                    Admin Dashboard
                  </Link>
                  <Link to="/audit-logs" className="hover:text-gray-300">
                    Audit Logs
                  </Link>
                </>
              )}

              {(role === "MANAGER" || role === "ADMIN") && (
                <Link to="/manager-dashboard" className="hover:text-gray-300">
                  Manager Dashboard
                </Link>
              )}

              {role === "EMPLOYEE" && (
                <>
                  <Link to="/employee/create-task" className="hover:text-gray-300">
                    Create Task
                  </Link>
                  <Link to="/my-tasks" className="hover:text-gray-300">
                    My Tasks
                  </Link>
                </>
              )}
            </>
          )}

          {!token && (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </div>

        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;