import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      navigate('/login'); // 사용자 정보가 없으면 로그인 페이지로 이동
      return;
    }

    // user 데이터를 파싱
    const parsedUser = JSON.parse(userData);

    // fullName 필드가 JSON 형태라면 다시 파싱
    if (typeof parsedUser.fullName === 'string') {
      try {
        parsedUser.fullName = JSON.parse(parsedUser.fullName);
      } catch (error) {
        console.error("fullName 파싱 오류:", error);
      }
    }

    setUser(parsedUser); // user 정보를 상태에 저장
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  
  return (
    <DashboardContainer>
      <h2>Welcome, {user.fullName.fullName}!</h2>
      <UserInfo>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Full Name:</strong> {user.fullName.fullName}</p>
        <p><strong>NickName:</strong> {user.fullName.nickName}</p>
      </UserInfo>
      <PostCard />
      <UserCard />
    </DashboardContainer>
  );
};

export default Dashboard;

// Styled Components
const DashboardContainer = styled.div`
  padding: 40px;
  text-align: center;
  /* background-color: #f5f5f5; */
  min-height: 100vh;
  color: #333333;
  
`;

const UserInfo = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  color: #333333;

  p {
    margin: 10px 0;
    font-size: 16px;
  }

  strong {
    color: #333;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #333;
  margin-top: 20px;
`;