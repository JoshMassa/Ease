import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, ConfigProvider, Row, Col, Spin } from 'antd';
import { useMutation } from '@apollo/client';
import { useNavigate } from "react-router-dom";
// import FormInput from '../components/FormInput';
import '../styles/Signup.css';
import { SIGNUP } from '../utils/mutations';

const { Title, Text } = Typography;

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');
  const [apolloError, setApolloError] = useState('');
  const navigate= useNavigate();

  const [signup, { loading }] = useMutation(SIGNUP, {
    onError: (err) => {
      setApolloError('User already exists.');
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
    setApolloError('');
  };

  const handleSubmit = async (values) => {
    setValidationError('');
    setApolloError('');

    if (values.username.length > 0 && values.username.length < 3) {
      setValidationError('Username must be at least 3 characters.');
      return;
    }

    if (!values.username || !values.email || !values.password) {
      setValidationError('You must enter a username, email, and password.');
      return;
    }

    try {
      const { data } = await signup({
        variables: { ...values },
      });
      setFormData({
        username: '',
        email: '',
        password: '',
      });

      console.log(data);
      navigate('/');
    } catch (err) {
      console.error(err);
      setApolloError('An error occurred during signup.');
    }
  };

  return (

<Row justify={"center"}>
  <Col>
  <ConfigProvider 
  theme={{
  }}>
    <Form
    id="signup-form"
    onFinish={handleSubmit}
    initialValues= {formData}
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
  >
    <Title     
    level={2}
    style={{
      textAlign: 'center'
    }}>
      Signup
    </Title>

    <Form.Item
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          
        },
      ]}
    >
      <Input
      type='text'
      name='username'
      value={formData.username}
      onChange={handleChange}
      placeholder='Username'
      />
    </Form.Item>

    <Form.Item
      label="Email"
      name="email"
      rules={[
        {
          required: true,
          
        },
      ]}
    >
      <Input 
      type='email'
      name= 'email'
      value= {formData.email}
      onChange={handleChange}
      placeholder='Email'
      />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          
        },
      ]}
    >
      <Input.Password
      name= 'password'
      value={formData.password}
      onChange={handleChange}
      placeholder='Password'
      />
    </Form.Item>

    <Form.Item
      name="remember"
      valuePropName="checked"
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" 
      htmlType="submit"
      loading= {loading}>
        Sign Up
      </Button>
    </Form.Item>


      {validationError && (
    <Form.Item>
    <Text type= "danger">{validationError}</Text>
    </Form.Item>
    )}

      {validationError && (
    <Form.Item>
    <Text type= "danger">{apolloError}</Text>
    </Form.Item>
    )}
    </Form>
    </ConfigProvider>
  </Col>
</Row>
)}

export default Signup;