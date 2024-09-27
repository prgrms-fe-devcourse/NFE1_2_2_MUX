import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Example from '../assets/images/DefaultProfile.png'; // 예시 이미지 경로
import axios from "axios"; // 나중에 사용하게 될 axios

// UserCard 컴포넌트
const UserCard = ({ user }) => {
  const { image, fullName, role, comment } = user;


  return (
    <Card>
      <ProfileImage src={image || Example} alt={fullName} /> {/* 프로필 이미지 */}
      <UserInfo>
        <UserName>{fullName}</UserName> {/* 유저 이름 */}
        <UserTitle>{role}</UserTitle> {/* 유저 역할 */}
        <UserComment>{comment}</UserComment> {/* 유저 자기소개 */}
      </UserInfo>
    </Card>
  );
};

// 테스트를 위한 App 컴포넌트
const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    
    // 임시 더미 데이터
    const dummyUsers = [
      {
        image: "", // 프로필 이미지 URL
        fullName: "커트코베인", // 이름
        role: "RockStar", // 칭호(역할)
        comment: "아무튼 나락도 락이니까..." // 자기소개
      }
    ];
    
    setUsers(dummyUsers); // 더미 데이터로 상태 설정
  }, []);

  return (
    <div>
      <h1>유저 카드 리스트</h1>
      <UserList>
        {users.map((user, index) => (
          <UserCard key={index} user={user} />
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
  width: 400px;
  border-radius: 8px;
  padding: 8px;
`;

const ProfileImage = styled.img`
  width: 65px;
  object-fit: cover;
  margin-right: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserName = styled.h2`
  font-size: 1em;
  margin: 0;
  color: #333;
`;

const UserTitle = styled.p`
  display: flex;
  font-size: 12px;
  color: #474150;
`;

const UserComment = styled.p`
  margin: 5px 0;
  font-size: 13px;
  color: #111010;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;