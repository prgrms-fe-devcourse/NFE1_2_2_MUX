import React, { useState } from 'react';
import styled from 'styled-components';
import CloseIcon from '../../assets/icons/Close.png'
import TrackIcon from '../../assets/icons/Track.png';
import PostIcon from '../../assets/icons/Post.png';

const UploadModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('track');

  return (
    <ModalContainer>
      {/* Modal Header */}
      <Header>
        <TabWrapper>
          
        </TabWrapper>
      </Header>

      {/* Modal Content */}
      <Content>
        
      </Content>

      {/* Submit Button */}
      <Footer>
      </Footer>
    </ModalContainer>
  );
};

export default UploadModal;

// Styled components

const ModalContainer = styled.div`
  width: 90vw;
  height: 100vh;
  background-color: #fff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 25px;
  background-color: #fff;
  border-bottom: 1px solid #000;
`;

const TabWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Content = styled.div`
  padding: 20px;
  background-color: #fff;
  flex-grow: 1; 
  overflow-y: auto;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px 25px;
  background-color: #fff;
  border-top: 1px solid #000;
`;

