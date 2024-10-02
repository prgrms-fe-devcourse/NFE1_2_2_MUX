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
        <h2>{user.fullName.nickName}</h2>
        <Role><div>{user.role}</div></Role>
        <Bio>
          <p>{user.fullName.bio}</p>
        </Bio>
      </ProfileInfo>
    </Header>

    <Content>
      <PostSection>
        <h2>{user.fullName.nickName}의 추천 포스트</h2>
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
      <Separator><div></div></Separator>
      <MusicSection>
        <h2>{user.fullName.nickName}의 음원</h2>
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
  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 3px 3px;
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
  padding-right: 20px; /* 선과 포스트 사이 간격 */
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
  padding-left: 20px; /* 선과 음원 텍스트 사이 간격 추가 */

  h2 {
    font-size: 20px;
    font-weight: 400;
    border-bottom: 1px solid #000000;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  @media (max-width: 768px) {
    padding-left: 0; /* 화면이 줄어들 때 간격 제거 */
    border-left: none; /* 화면이 작아질 때 선 제거 */
  }
`;

const Separator = styled.div`
  width: 1px;
  background-color: #000000; /* 선 색상 */
  height: auto; /* 부모 높이에 맞추기 */
  
  @media (max-width: 768px) {
    display: none; /* 작은 화면에서는 선 숨기기 */
  }
`;