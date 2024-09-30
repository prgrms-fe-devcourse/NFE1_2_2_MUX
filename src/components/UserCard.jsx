import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../utils/api'; 

const UserCard = ({ user, onNavigate }) => {
  const { image, fullName, role, _id } = user;

  let nickName = '...';
  let bio = '...';

  // fullName이 JSON 문자열로 저장되어 있으므로 파싱
  if (fullName) {
    try {
      const parsedFullName = JSON.parse(fullName);
      nickName = parsedFullName.nickName || nickName;
      bio = parsedFullName.bio || bio;
    } catch (error) {
      console.error('fullName 파싱 오류:', error);
    }
  }

  // bio가 50자를 넘으면 자르기
  const truncatedBio = bio.length > 50 ? bio.slice(0, 50) + '...' : bio;

  const handleCardClick = () => {
    onNavigate(`/userpage/${_id}`);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <StyledProfileImage src={image || ExampleImage} alt={nickName} /> {/* 프로필 이미지 */}
      <StyledUserInfo>
        <StyledUserName>{nickName}</StyledUserName> {/* 유저 이름 */}
        <StyledUserRole>{role}</StyledUserRole> {/* 유저 역할 */}
        <StyledUserBio>{truncatedBio}</StyledUserBio> {/* 유저 자기소개 */}
      </StyledUserInfo>
    </StyledCard>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // useNavigate 훅

  // API 호출을 통해 유저 데이터 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(); // getUsers 호출
        setUsers(usersData); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>유저 카드 리스트</h1>
      <StyledUserList>
        {users.map((user) => (
          <UserCard key={user._id} user={user} onNavigate={navigate} />
        ))}
      </StyledUserList>
    </div>
  );
};

export default App;

// Styled Components
const StyledCard = styled.div`
  display: flex;
  align-items: center;
  width: 420px;
  border-radius: 16px;
  padding: 8px;

  &:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const StyledProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 17px;
`;

const StyledUserName = styled.h2`
  font-size: 1em;
  margin: 0;
  color: #333;
`;

const StyledUserRole = styled.p`
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
  background: #ede4db;
  border-radius: 35px;
  font-size: 12px;
  color: #474150;
  white-space: nowrap;
`;

const StyledUserBio = styled.p`
  margin: 5px 0;
  text-align: left;
  padding: 13px;
  width: 280px;
  height: 25px;
  background: #bf94e4;
  border-radius: 5px;
  font-size: 13px;
  color: white;
`;

const StyledUserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;