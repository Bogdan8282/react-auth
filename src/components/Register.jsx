<<<<<<< HEAD
import { useState } from "react";
=======
import React, { useState } from "react";
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
<<<<<<< HEAD
  const [name, setName] = useState("");
=======
  const [email, setEmail] = useState("");
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      await axios.post("/register", { name, password });
=======
      const response = await axios.post("/register", { email, password });
      localStorage.setItem("token", response.data.token);
>>>>>>> c4f3df6db72cde81fa94afb116801004a0489691
      navigate("/");
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
