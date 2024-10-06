import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostsByAuthor, logout } from '../utils/api';
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CHANNEL_ID_A = '66fb541ced2d3c14a64eb9ee'; // 채널 ID A
  const CHANNEL_ID_B = '66fb53f9ed2d3c14a64eb9ea'; // 채널 ID B

  // 로컬 스토리지에 유저 정보 업데이트
  const handleUpdateUserDetails = useCallback((updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, []);

  // 모달 열기 및 닫기 핸들러
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 유저가 작성한 포스트 불러오기
  useEffect(() => {
    const loadUserPosts = async () => {
      if (user?._id) {
        try {
          console.log('Fetching posts for user:', user._id);
          const fetchedPosts = await fetchPostsByAuthor(user._id);
          console.log('Fetched posts:', fetchedPosts);
          setPosts(fetchedPosts);

          // 채널 ID에 따라 포스트 필터링
          const postsInChannelA = fetchedPosts.filter(
            (post) => post.channel._id === CHANNEL_ID_A,
          );
          const postsInChannelB = fetchedPosts.filter(
            (post) => post.channel._id === CHANNEL_ID_B,
          );

          setFilteredPosts(postsInChannelA);
          setFilteredMusicPosts(postsInChannelB);
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
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // 유저 정보 로딩 중 메시지 출력
  if (!user) {
    return <p>사용자 정보를 불러오는 중입니다...</p>;
  }

  // 유저의 fullName을 JSON 파싱
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
            {isMyPage && (
              <>
                <EditButton onClick={handleOpenModal}>
                  ✏️ 회원정보 수정
                </EditButton>
                <LogoutButton onClick={handleLogout} disabled={isLoggingOut}>
                  🚪 로그아웃
                </LogoutButton>
              </>
            )}
          </ProfileHeader>
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
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <p>추천 포스트가 없습니다.</p>
            )}
          </div>
        </PostSection>
        <Separator>
          <div></div>
        </Separator>
        <MusicSection>
          <h2>{userFullName.nickName || '이름 없음'}의 음원</h2>
          <div>
            {filteredMusicPosts.length > 0 ? (
              filteredMusicPosts.map((post) => (
                <HorizontalArtistCard key={post._id} post={post} />
              ))
            ) : (
              <p>음원이 없습니다.</p>
            )}
          </div>
        </MusicSection>
      </Content>
      {isModalOpen && (
        <ProfileEditModal
          user={user}
          token={localStorage.getItem('token')}
          onClose={handleCloseModal}
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
  margin-bottom: 20px; /* ProfileHeader와 Bio 사이의 기본 간격 */

  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-top: 10px;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const EditButton = styled.button`
  padding: 5px;
  background-color: transparent;
  color: #808080;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative; /* absolute에서 relative로 변경 */
  margin-left: 10px; /* 위치를 명확히 조정 */

  @media (max-width: 767px) {
    margin-left: 20px; /* 작은 화면에서 패딩 조정 */
  }
`;

const LogoutButton = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  color: #808080;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  position: relative; /* absolute에서 relative로 변경 */
  margin-left: 10px; /* 위치를 명확히 조정 */
  @media (max-width: 767px) {
    margin-left: 120px; /* 작은 화면에서 패딩 조정 */
    margin-top: -27px;
  }
`;

const Bio = styled.div`
  background-color: #ffffff;
  width: 300px;
  height: 80px;
  border-radius: 10px;
  margin-top: 15px; /* ProfileHeader와 일정한 간격 유지 */

  p {
    font-size: 0.9rem;
    padding: 10px;
    font-weight: 400;
    margin-top: 10px;
  }

  @media (max-width: 767px) {
    width: 110%;
    height: auto;
    margin-top: 15px;
    position: relative;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

const PostSection = styled.div`
  flex: 2;
  padding-right: 20px;
  position: relative;

  > h2 {
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  > div {
    display: flex; /* Flexbox로 설정 */
    flex-wrap: wrap; /* 아이템이 공간 부족 시 다음 줄로 감김 */
    justify-content: flex-start; /* 왼쪽 정렬 */
    gap: 10px; /* 카드 사이의 간격 */
    @media (max-width: 708px) {
      justify-content: center; /* 포스트들을 중앙으로 정렬 */
    }
  }

  @media (max-width: 1023px) {
    padding-right: 0; /* 오른쪽 패딩 제거 */
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
    display: flex; /* Flexbox로 설정 */
    flex-wrap: wrap; /* 아이템이 공간 부족 시 다음 줄로 감김 */
    justify-content: flex-start; /* 왼쪽 정렬 */
    gap: 10px; /* 카드 사이의 간격 */
    @media (max-width: 708px) {
      justify-content: center; /* 포스트들을 중앙으로 정렬 */
    }
  }

  @media (max-width: 1023px) {
    padding-left: 10px; /* 작은 화면에서 패딩 조정 */
  }

  @media (max-width: 767px) {
    padding-left: 0; /* 더 작은 화면에서 패딩 제거 */
    border-left: none; /* 더 작은 화면에서 경계 제거 */
  }
`;

const Separator = styled.div`
  width: 1px;
  background-color: #000000;
  height: auto;

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 구분선 숨김 */
  }
`;
