import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import FormInput from '../components/FormInput';
import '../styles/Signup.css';

const SIGNUP_USER = gql`
  mutation signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      _id
      username
      email
      token
    }
  }
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [signup, { loading, error }] = useMutation(SIGNUP_USER);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await signup({
        variables: { ...formData },
      });
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (  
    <div id="signup-container"> 
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
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
        <button type="submit">Signup</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
      </form>
    </div>
  );
};

export default Signup;
