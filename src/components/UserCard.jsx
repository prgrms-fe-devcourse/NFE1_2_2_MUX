import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../utils/api'; 

const UserCard = ({ user, navigate }) => {
  const { image, fullName, role, _id } = user;
  // 코멘트가 50자를 넘을 경우 자르고 '...'을 붙임

  let nickName = '...';
  let bio = '...';

  // fullName이 JSON 문자열로 저장되어 있으므로 파싱
  if (fullName) {
    try {
      const parsedFullName = JSON.parse(fullName);
      nickName = parsedFullName.nickName || nickName;
      bio = parsedFullName.bio || bio; // bio도 파싱
    } catch (error) {
      console.error('fullName 파싱 오류:', error);
    }
  }

  // bio가 50자를 넘으면 자르기
  const Introduce = bio.length > 50 ? bio.slice(0, 50) + '...' : bio;

  const handleCardClick = () => {
    navigate(`/user/${_id}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <ProfileImage src={image || ExampleImage} alt={nickName} /> {/* 프로필 이미지 */}
      <UserInfo>
        <UserName>{nickName}</UserName> {/* 유저 이름 */}
        <UserTitle>{role}</UserTitle> {/* 유저 역할 */}
        <UserBio>{Introduce}</UserBio> {/* 유저 자기소개 */}
      </UserInfo>
    </Card>
  );
};

const App = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(); // getUsers 호출
        setUsers(usersData); // 상태 업데이트
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers(); // 유저 데이터 가져오기
  }, []);

  return (
    <div>
      <h1>유저 카드 리스트</h1>
      <UserList>
        {users.map((user) => (
          <UserCard key={user._id} user={user} navigate={navigate} /> // navigate 전달
        ))}
      </UserList>
    </div>
  );
};

export default App;

// Styled Components
const Card = styled.div`
  display: flex;
  align-items: center;
  width: 420px;
  border-radius: 16px;
  padding: 8px;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 17px;
`;

const UserName = styled.h2`
  font-size: 1em;
  margin: 0;
  color: #333;
`;

const UserTitle = styled.p`
  margin: 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
  background: #ede4db;
  border-radius: 35px;
  font-size: 12px;
  color: #474150;
  white-space: nowrap; /* 긴 텍스트가 줄 바꿈되지 않도록 */
`;

const UserBio = styled.p`
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

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;