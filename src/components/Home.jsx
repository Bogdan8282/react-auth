import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const response = await axios.get("/check-auth");
      setUser(response.data.user);
    } catch (error) {
      console.error("Error checking auth", error);
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/delete-account", { withCredentials: true });
      navigate("/register");
    } catch (error) {
      console.error("Error deleting account", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <h2>Home</h2>
      {user ? (
        <div>
          <p>Welcome, {user.name}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
