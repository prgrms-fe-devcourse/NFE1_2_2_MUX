import React, { useState } from 'react';
import styled from 'styled-components';
import HomeIcon from '../../assets/icons/Home.png';
import CurationArtistIcon from '../../assets/icons/CurationArtist.png';
import PostFeedIcon from '../../assets/icons/PostFeed.png';
import BellIcon from '../../assets/icons/Bell.png';
import DefaultProfileImage from '../../assets/images/default-profile.png';
import SearchIcon from '../../assets/icons/Search.png';
import UploadModal from '../modals/UploadModal'; // UploadModal 컴포넌트 가져오기
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [searchTerm, setSearchTerm] = useState(''); // 검색어를 저장하는 상태
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 추가

  // 모달 열기/닫기 함수
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <HeaderContainer>
        {/* 로고 섹션 */}
        <Logo>
          <img src="/assets/images/logo.png" alt="로고" />
        </Logo>

        {/* 네비게이션 바 섹션 */}
        <Navbar>
          {/* 홈 아이콘 */}
          <NavItem href="/main">
            <img src={HomeIcon} alt="Home" />
          </NavItem>
          {/* 큐레이션 및 아티스트 트랙 아이콘 */}
          <NavItem href="/curationart">
            <img src={CurationArtistIcon} alt="큐레이션 & 아티스트 트랙" />
          </NavItem>
          {/* 포스트 피드 아이콘 */}
          <NavItem as={Link} to="/postfeed">
            <img src={PostFeedIcon} alt="포스트" />
          </NavItem>
        </Navbar>

        {/* 검색창 및 업로드 버튼 컨테이너 */}
        <SearchUploadContainer>
          {/* 검색 바 섹션 */}
          <SearchBar>
            <input
              type="text"
              placeholder="검색"
              value={searchTerm} // 입력값을 상태로 연결
              onChange={(e) => setSearchTerm(e.target.value)} // 입력값 변경 시 상태 업데이트
            />
            {/* 검색결과창으로 이동 */}
            <a href={`/search/${searchTerm}`}>
              <img className="search" src={SearchIcon} alt="돋보기" />
            </a>
          </SearchBar>

          {/* 업로드 버튼 */}
          <Upload>
            <RoundButton onClick={openModal}>
              {' '}
              {/* 버튼 클릭 시 모달 열기 */}
              <a>Upload</a>
            </RoundButton>
          </Upload>
        </SearchUploadContainer>

        {/* 프로필 및 알림 섹션 */}
        <ProfileSection>
          {/* 사용자의 칭호 */}
          <div className="title">칭호 없음</div>

          {/* 프로필 이미지*/}
          <a href="/usepage">
            <img className="profile" src={DefaultProfileImage} alt="프로필" />
          </a>

          {/* 알림 아이콘 */}
          <a href="/notifications">
            <img className="notification" src={BellIcon} alt="알림" />
          </a>
        </ProfileSection>
      </HeaderContainer>

      {/* 업로드 모달 */}
      {isModalOpen && (
        <>
          {/* 모달 배경 */}
          <ModalBackground />
          {/* 모달 컨테이너 */}
          <ModalContainer>
            <UploadModal onClose={closeModal} /> {/* UploadModal 컴포넌트 */}
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
  padding: 5px 20px;
  background-color: #f8f9fa;
`;

const Logo = styled.div`
  img {
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
    justify-content: center;
    align-items: center;
    padding: 10px 30px;
    width: 200px;
    background: #ede4db;
    border-radius: 35px;
    font-size: 14px;
    color: #474150;
  }

  img {
    border-radius: 50%;
  }

  img.profile {
    width: 40px;
    height: 40px;
  }

  img.notification {
    width: 24px;
    height: 24px;
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
