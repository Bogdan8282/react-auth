<<<<<<< HEAD
import { useState } from "react";
=======
import React, { useState } from "react";
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
<<<<<<< HEAD
  const [name, setName] = useState("");
=======
  const [email, setEmail] = useState("");
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      await axios.post("/login", { name, password });
      navigate("/");
=======
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); // Redirect to home page after successful login
      }
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
    } catch (error) {
      setError(error.response.data || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
<<<<<<< HEAD
          type="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
=======
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Login;
