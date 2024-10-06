import React, { useState } from 'react';
import { login } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await login(email, password); // API 호출
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      console.log('로그인 성공:', user);
      console.log('로그인 성공:', token);
      navigate('/mainpage');
    } catch (error) {
      console.error('로그인 실패:', error);
    }
  };

  return (
    <LoginContainer>
      <Form onSubmit={handleLogin}>
        <Title>로그인</Title>
        <Label>이메일</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">로그인</Button>
      </Form>
    </LoginContainer>
  );
};

export default Login;

// 스타일드 컴포넌트
const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333333;
`;

const Label = styled.p`
  margin-bottom: 3px;
  color: #333333;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px;
  width: 300px;
  margin-bottom: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333333;

  &:focus {
    border-color: #bf94e4;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #bf94e4;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
  font-weight: bold;

  &:hover {
    background-color: #d3d3d3;
  }
`;
