import React from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';
import { useNavigate } from 'react-router-dom';

const UserProfileCard = ({ user }) => {
  const { image, fullName, _id } = user;
  let nickName = '닉네임이 없습니다.';
  const navigate = useNavigate();

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
    navigate(`/user/${_id}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <ClickableContent>
        <ProfileImage src={image || ExampleImage} alt={nickName} />
        <UserInfo>
          <UserName>{nickName}</UserName>
        </UserInfo>
      </ClickableContent>
    </Card>
  );
};

export default UserProfileCard;

// Styled Components
const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;  // 추가: 카드 내부의 오버플로우를 숨김
`;

const ClickableContent = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s ease;
  width: 100%;
  padding: 10px;  // 추가: 내부 여백을 줘서 호버 시 잘리지 않도록 함

  &:hover {
    transform: scale(1.05);
  }
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const UserName = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 1rem;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;