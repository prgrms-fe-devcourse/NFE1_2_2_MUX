import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../utils/api'; 

// 유저 프로필 카드 컴포넌트
const UserProfileCard = ({ user, onNavigate }) => {
  const { image, fullName, _id } = user;
  let nickName = '닉네임이 없습니다.';

  // fullName이 JSON 형식인지 체크한 후 파싱 시도
  if (fullName) {
    if (fullName.startsWith('{') && fullName.endsWith('}')) {
      try {
        const parsedFullName = JSON.parse(fullName);
        nickName = parsedFullName.nickName || nickName;
      } catch (error) {
        console.error('fullName 파싱 오류:', error);
      }
    } else {
      // fullName이 JSON이 아닌 경우 그대로 사용
      nickName = fullName;
    }
  }

  const handleCardClick = () => {
    onNavigate(`/user/${_id}`);
  };

  return (
    <Card>
      <ClickableContent onClick={handleCardClick}>
        <ProfileImage src={image || ExampleImage} alt={nickName} />
        <UserInfo>
          <UserName>{nickName}</UserName>
        </UserInfo>
      </ClickableContent>
    </Card>
  );
};

// 유저 리스트 컴포넌트
const App = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UserList>
      {users.map((user) => (
        <UserProfileCard key={user._id} user={user} onNavigate={navigate} />
      ))}
    </UserList>
  );
};

export default App;

// Styled Components
const UserList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  width: 180px;
  height: 230px;
  flex-direction: column;
`;

const ClickableContent = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  transition: transform 0.3s ease;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserName = styled.h2`
  font-size: 15px;
  font-weight: 550;
  margin-top: 20px;
  text-align: center;
  transition: transform 0.3s ease;
`;