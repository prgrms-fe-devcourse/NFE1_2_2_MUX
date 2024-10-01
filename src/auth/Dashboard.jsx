import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileEditModal from '../components/modals/ProfileEditModal'; // 프로필 수정 모달 컴포넌트
import PostCard from '../components/PostCard'; // 게시물 카드 컴포넌트
import { getUserData } from '../utils/api'; // 사용자 데이터 가져오는 API 함수
import UserCard from '../components/UserCard'; // 사용자 카드 컴포넌트
import UserProfile from '../components/UserProfile'; // 사용자 프로필 컴포넌트
import PostDetailModal from '../components/modals/PostDetailModal';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = useCallback(async () => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user data from localStorage:', parsedUser);

      const userId = parsedUser.id || parsedUser._id;
      if (!userId) {
        throw new Error('User ID is missing');
      }

      const freshUserData = await getUserData(userId, token);
      console.log('Fresh user data from server:', freshUserData);

      const updatedUser = {
        ...parsedUser,
        ...freshUserData,
        id: userId,
        fullName:
          typeof freshUserData.fullName === 'string'
            ? JSON.parse(freshUserData.fullName)
            : freshUserData.fullName,
        profileImage: freshUserData.image || parsedUser.profileImage,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data. Please try logging in again.');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const updateUserDetails = useCallback((updatedUser) => {
    console.log('Updating user details:', updatedUser);
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const openModalHandler = () => setIsModalOpen(true);
  const closeModalHandler = () => setIsModalOpen(false);

  // 테스트용 포스트 데이터
  const testPost = {
    userImage: 'https://example.com/user-image.jpg',
    username: 'TestUser',
    title: 'Test Post Title',
    albums: [
      {
        coverImage: 'https://example.com/album1.jpg',
        title: 'Album 1',
        artist: 'Artist 1',
      },
      {
        coverImage: 'https://example.com/album2.jpg',
        title: 'Album 2',
        artist: 'Artist 2',
      },
    ],
    content: 'This is a test post content.',
    likes: 10,
    comments: [
      { username: 'Commenter1', content: 'Great post!' },
      { username: 'Commenter2', content: 'Nice music selection!' },
    ],
  };

  if (isLoading) return <LoadingMessage>Loading...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!user)
    return (
      <ErrorMessage>User data not available. Please log in again.</ErrorMessage>
    );

  return (
    <DashboardContainer>
      <h2>Welcome, {user.fullName?.fullName || user.email}!</h2>
      <UserInfo>
        {user.profileImage && (
          <ProfileImage
            src={user.profileImage}
            alt="프로필 이미지"
            onError={(e) => {
              console.error('Error loading image:', e);
              e.target.src = '/path/to/default-image.png';
            }}
          />
        )}
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Full Name:</strong>{' '}
          {user.fullName?.fullName || 'No name provided'}
        </p>
        <p>
          <strong>NickName:</strong>{' '}
          {user.fullName?.nickName || 'No nickname provided'}
        </p>
        <p>
          <strong>Bio:</strong> {user.fullName?.bio || 'No bio provided'}
        </p>
      </UserInfo>
      <EditProfileButton onClick={openModalHandler}>
        회원 정보 수정
      </EditProfileButton>
      <PostCard />
      <UserCard />
      <UserProfile />

      {/* PostDetailModal 테스트를 위한 버튼 */}
      <button onClick={() => setIsPostModalOpen(true)}>
        Open Post Detail Modal
      </button>

      {isModalOpen && (
        <ProfileEditModal
          user={user}
          token={localStorage.getItem('token')}
          onClose={closeModalHandler}
          setUser={updateUserDetails}
        />
      )}

      {isPostModalOpen && (
        <PostDetailModal
          post={testPost}
          isOwnPost={true}
          onClose={() => setIsPostModalOpen(false)}
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;

// Styled components
const DashboardContainer = styled.div`
  padding: 40px;
  text-align: center;
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
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const EditProfileButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #6c5dd3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5a4bbd;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
`;

const ErrorMessage = styled.p`
  color: red;
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
`;
