import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import HomeIcon from '../../assets/icons/Home.png';
import CurationArtistIcon from '../../assets/icons/CurationArtist.png';
import PostFeedIcon from '../../assets/icons/PostFeed.png';
import BellIcon from '../../assets/icons/Bell.png';
import DefaultProfileImage from '../../assets/images/default-profile.png';
import SearchIcon from '../../assets/icons/Search.png';
import LogoImage from '../../assets/images/Logo.png';
import UploadModal from '../modals/UploadModal';
import NotificationModal from '../modals/NotificationModal';
import { getNotifications } from '../../utils/api.js'; // API 호출을 위한 함수 가져오기

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [unseenNotifications, setUnseenNotifications] = useState(false); // 초기값을 false로 설정
  const navigate = useNavigate();

// 알림을 가져오는 함수
const fetchNotifications = async () => {
  const token = localStorage.getItem('token');
  if (!token) return; // 토큰이 없으면 종료

  try {
    const fetchedNotifications = await getNotifications(token); // API를 통해 알림 데이터를 가져옴

    // 확인되지 않은 알림의 수를 계산합니다.
    const unseenNotifications = fetchedNotifications.filter(notification => !notification.seen);
    const unseenCount = unseenNotifications.length; // 확인되지 않은 알림의 수

    setUnseenNotifications(unseenCount); // 상태 업데이트: 확인되지 않은 알림의 수
  } catch (error) {
    console.error('Error fetching notifications:', error);
    // 여기서 사용자에게 알림 오류를 알려줄 수 있는 로직을 추가할 수 있습니다.
    setError('알림을 불러오는 데 실패했습니다.'); // 오류 메시지 상태 업데이트
  }
};

  // 컴포넌트가 마운트될 때 알림을 가져옴
  useEffect(() => {
    fetchNotifications(); // 알림을 가져옴
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때 한 번만 실행

  const handleNotificationClick = () => {
    setShowModal(true);
    setUnseenNotifications(false); // 모달 열 때 도트 숨김
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleProfileClick = () => {
    if (user && user._id) {
      navigate(`/user/${user._id}`);
    }
  };

  return (
    <>
      <HeaderContainer>
        <Logo >
          <a href="/mainpage" >
          <img src={LogoImage} alt="로고"/>
          </a>
        </Logo>
        <Navbar>
          <NavItem href="/mainpage">
            <img src={HomeIcon} alt="Home" />
          </NavItem>
          <NavItem href="/curationart">
            <img src={CurationArtistIcon} alt="큐레이션 & 아티스트 트랙" />
          </NavItem>
          <NavItem as={Link} to="/postfeed">
            <img src={PostFeedIcon} alt="포스트" />
          </NavItem>
        </Navbar>

        <SearchUploadContainer>
          <SearchBar>
            <input
              type="text"
              placeholder="검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <a href={`/search/${searchTerm}`}>
              <img className="search" src={SearchIcon} alt="돋보기" />
            </a>
          </SearchBar>

          <Upload>
            <RoundButton onClick={() => setIsModalOpen(true)}>
              <a>Upload</a>
            </RoundButton>
          </Upload>
        </SearchUploadContainer>

        <ProfileSection>
          <div className="title">칭호 없음</div>

          <a onClick={handleProfileClick}>
            <img
              className="profile"
              src={user?.image ? user.image : DefaultProfileImage}
              alt="프로필"
            />
          </a>

          <NotificationButton onClick={handleNotificationClick} unseen={unseenNotifications}>
            <img src={BellIcon} alt="알림" />
          </NotificationButton>
          <NotificationModal show={showModal} onClose={handleCloseModal} />
        </ProfileSection>
      </HeaderContainer>

      {isModalOpen && (
        <>
          <ModalBackground />
          <ModalContainer>
            <UploadModal onClose={() => setIsModalOpen(false)} />
          </ModalContainer>
        </>
      )}
    </>
  );
};

export default Navigation;

// 스타일 정의
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #f8f9fa;
`;

const Logo = styled.div`
  img {
    margin-right: 0;
    height: 40px;
  }
`;

const Navbar = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: bold;

  img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
  }
`;

const SearchUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background-color: #d9d9d9;
  border-radius: 2px;
  padding: 5px;
  width: 100%; /* 전체 폭 사용 */

  img.search {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }

  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 5px 10px;
    font-size: 14px;
    color: #333;
    width: 400px;

    &:focus {
      outline: none;
    }

    @media (max-width: 1005px) {
      width: calc(100% - 30px); /* 1005px 이하에서 너비 줄이기 */
      min-width: 150px; /* 최소 너비 설정 */
    }

    @media (max-width: 768px) {
      width: 150px; /* 모바일에서는 최소 너비 */
    }
  }
`;

const Upload = styled.div`
  display: flex;
  align-items: center;
`;

const RoundButton = styled.div`
  background-color: #000000;
  border-radius: 32px;
  padding: 4px 24px;
  text-align: center;
  cursor: pointer;

  a {
    text-decoration: none;
    color: white;
    font-weight: lighter;
    font-size: 15px;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .title {
    display: flex;
    padding: 5px 30px;
    background: #ede4db;
    border-radius: 35px;
    font-size: 14px;
    color: #474150;

    @media (max-width: 790px) {
      display: none; /* 790px 이하에서 사라짐 */
    }
  }

  img {
    border-radius: 50%;
  }

  img.profile {
    width: 40px;
    height: 40px;
    margin-left: 5px;
    margin-top: 5px;
  }

  img.notification {
    width: 24px;
    height: 24px;
  }
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative; // 주홍색 점을 아이콘에 상대적으로 위치시키기 위해 relative로 설정

  img {
    width: 30px;  /* 이미지 크기 조정 */
    height: 30px;
  }

  &::after {
    content: ''; // 점을 생성하기 위해 사용
    position: absolute; // 아이콘에 절대적으로 위치
    top: -5px; // 아이콘의 위쪽으로 이동
    right: -5px; // 아이콘의 오른쪽으로 이동
    width: 8px; // 점의 너비
    height: 8px; // 점의 높이
    border-radius: 50%; // 점을 원형으로 만들기
    background-color: #f6601b; // 점의 색상 (주홍색)
    display: ${({ unseen }) => (unseen ? 'block' : 'none')}; // 확인하지 않은 알림이 없으면 숨김
  }
`;
// 모달 배경 및 컨테이너 스타일 정의
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  z-index: 1000;
  padding: 20px;
`;