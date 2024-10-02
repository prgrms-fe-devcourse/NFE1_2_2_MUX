import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchPostsByAuthor } from '../utils/api';
import PostCard from '../components/PostCard';
import defaultProfileImage from '../assets/images/default-profile.png';

const ProfilePageWrapper = ({ user }) => {
  const { userId } = useParams(); // URL의 유저 ID 가져오기
  const isMyPage = userId === user._id; // 유저 ID가 로컬 유저 ID와 같으면 true

  return <ProfilePage user={user} isMyPage={isMyPage} />; // ProfilePage 컴포넌트에 user와 isMyPage를 전달
};

const ProfilePage = ({ user, isMyPage }) => {
  const [posts, setPosts] = useState([]); // 포스트 목록을 저장할 상태 변수
  const [error, setError] = useState(null); // 에러 처리 변수

  // 컴포넌트가 마운트될 때 유저의 포스트를 불러오는 useEffect
  useEffect(() => {
    const loadPosts = async () => {
      if (user) {
        try {
          const fetchedPosts = await fetchPostsByAuthor(user._id); // 모든 포스트를 받아옴
          setPosts(fetchedPosts); // 포스트 목록 상태에 저장
        } catch (err) {
          console.error('Failed to load posts:', err);
          setError('포스트를 불러오는 데 실패했습니다.');
        }
      }
    };
    
    loadPosts(); // 포스트 로드 함수 호출
  }, [user]); // user가 변경될 때마다 실행

  // user가 없을 경우 로딩 메시지 표시
  if (!user) {
    return <p>사용자 정보를 불러오는 중입니다...</p>; // 로딩 상태 표시
  }

  return (
    <Container>
      <Header>
        <ProfileImage src={user?.image || defaultProfileImage} alt="프로필" />
        <ProfileInfo>
          <h1>{isMyPage ? '내 프로필' : `${user.fullName.nickName}의 프로필`}</h1>
          <p>닉네임: {user.fullName.nickName}</p>
          <p>소개: {user.fullName.bio}</p>
        </ProfileInfo>
      </Header>
      
      <Content>
        <PostSection>
          <h2>추천 포스트</h2>
          {error && <p>{error}</p>} {/* 에러 메시지 표시 */}
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

        <MusicSection>
          <h2>음원 목록</h2>
          {/* 음원 목록을 여기에 추가 */}
        </MusicSection>
      </Content>
    </Container>
  );
};

export default ProfilePageWrapper; // ProfilePageWrapper를 내보냄

// Styled Components

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const ProfileInfo = styled.div`
  h1 {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.2rem;
    margin: 5px 0;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostSection = styled.div`
  flex: 1;
  margin-right: 20px;
`;

const MusicSection = styled.div`
  flex: 1;
`;