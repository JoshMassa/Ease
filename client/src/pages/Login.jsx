import React, { useContext, useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from 'react-router-dom';
// import FormInput from "../components/FormInput";
import "../styles/Login.css";
import { Form, Input, Button, Typography, Row, Col, ConfigProvider } from "antd";
import AuthService from "../utils/auth";
import { LOGIN } from "../utils/mutations";
import AuthContext from "../context/AuthContext";

const { Title } = Typography;

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

  const handleSubmit = async (values) => {
    try {
      const { data } = await login({
        variables: { ...values },
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
   <Row justify={"center"}>
    <Col>
     <ConfigProvider
     theme={{

     }}>
      <Form
      id="login-form"
      onFinish={handleSubmit}
      initialValues={formData}
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
      Log in
    </Title>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email' }]}
        >
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
         wrapperCol={{
          offset: 8,
          span: 16,
        }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}>
            Login
          </Button>
        </Form.Item>
      
      </Form>
     </ConfigProvider>
    </Col>
   </Row>
  );
};

export default Login;
