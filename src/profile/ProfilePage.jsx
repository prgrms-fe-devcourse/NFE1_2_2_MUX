import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostsByAuthor, logout, deletePost } from '../utils/api';
import PostCard from '../components/PostCard';
import ProfileEditModal from '../components/modals/ProfileEditModal';
import defaultProfileImage from '../assets/images/default-profile.png';
import HorizontalArtistCard from '../components/HorizontalArtistCard';

const ProfilePage = ({ user, isMyPage }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filteredMusicPosts, setFilteredMusicPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  const CHANNEL_ID_A = '66fb541ced2d3c14a64eb9ee';
  const CHANNEL_ID_B = '66fb53f9ed2d3c14a64eb9ea';

  const handleUpdateUserDetails = useCallback((updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  const handleOpenProfileEditModal = () => setIsProfileEditModalOpen(true);
  const handleCloseProfileEditModal = () => setIsProfileEditModalOpen(false);

  useEffect(() => {
    const loadUserPosts = async () => {
      if (user?._id) {
        try {
          console.log('Fetching posts for user:', user._id);
          const fetchedPosts = await fetchPostsByAuthor(user._id);
          console.log('Fetched posts:', fetchedPosts);
          setPosts(fetchedPosts);

          const postsInChannelA = fetchedPosts.filter(
            (post) => post.channel._id === CHANNEL_ID_A,
          );
          const postsInChannelB = fetchedPosts.filter(
            (post) => post.channel._id === CHANNEL_ID_B,
          );

          setFilteredPosts(postsInChannelA);
          setFilteredMusicPosts(postsInChannelB);
        } catch (err) {
          setError('포스트를 불러오는데 실패했습니다.');
        }
      }
    };
    loadUserPosts();
  }, [user?._id]);

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await deletePost(postId, token);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      setFilteredPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId),
      );
      setFilteredMusicPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId),
      );
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 중 오류 발생:', error);
      alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLikeUpdate = (postId, isLiked, newLikeCount) => {
    const updatePosts = (prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, likes: { length: newLikeCount } }
          : post,
      );

    setPosts(updatePosts);
    setFilteredPosts(updatePosts);
    setFilteredMusicPosts(updatePosts);
  };

  if (!user) {
    return <p>사용자 정보를 불러오는 중입니다...</p>;
  }

  let userFullName = {};
  try {
    userFullName =
      typeof user.fullName === 'string'
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
          </ProfileHeader>
          <Bio>
            <p>{userFullName.bio || '자기소개 없음'}</p>
          </Bio>
          {isMyPage && (
            <>
              <EditButton onClick={handleOpenProfileEditModal}>
                ✏️ 회원정보 수정
              </EditButton>
              <LogoutButton onClick={handleLogout} disabled={isLoggingOut}>
                🚪 로그아웃
              </LogoutButton>
            </>
          )}
        </ProfileInfo>
      </Header>
      <Content>
        <PostSection>
          <h2>{userFullName.nickName || '이름 없음'}의 추천 포스트</h2>
          {error && <p>{error}</p>}
          <PostsContainer>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCardWrapper key={post._id}>
                  <PostCard
                    post={post}
                    onLikeUpdate={handleLikeUpdate}
                    onPostDelete={handlePostDelete}
                  />
                </PostCardWrapper>
              ))
            ) : (
              <p>추천 포스트가 없습니다.</p>
            )}
          </PostsContainer>
        </PostSection>
        <Separator>
          <div></div>
        </Separator>
        <MusicSection>
          <h2>{userFullName.nickName || '이름 없음'}의 음원</h2>
          <div>
            {filteredMusicPosts.length > 0 ? (
              filteredMusicPosts.map((post) => (
                <HorizontalArtistCard
                  key={post._id}
                  post={post}
                  onPostDelete={handlePostDelete}
                  onLikeUpdate={handleLikeUpdate}
                  isAuthor={user._id === post.author._id}
                  currentUser={user}
                />
              ))
            ) : (
              <p>음원이 없습니다.</p>
            )}
          </div>
        </MusicSection>
      </Content>
      {isProfileEditModalOpen && (
        <ProfileEditModal
          user={user}
          token={localStorage.getItem('token')}
          onClose={handleCloseProfileEditModal}
          setUser={handleUpdateUserDetails}
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
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #dac8e6, #e2a1f5);
  color: #000000;
  border-radius: 10px;

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    height: auto;
  }
`;

const ProfileImage = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  margin: 20px;

  @media (max-width: 767px) {
    margin: 10px;
    width: 180px;
    height: 180px;
    margin-bottom: 0;
    margin-top: 20px;
  }
`;

const ProfileInfo = styled.div`
  align-items: center;

  @media (max-width: 767px) {
    text-align: center;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-top: 20px;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: center;
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
    margin-top: -5px;
  }

  @media (max-width: 767px) {
    width: 110%;
    min-height: 60px;
    height: auto;
    position: relative;
    text-align: left;
    margin-right: 20px;
    margin-top: -10px;
  }
`;

const EditButton = styled.button`
  padding: 5px;
  background-color: transparent;
  color: #808080;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  margin-top: 5px;
  margin-left: 35px;

  &:hover {
    color: #141314;
  }

  @media (max-width: 767px) {
    margin-left: 20px;
    margin-top: 5px;
  }
`;

const LogoutButton = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  color: #808080;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative;
  margin-left: 40px;

  &:hover {
    color: #141314;
  }

  @media (max-width: 767px) {
    margin-left: 10px;
    margin-top: 5px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

const PostSection = styled.div`
  flex: 2;
  padding-right: 20px;
  position: static;

  > h2 {
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: 1023px) {
    padding-right: 0;
  }
`;

const MusicSection = styled.div`
  flex: 1;
  min-width: 250px;
  padding-left: 20px;
  > h2 {
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  > div {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 17px;
    padding-bottom: 10px;
    padding-left: 4px;
    width: 450px;
    height: 420px;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (max-width: 1228px) {
      justify-content: center;
    }
  }

  @media (max-width: 1023px) {
    padding-left: 10px;
  }

  @media (max-width: 767px) {
    padding-left: 0;
    border-left: none;
  }
`;

const Separator = styled.div`
  width: 1px;
  background-color: #000000;
  height: 520px;

  @media (max-width: 1023px) {
    display: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const PostsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 30px;
  padding-bottom: 10px;
  width: 700px;
  height: 430px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 708px) {
    justify-content: center;
    width: 100%;
  }
`;

const PostCardWrapper = styled.div`
  flex-shrink: 0;
  width: 280px;
  height: 420px;
  position: relative;
`;
