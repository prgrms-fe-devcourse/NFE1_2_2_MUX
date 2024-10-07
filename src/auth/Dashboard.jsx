import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileEditModal from '../components/modals/ProfileEditModal';
import { getPosts, getUserData } from '../utils/api';
import UserCard from '../components/UserCard';
import CurationCard from '../components/CurationCard';
import ReactionCount from '../components/ReactionCount'; // 리액션 카운트 컴포넌트
import ArtistCard from '../components/ArtistCard';
import HorizontalArtistCard from '../components/HorizontalArtistCard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response); // API 응답 구조에 따라 response.data 대신 response를 사용할 수 있습니다.
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Failed to load posts. Please try again later.');
      }
    };

    fetchPosts();
  }, []);

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

  const handleLikeUpdate = (postId, isLiked, newLikeCount) => {
    // 여기에 좋아요 업데이트 로직을 구현합니다
    console.log('Like updated:', postId, isLiked, newLikeCount);
  };

  const handleTrackDelete = async (postId) => {
    // 여기에 트랙 삭제 로직을 구현합니다
    console.log('Track deleted:', postId);
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
      <UserCard user={user} />
      <ReactionCount />
      {isModalOpen && (
        <ProfileEditModal
          user={user}
          token={localStorage.getItem('token')}
          onClose={closeModalHandler}
          setUser={updateUserDetails}
        />
      )}
      <CurationCard />
      <ArtistCard />
      {posts.map((post) => (
        <HorizontalArtistCard
          key={post._id}
          post={post}
          onLikeUpdate={handleLikeUpdate}
          onTrackDelete={handleTrackDelete}
        />
      ))}
    </DashboardContainer>
  );
};

export default Dashboard;

// Styled components (변경 없음)
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
