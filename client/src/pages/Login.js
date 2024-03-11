import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import "../css/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading status
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = () => {
    setLoading(true); // Set loading to true when login button is clicked
    const data = { username: username, password: password };
    axios
      .post("https://social-media-lite.onrender.com/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
          setLoading(false); // Set loading to false in case of error
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
          setLoading(false); // Set loading to false after successful authentication
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false); // Set loading to false in case of error
      });
  };

  return (
    <div className="card">
      <div className="loginContainer">
        <h2>Welcome Back!</h2>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Enter your username"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          placeholder="Enter your password"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button onClick={login}>
          {loading ? "Logging in..." : "Login"} {/* Show loading text if loading */}
        </button>
      </div>
    </div>
  );
}

export default Login;
