import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import FormInput from "../components/FormInput";
import "../styles/Login.css";

const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      _id
      username
      email
      token
    }
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [login, { loading, error }] = useMutation(LOGIN_USER);

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
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default Login;
