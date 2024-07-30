import React, { useState, useEffect } from "react";
import axios from "../utils/axios";

const Home = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get("/check-auth", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.authenticated) {
            setAuthenticated(true);
            setUser(response.data.user);
          }
        }
      } catch (error) {
        console.error("Error checking auth", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuthenticated(false);
    setUser(null);
  };

  return (
    <div>
      {authenticated ? (
        <div>
          <h1>Welcome, {user ? user.email : "User"}</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <h1>Please log in or register</h1>
      )}
    </div>
  );
};

export default Home;
