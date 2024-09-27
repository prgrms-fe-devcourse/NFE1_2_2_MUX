import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileEditModal from '../components/modals/ProfileEditModal';
import PostCard from '../components/PostCard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (!userData) {
      navigate('/login'); // 사용자 정보가 없으면 로그인 페이지로 이동
      return;
    }

    // user 데이터를 파싱
    const parsedUser = JSON.parse(userData);

    // fullName 필드가 JSON 형태라면 다시 파싱
    if (typeof parsedUser.fullName === 'string') {
      try {
        parsedUser.fullName = JSON.parse(parsedUser.fullName);
      } catch (error) {
        console.error("fullName 파싱 오류:", error);
      }
    }

    setUser(parsedUser); // user 정보를 상태에 저장
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  // 닉네임 업데이트 함수
  const updateUserNickname = (newNickname) => {
    if (user) {
      const updatedUser = {
        ...user,
        fullName: { ...user.fullName, nickName: newNickname },
      };

      // 상태 업데이트 및 localStorage에 저장
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // 자기소개 업데이트 함수
  const updateUserBio = (newBio) => {
    if (user) {
      const updatedUser = {
        ...user,
        bio: newBio, // bio 업데이트
      };

      // 상태 업데이트 및 localStorage에 저장
      setUser(updatedUser);  // 상태 업데이트
      localStorage.setItem('user', JSON.stringify(updatedUser));  // localStorage에 저장
    }
  };

  // 모달 열기/닫기 핸들러
  const openModalHandler = () => {
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    setIsModalOpen(false);
  };

  return (
    <DashboardContainer>
      <h2>Welcome, {user.fullName.fullName}!</h2>
      <UserInfo>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Full Name:</strong> {user.fullName.fullName}</p>
        <p><strong>NickName:</strong> {user.fullName.nickName}</p>
        <p><strong>Bio:</strong> {user.bio}</p> {/* 여기서 업데이트된 bio가 반영됩니다 */}
      </UserInfo>
      <PostCard />
      <EditProfileButton onClick={openModalHandler}>회원 정보 수정</EditProfileButton>

      {isModalOpen && (
        <ProfileEditModal
          user={user}
          token={localStorage.getItem('token')}
          onClose={closeModalHandler}
          onNicknameUpdate={updateUserNickname}
          onBioUpdate={updateUserBio}  // onBioUpdate 전달
        />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;

// Styled Components
const DashboardContainer = styled.div`
  padding: 40px;
  text-align: center;
  background-color: #f5f5f5;
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

  p {
    margin: 10px 0;
    font-size: 16px;
  }

  strong {
    color: #333;
  }
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


