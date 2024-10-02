import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getUserData, fetchPostsByAuthor } from '../utils/api';
import PostCard from '../components/PostCard';
import defaultProfileImage from '../assets/images/default-profile.png';
import ProfileEditModal from '../components/modals/ProfileEditModal';

const ProfilePageWrapper = ({ user, token }) => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const isMyPage = user && userId === user._id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isMyPage) {
        try {
          const data = await getUserData(userId, token);
          setUserData(data);
        } catch (err) {
          console.error('유저 정보 불러오기 실패:', err);
          setError('유저 정보를 불러오는 데 실패했습니다.');
        }
      }
    };

    if (!isMyPage) {
      fetchUserData();
    } else {
      setUserData(user); // 마이페이지인 경우 userData를 user로 설정
    }
  }, [userId, isMyPage, token, user]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!userData) {
    return <p>유저 정보를 불러오는 중...</p>;
  }

  return <ProfilePage user={userData} isMyPage={isMyPage} />;
};

const ProfilePage = ({ user, isMyPage }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false); // 모달 상태 관리


  useEffect(() => {
    const loadPosts = async () => {
      if (user) {
        try {
          const fetchedPosts = await fetchPostsByAuthor(user._id);
          setPosts(fetchedPosts);
        } catch (err) {
          console.error('포스트를 불러오는 데 실패했습니다:', err);
          setError('포스트를 불러오는 데 실패했습니다.');
        }
      }
    };

    loadPosts();
  }, [user]);

  if (!user) {
    return <p>사용자 정보를 불러오는 중입니다...</p>;
  }

  // fullName이 문자열인지 확인하고 JSON.parse 실행
  const userFullName = typeof user.fullName === 'string' 
    ? JSON.parse(user.fullName) 
    : user.fullName || {};

  return (
    <Container>
      <Header>
        <ProfileImage src={user?.image || defaultProfileImage} alt="프로필" />
        <ProfileInfo>
          <ProfileHeader>
          <h2>{userFullName.nickName || '이름 없음'}</h2>
                          {/* 마이페이지일 때만 수정 버튼 노출 */}
                    {isMyPage && (
            <EditButton onClick={() => setEditModalOpen(true)}>✏️ 회원정보 수정</EditButton>
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

      {/* 모달 창: isEditModalOpen이 true일 때만 보임 */}
      {isEditModalOpen && (
        <ProfileEditModal 
          user={user} 
          closeModal={() => setEditModalOpen(false)} // 모달 닫기 함수 전달
        />
      )}
    </Container>
  );
};

export default ProfilePageWrapper;

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
  align-items: center;
  display: flex;
  justify-content: space-between;

  h2 {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 3px 3px;
  }

  /* 닉네임과 회원정보 수정 버튼이 함께 정렬되도록 */
  position: relative;
`;

// 회원정보 수정 버튼 스타일
const EditButton = styled.button`
  padding: 5px 10px;
  background-color: transparent; /* 배경색 투명 */
  color: #808080; /* 글씨색 회색 */
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
  position: absolute; /* 닉네임에서 떨어지도록 위치 조정 */
  left: 180px;
  top: 30px;

  &:hover {
    color: #a9a9a9; /* hover 시 조금 더 밝은 회색 */
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