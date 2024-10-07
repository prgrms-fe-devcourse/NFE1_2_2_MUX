import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom';
import Signup from './auth/Signup';
import Login from './auth/Login';
import Dashboard from './auth/Dashboard';
import styled from 'styled-components';
import Navigation from './components/main/Navigation';
import PostFeed from './pages/PostFeed/PostFeed';
import ProfilePage from '../src/profile/ProfilePage.jsx';
import MainPage from './pages/Main/MainPage';
import CurationArt from './pages/Curation-Artist/CurationArt.jsx';
import MusicPlayer from './components/main/MusicPlayer.jsx';
import LandingPage from './pages/LandingPage/LandingPage.jsx';

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
      <Container>
        <AppRoutes user={user} />
      </Container>
    </Router>
  );
};

const AppRoutes = ({ user }) => {
  const location = useLocation(); // Router 내부에서 경로 가져오기

  // 특정 경로에서는 네비게이션바 숨기기
  const hideNavOnPaths = ['/', '/login', '/signup'];
  const shouldShowNav = !hideNavOnPaths.includes(location.pathname);
  const shouldShowMusicPlayer = !hideNavOnPaths.includes(location.pathname);
  
  const [currentTrack, setCurrentTrack] = useState(null);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
  };

  return (
    <>
      {/* 기본 경로로 LandingPage 설정 */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/* 네비게이션바 조건부 렌더링 */}
      {shouldShowNav && <Navigation />}

      <Routes>
        <Route path="mainpage/" element={<MainPage />} />
        <Route
          path="/postfeed"
          element={<PostFeed onPlayTrack={handlePlayTrack} />}
        />
        <Route
          path="/curationart"
          element={<CurationArt onPlayTrack={handlePlayTrack} />}
        />
        <Route
          path="/user/:userId"
          element={<ProfilePageWrapper user={user} />}
        />
      </Routes>
      
      {/* MusicPlayer에 현재 트랙 전달 */}
      {shouldShowMusicPlayer && <MusicPlayer currentTrack={currentTrack} />}
    </>
  );
};

const ProfilePageWrapper = ({ user }) => {
  const { userId } = useParams(); // URL에서 유저 ID 가져오기

  const [userData, setUserData] = useState(null);
  const isMyPage = userId === user?._id; // 로컬 유저 ID와 비교

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

    if (!isMyPage && userId) {
      // 마이페이지가 아니라면, 유저 데이터를 불러옵니다.
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
  padding: 20px;
`;
