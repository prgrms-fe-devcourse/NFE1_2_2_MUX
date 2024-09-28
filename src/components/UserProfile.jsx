import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ExampleImage from '../assets/images/default-profile.png';
import { useNavigate } from 'react-router-dom';

// 개별 유저 프로필 카드 컴포넌트
const UserProfileCard = ({ user, onNavigate }) => {
  const { image, fullName, _id } = user;

  // 카드 클릭 시 사용자의 상세 페이지로 이동
  const handleCardClick = () => {
    onNavigate(`/userpage/${_id}`);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <StyledProfileImage src={image || ExampleImage} alt={fullName} />
      <StyledUserInfo>
        <StyledUserName>{fullName}</StyledUserName>
      </StyledUserInfo>
    </StyledCard>
  );
};

// 전체 유저 리스트를 렌더링하는 컴포넌트
const App = () => {
  const [users, setUsers] = useState([]); // 유저 목록 상태 관리
  const navigate = useNavigate(); // 라우팅을 위한 useNavigate 훅 사용

  useEffect(() => {
    // API 호출로 대체 예정
    /*
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
    */

    // 더미 유저 데이터
    const dummyUsers = [
      { _id: '1', image: '', fullName: '커트코베인' },
      { _id: '2', image: '', fullName: '아라이카즈키' },
      { _id: '3', image: '', fullName: '모차르트' }
    ];

    setUsers(dummyUsers); // 더미 데이터를 상태에 저장
  }, []);

  return (
    <div>
      <h1>유저 카드 리스트</h1>
      <StyledUserList>
        {users.map((user) => (
          <UserProfileCard key={user._id} user={user} onNavigate={navigate} />
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
`;

const StyledProfileImage = styled.img`
  width: 80px;
  border-radius: 50%;
`;

const StyledUserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledUserName = styled.h2`
  font-size: 18px;
  margin: 0;
  font-weight: normal;
`;