import React from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';

const UserCard = ({ user, navigate }) => {
  const { image, fullName, role, _id } = user;

  let nickName = '닉네임이 없습니다.';
  let bio = '소개글이 없습니다.';

  // fullName이 JSON 형식인지 체크한 후 파싱 시도
  if (fullName) {
    if (fullName.startsWith('{') && fullName.endsWith('}')) {
      try {
        const parsedFullName = JSON.parse(fullName);
        nickName = parsedFullName.nickName || nickName; // 닉네임 설정
        bio = parsedFullName.bio || bio; // bio 설정
      } catch (error) {
        console.error('fullName 파싱 오류:', error);
      }
    } else {
      // fullName이 JSON이 아닌 경우 그대로 사용
      nickName = fullName;
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
        <UserBio>{Introduce}</UserBio> {/* 유저 자기소개 */}
      </UserInfo>
    </Card>
  );
};

export default UserCard;

// Styled Components
const Card = styled.div`
  display: flex;
  align-items: center;
  width: 420px;
  border-radius: 16px;
  padding: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 17px;
  width: calc(100% - 97px);
`;

const UserName = styled.h2`
  font-size: 1em;
  margin: 0;
  color: #333;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  white-space: nowrap;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;