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

const ProfilePageWrapper = ({ user }) => {
  const { userId } = useParams(); // URL에서 유저 ID 가져오기

  const [userData, setUserData] = useState(null);
  const isMyPage = userId === user._id; // 로컬 유저 ID와 비교

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('유저 데이터 불러오기 실패:', error);
      }
    };

    if (!isMyPage) {  // 마이페이지가 아니라면, 유저 데이터를 불러옵니다.
      fetchUserData();
    }
  }, [userId, isMyPage]);

  if (!userData && !isMyPage) {
    return <p>유저 정보를 불러오는 중...</p>;
  }

  return <ProfilePage user={isMyPage ? user : userData} isMyPage={isMyPage} />;
};

export default App;

// Styled Components
const Container = styled.div`
/* min-width: 700px; */
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
