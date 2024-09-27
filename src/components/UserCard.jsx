import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Example from '../assets/images/DefaultProfile.png'; // 예시 이미지 경로
import axios from "axios"; // 나중에 사용하게 될 axios

// UserCard 컴포넌트
const UserCard = ({ user }) => {
  const { image, fullName, role, comment } = user;
    // 코멘트가 50자를 넘을 경우 자르고 '...'을 붙임
    const truncatedComment = comment.length > 50 ? comment.slice(0, 50) + '...' : comment;


  return (
    <Card>
      <ProfileImage src={image || Example} alt={fullName} /> {/* 프로필 이미지 */}
      <UserInfo>
        <UserName>{fullName}</UserName> {/* 유저 이름 */}
        <UserTitle>{role}</UserTitle> {/* 유저 역할 */}
        <UserComment>{truncatedComment}</UserComment> {/* 유저 자기소개 */}
      </UserInfo>
    </Card>
  );
};

// 테스트를 위한 App 컴포넌트
const App = () => {
  const [users, setUsers] = useState([]);

  // 더미 데이터 설정
  useEffect(() => {
    // 나중에 이 부분을 API 호출로 대체
    /* 
    axios.get("/api/users")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
    */
    
    // 임시 더미 데이터
    const dummyUsers = [
      {
        image: "", // 프로필 이미지 URL
        fullName: "커트코베인", // 이름
        role: "RockStar", // 칭호(역할)
        comment: "아무튼 나락도 락이니까..." // 자기소개
      },
      {
        image: "", // 프로필 이미지 URL
        fullName: "아라이카즈키", // 이름
        role: "JazzMaster", // 칭호(역할)
        comment: "재즈베이스 마스터? 어렵지 않습니다.재즈베이스 마스터? 어렵지 않습니다.재즈베이스 마스터? 어렵지 않습니다.재즈베이스 마스터? 어렵지 않습니다.재즈베이스 마스터? 어렵지 않습니다." // 자기소개
      },
      {
        image: "", // 프로필 이미지 URL
        fullName: "모차르트", // 이름
        role: "Maestro", // 칭호(역할)
        comment: "제 신곡 많이 들어주세요. " // 자기소개
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
  height: 65px; /* 크기를 지정해 균일하게 표시 */
  padding: 5px;
  border-radius: 50%; /* 프로필 이미지를 완전한 원으로 만듦 */
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

const UserComment = styled.p`
  margin: 5px 0;
  text-align: left;
  padding: 13px;
  width: 300px;
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