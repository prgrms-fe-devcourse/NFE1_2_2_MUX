import React, { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/Close.png';
import TrackIcon from '../../assets/icons/Track.png';
import PostIcon from '../../assets/icons/Post.png';
import PostUpload from './PostUpload';
import TrackUpload from './TrackUpload';

const UploadModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('track');

  return (
    <ModalContainer>
      {/* Modal Header */}
      <Header>
        <TabWrapper>
          <TabButton
            isActive={activeTab === 'track'}
            onClick={() => setActiveTab('track')}>
            <TabIcon
              src={TrackIcon}
              alt="Track Icon"
              invert={activeTab === 'track'}
            />
            음원 업로드
          </TabButton>
          <TabButton
            isActive={activeTab === 'post'}
            onClick={() => setActiveTab('post')}>
            <TabIcon
              src={PostIcon}
              alt="Post Icon"
              invert={activeTab === 'post'}
            />
            추천 포스트 업로드
          </TabButton>
        </TabWrapper>
        <CloseButton onClick={onClose} />
      </Header>

      {/* Modal Content */}
      <Content>
        {activeTab === 'track' ? <TrackUpload /> : <PostUpload />}
      </Content>
    </ModalContainer>
  );
};

export default UploadModal;

// Styled components

const ModalContainer = styled.div`
  width: 45vw;
  height: 75vh;
  background-color: #fff;
  position: fixed;
  top: 13%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 50vw;
    height: 70vh;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 70vw;
    height: 65vh;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 85vw;
    height: 60vh;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #000;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    padding: 12px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    padding: 10px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    padding: 8px;
  }
`;

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TabButton = styled.button`
  padding: 10px 25px;
  cursor: pointer;
  background-color: ${(props) => (props.isActive ? '#000' : '#fff')};
  color: ${(props) => (props.isActive ? '#fff' : '#000')};
  border: 0;
  border-right: 1px solid #000;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 15px;
    padding: 10px 20px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 14px;
    padding: 8px 18px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 12px;
    padding: 6px 15px;
  }
`;

const TabIcon = styled.img`
  margin-right: 8px;
  width: 18px;
  height: 18px;
  filter: ${(props) => (props.invert ? 'invert(1)' : 'none')};

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 16px;
    height: 16px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 14px;
    height: 14px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 12px;
    height: 12px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 1%;
  background-image: url(${CloseIcon});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 22px;
    height: 22px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 20px;
    height: 20px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 18px;
    height: 18px;
  }
`;

const Content = styled.div`
  padding: 20px;
  background-color: #fff;
  flex-grow: 1;
  overflow-y: auto;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    padding: 18px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    padding: 16px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    padding: 12px;
  }
`;
