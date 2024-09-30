import React, { useState } from 'react';
import styled from 'styled-components';
import PreviousBtn from '../../assets/icons/Previous-Btn.png';
import NextBtn from '../../assets/icons/Next-Btn.png';

const PostDetailModal = ({ onClose, postId }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const dummyPost = {
    userImage: 'https://example.com/user-image.jpg',
    username: 'Heeju_2778',
    title: '# 신나는 노래가 듣고 싶을 때',
    images: [
      'https://i.namu.wiki/i/ZnqnnxZVzQv6faDBAcVqFf45RndE96JhzuohVFoC-pakkFpeavz_Hg9g-CJJupseMAZ_Cgroq7zRBViOtBM2xQ.webp',
      'https://example.com/another-image.jpg',
      'https://example.com/third-image.jpg',
    ],
    songTitle: 'Merry-go-round',
    artist: '녹황색사회 緑黄色社会',
    content:
      '많은 국내 J-pop 리버들이 좋아하는 그룹이죠!! 녹황색사회 ! 저는 이 그룹 노래중에서도 흔하지 않은 이 노래를 참 좋아합니다!\n\n혹시 여러분들은 Merry-go-round 의 뜻을 아시나요? 바로 회전목마라는 뜻 인데요. 회전목마를 탄 듯이 둥둥 뜨는 멜로디가 이 음악이 매력적으로 느껴지게 하는 것 같습니다 ㅎㅎㅎ',
    likes: 2,
    comments: 1,
  };

  const handlePrevImage = () => {
    setCurrentImage((prev) =>
      prev > 0 ? prev - 1 : dummyPost.images.length - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImage((prev) =>
      prev < dummyPost.images.length - 1 ? prev + 1 : 0,
    );
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <UserInfo>
            <UserImage src={dummyPost.userImage} alt={dummyPost.username} />
            <TextContainer>
              <Title>{dummyPost.title}</Title>
              <Username>{dummyPost.username}</Username>
            </TextContainer>
          </UserInfo>
          <ActionButtonsWrapper>
            <ActionButton>✏️</ActionButton>
            <ActionButton>🗑️</ActionButton>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </ActionButtonsWrapper>
        </Header>

        <Divider />

        <ImageContainer>
          <ImageButton onClick={handlePrevImage}>
            <img src={PreviousBtn} alt="Previous" />
          </ImageButton>
          <PostImage src={dummyPost.images[currentImage]} alt="Post image" />
          <ImageButton onClick={handleNextImage}>
            <img src={NextBtn} alt="Next" />
          </ImageButton>
        </ImageContainer>

        {/* 점(페이지네이션) 추가 */}
        <DotsContainer>
          {dummyPost.images.map((_, index) => (
            <Dot key={index} active={currentImage === index} />
          ))}
        </DotsContainer>

        <SongInfo>
          <SongTitle>{dummyPost.songTitle}</SongTitle>
          <Artist>{dummyPost.artist}</Artist>
        </SongInfo>

        <Content>{dummyPost.content}</Content>

        <Divider />

        <Interactions>
          <InteractionButton>❤ {dummyPost.likes}</InteractionButton>
          <InteractionButton>💬 {dummyPost.comments}</InteractionButton>
        </Interactions>

        <CommentSection>
          <CommentInput placeholder="댓글 달기..." />
        </CommentSection>

        <Comments>
          <Comment>
            <CommentUserImage src="https://example.com/commenter-image.jpg" />
            <CommentText>댓글 달기...</CommentText>
          </Comment>
          <Comment>
            <CommentUserImage src="https://example.com/commenter-image2.jpg" />
            <CommentText>
              통통 뛰는 리듬감이 좋네요! 제 플레이에 꼭 넣어 주겠습니다!
              감사해요!
            </CommentText>
          </Comment>
        </Comments>
      </ModalContainer>
    </ModalOverlay>
  );
};

// Styled components
const ModalContainer = styled.div`
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background-color: white;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin-right: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: -19px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 2px;
  text-align: left;
`;

const Username = styled.span`
  font-weight: bold;
  font-size: 14px;
  color: #888;
  text-align: left;
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-left: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  margin-left: 15px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 10px 0;
`;

const ImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const PostImage = styled.img`
  margin-top: 30px;
  width: 50%; /* 이미지 크기를 줄임 */
  border-radius: 10px;
  margin-bottom: 10px;
`;

const ImageButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  color: white;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px 10px;
  z-index: 1;

  img {
    width: 20px; /* 이미지 버튼 크기 */
  }

  &:first-of-type {
    left: 50px;
  }
  &:last-of-type {
    right: 50px;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#3897f0' : '#dbdbdb')};
  margin: 0 5px;
  transition: background-color 0.3s ease;
`;

const SongInfo = styled.div`
  margin-bottom: 10px;
`;

const SongTitle = styled.h3`
  margin: 15px;
`;

const Artist = styled.p`
  margin: 5px 0;
  color: #666;
`;

const Content = styled.p`
  width: 60%; /* 앨범 이미지와 동일한 가로 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  margin-top: 45px;
  margin-bottom: 30px;
  background-color: #f0e6ff;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
  word-wrap: break-word; /* 글이 길어지면 자동 줄바꿈 */
  box-sizing: border-box; /* padding을 포함한 전체 너비 조정 */
  font-weight: bold;
`;

const Interactions = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const InteractionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 15px;
`;

const CommentSection = styled.div`
  margin-bottom: 15px;
`;

const CommentInput = styled.input`
  width: 95%;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 20px;
  margin-bottom: 10px;
`;

const Comments = styled.div``;

const Comment = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const CommentUserImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export default PostDetailModal;
