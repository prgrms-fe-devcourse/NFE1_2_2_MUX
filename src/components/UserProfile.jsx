import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../utils/api'; // 여기서 임포트

// 개별 유저 프로필 카드 컴포넌트
const UserProfile = ({ user, onNavigate }) => {
  const { image, fullName, _id } = user;
  let nickName = '닉네임이 없습니다.';

  // fullName이 JSON 문자열로 저장되어 있으므로 파싱
  if (fullName) {
    try {
      const parsedFullName = JSON.parse(fullName);
      nickName = parsedFullName.nickName || nickName;
    } catch (error) {
      console.error('fullName 파싱 오류:', error);
    }
  }

  const handleCardClick = () => {
    onNavigate(`/userpage/${_id}`);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <StyledProfileImage src={image || ExampleImage} alt={nickName} />
      <StyledUserInfo>
        <StyledUserName>{nickName}</StyledUserName>
      </StyledUserInfo>
    </StyledCard>
  );
};

// 전체 유저 리스트를 렌더링하는 컴포넌트
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
      <StyledUserList>
        {users.map((user) => (
          <UserProfile key={user._id} user={user} onNavigate={navigate} />
        ))}
      </StyledUserList>
    </div>
  );
};

export default App;


// Styled Components
const StyledUserList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const StyledCard = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  width: 130px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
  flex-direction: column;

  &:hover {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
`;

const StyledProfileImage = styled.img`
  width: 110px;
  height: 110px;
  border-radius: 50%;
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserName = styled.h2`
  font-size: 13px;
  font-weight: 550;
  margin-top: 10px;
`;