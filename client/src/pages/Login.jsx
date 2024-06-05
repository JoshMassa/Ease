import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
import FormInput from "../components/FormInput";
import "../styles/Login.css";
import { Button } from "antd";
import AuthService from "../utils/auth";
import { LOGIN } from "../utils/mutations";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation(LOGIN);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formData },
      });
      console.log('Login data:', data); // Log the response to ensure it includes the token
      AuthService.login(data.login.token); // Save the token using AuthService

      const decoded = AuthService.getProfile();
      console.log('Decoded token:', decoded);
      setUser(decoded);

      setFormData({
        email: '',
        password: '',
      });
      
      const username = decoded.username;
      console.log(`Navigating to /user/${username}`);
      navigate(`/user/${username}`);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div id="login-container">
      <h2>Login</h2>
      <form id="login-form" onSubmit={handleSubmit}>
        <FormInput
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <FormInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#222E50', borderColor: '#222E50' }}>Login</Button>
        {loading && <p>Loading...</p>}
        {error && (
          <p>
            {!formData.email || !formData.password
              ? 'You must enter an email and password.'
              : 'Something went wrong.'}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
