import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./login.css";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_LOGIN, {
        login: login,
        password: password
      }, { withCredentials: true });
  
      if (!response.data || !response.data.user) {
        console.error("Login failed: No user data received");
        return;
      }
  
      localStorage.setItem("userId", response.data.user._id);
      localStorage.setItem("isLogged", "true");
      localStorage.setItem("role", response.data.user.role);
      localStorage.setItem("status", response.data.user.status);
  
      navigate("/Main");
    } catch (err) {
      console.error("Error while logging in", err);
      setError(err.response?.data?.error || "Error while logging in");
    }
  };  

  return (
    <div className='logBody'>
      <div className='logBox'>
        <p>Complete</p>
        {error && <p className='error'>{error}</p>}
        <input 
          type="text" 
          placeholder='Login' 
          value={login} 
          onChange={(e) => setLogin(e.target.value)}
        />
        <input 
          type="password" 
          placeholder='Password' 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Log in</button>
      </div>
    </div>
  );
}
