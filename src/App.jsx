import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Dashboard from './auth/Dashboard';
import styled from 'styled-components';
import Navigation from './components/main/Navigation';
import PostFeed from './pages/PostFeed/PostFeed';
import ProfilePage from '../src/profile/ProfilePage.jsx';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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
          <NavLink to="/postfeed">포스트 피드</NavLink>
        </Nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/postfeed" element={<PostFeed />} />
          {/* 유저 페이지/마이페이지 */}
          {user && (
            <>
              {/* 유저 카드를 클릭해서 이동할 때 /user/:userId 경로 */}
              <Route path="/user/:userId" element={<ProfilePageWrapper user={user} />} />
            </>
          )}
        </Routes>
      </Container>
    </Router>
  );
};

// ProfilePageWrapper: userId를 URL에서 가져와 해당 유저의 프로필 페이지로 이동
const ProfilePageWrapper = ({ user }) => {
  const { userId } = useParams(); // URL에서 유저 ID 가져오기

  // 여기서 실제로 해당 userId에 맞는 유저 정보를 가져옵니다.
  // 예시로, `fetchUserData`는 서버에서 유저 데이터를 가져오는 함수입니다.
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 예시: 해당 userId로 API 호출하여 유저 데이터 가져오기
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('유저 데이터 불러오기 실패:', error);
      }
    };

    fetchUserData(); // 유저 데이터 로드
  }, [userId]); // userId가 변경될 때마다 호출

  if (!userData) {
    return <p>유저 정보를 불러오는 중...</p>; // 로딩 상태 처리
  }

  return <ProfilePage user={userData} />;
};

export default App;

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

const NavLink = styled(Link)`
  padding: 10px 20px;
  color: #333;
  text-decoration: none;

  &:hover {
    background-color: #eee;
  }
`;
