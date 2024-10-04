import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostsByAuthor, logout } from '../utils/api'; 
import PostCard from '../components/PostCard';
import ProfileEditModal from '../components/modals/ProfileEditModal';
import defaultProfileImage from '../assets/images/default-profile.png';

const ProfilePage = ({ user, isMyPage }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const updateUserDetails = useCallback((updatedUser) => {
    console.log('Updating user details:', updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const openModalHandler = () => setIsModalOpen(true);
  const closeModalHandler = () => setIsModalOpen(false);

  // 유저가 작성한 포스트를 불러옴
  useEffect(() => {
    const loadUserPosts = async () => {
      if (user?._id) {
        try {
          const fetchedPosts = await fetchPostsByAuthor(user._id);
          setPosts(fetchedPosts);
        } catch (err) {
          setError('포스트를 불러오는 데 실패했습니다.');
        }
      }
    };
    loadUserPosts();
  }, [user?._id]);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 유저 데이터가 없을 경우 로딩 메시지 출력
  if (!user) {
    return <p>사용자 정보를 불러오는 중입니다...</p>;
  }

  // 유저의 fullName을 JSON 파싱
  let userFullName = {};
  try {
    userFullName = typeof user.fullName === 'string' 
      ? JSON.parse(user.fullName)
      : user.fullName || {};
  } catch (err) {
    console.error('fullName 파싱 실패:', err);
  }

  return (
    <Container>
      <Header>
        <ProfileImage src={user?.image || defaultProfileImage} alt="프로필" />
        <ProfileInfo>
          <ProfileHeader>
            <h2>{userFullName.nickName || '이름 없음'}</h2>
            {isMyPage && (
              <>
                <EditButton onClick={openModalHandler}>✏️ 회원정보 수정</EditButton>
                <LogoutButton onClick={handleLogout} disabled={isLoggingOut}>🚪 로그아웃</LogoutButton>
              </>
            )}
          </ProfileHeader>
          <Role><div>{user.role || '역할 없음'}</div></Role>
          <Bio>
            <p>{userFullName.bio || '자기소개 없음'}</p>
          </Bio>
        </ProfileInfo>
      </Header>
      <Content>
        <PostSection>
          <h2>{userFullName.nickName || '이름 없음'}의 추천 포스트</h2>
          {error && <p>{error}</p>}
          <div>
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <p>포스트가 없습니다.</p>
            )}
          </div>
        </PostSection>
        <Separator><div></div></Separator>
        <MusicSection>
          <h2>{userFullName.nickName || '이름 없음'}의 음원</h2>
        </MusicSection>
      </Content>
      {isModalOpen && (
        <ProfileEditModal
          user={user}
          token={localStorage.getItem('token')}
          onClose={closeModalHandler}
          setUser={updateUserDetails}
        />
      )}
    </Container>
  );
};

export default ProfilePage;

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #dac8e6, #e2a1f5);
  color: #000000;
  border-radius: 10px;
`;

const ProfileImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  margin: 20px;
`;

const ProfileInfo = styled.div`
  align-items: center;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 3px 3px;
  }
  position: relative;
`;

const EditButton = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  color: #808080;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  position: absolute;
  left: 180px;
  top: 30px;
  &:hover {
    color: #a9a9a9;
  }
`;

const LogoutButton = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  color: #808080;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  position: absolute;
  left: 180px;
  top: 10px;
  &:hover {
    color: #a9a9a9;
  }
`;

const Role = styled.div`
  text-align: center;
  font-weight: 700;
  div {
    width: 120px;
    display: flex;
    background: #DBEDED;
    border-radius: 35px;
    font-size: 12px;
    color: #474150;
    justify-content: center;
    margin-top: 5px;
    padding: 2px;
    border: 0.7px solid black;
  }
`;

const Bio = styled.div`
  background-color: #ffffff;
  width: 300px;
  height: 80px;
  border-radius: 10px;
  p {
    font-size: 0.9rem;
    padding: 10px;
    font-weight: 400;
    margin-top: 10px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PostSection = styled.div`
  flex: 2;
  padding-right: 20px;
  position: relative;
  h2 {
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
`;

const MusicSection = styled.div`
  flex: 1;
  min-width: 250px;
  padding-left: 20px;
  h2 {
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  @media (max-width: 768px) {
    padding-left: 0;
    border-left: none;
  }
`;

const Separator = styled.div`
  width: 1px;
  background-color: #000000;
  height: auto;
  @media (max-width: 768px) {
    display: none;
  }
`;