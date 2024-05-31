import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import FormInput from '../components/FormInput';
import '../styles/Signup.css';
import { Button } from "antd";

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
  const [validationError, setValidationError] = useState('');
  const [apolloError, setApolloError] = useState('');
  const [signup, { loading, error }] = useMutation(SIGNUP_USER, {
    onError: (err) => {
      setApolloError('User already exists.');
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError(''); // Clear validation error on input change
    setApolloError(''); // Clear Apollo error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.length > 0 && formData.username.length < 3) {
      setValidationError('Username must be at least 3 characters.');
      return;
    }

    if (!formData.username || !formData.email || !formData.password) {
      setValidationError('You must enter a username, email, and password.');
      return;
    }

    try {
      const { data } = await signup({
        variables: { ...formData },
      });
      setFormData({
        username: '',
        email: '',
        password: '',
      });

      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="signup-container">
      <h2>Signup</h2>
      <form id="signup-form" onSubmit={handleSubmit}>
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
        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#222E50', borderColor: '#222E50' }}>Signup</Button>
        {loading && <p>Loading...</p>}
        {validationError && <p>{validationError}</p>}
        {apolloError && <p>{apolloError}</p>}
      </form>
    </div>
  );
};

export default Signup;
