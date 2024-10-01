import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Dashboard from './auth/Dashboard';
import styled from 'styled-components';
import Navigation from './components/main/Navigation';

const App = () => {
  return (
    <Router>
      <div>
      <Navigation />
      </div>
      <Container>

        <Nav>
          <NavLink to="/login">로그인</NavLink>
          <NavLink to="/signup">회원가입</NavLink>
          <NavLink to="/dashboard">대시보드</NavLink>
        </Nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-top: 50px;
  /* background-color: #f0f0f0; */

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Nav = styled.nav`
  margin-bottom: 20px;
  margin-top: 50px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const NavLink = styled(Link)`
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #bf94e4;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #d3d3d3;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;