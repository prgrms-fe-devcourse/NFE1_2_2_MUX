import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PreviousBtn from '../../assets/icons/Previous-Btn.png';
import NextBtn from '../../assets/icons/Next-Btn.png';
import PlayBtn from '../../assets/icons/play-button-2.png';
import StopBtn from '../../assets/icons/stop-button-2.png';
import YouTube from 'react-youtube';

const PostDetailModal = ({ post, onClose }) => {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const playerRef = useRef(null);

  if (!post) return null;

  let postData = { title: '', albums: [], description: '' };
  let authorData = { nickName: '익명' };

  try {
    postData = JSON.parse(post.title);
    authorData = JSON.parse(post.author.fullName);
  } catch (error) {
    console.error('데이터 파싱 에러:', error);
  }

  const { title, albums, description } = postData;
  const authorNickname = authorData.nickName || '익명';
  const authorImage = post.author?.image || '/default-profile.png';

  const handleNextAlbum = () => {
    const nextIndex = (currentAlbumIndex + 1) % albums.length;
    setCurrentAlbumIndex(nextIndex);
    setCurrentVideoId(albums[nextIndex].videoId);
    setIsPlaying(false);
  };

  const handlePrevAlbum = () => {
    const prevIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    setCurrentAlbumIndex(prevIndex);
    setCurrentVideoId(albums[prevIndex].videoId);
    setIsPlaying(false);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log('댓글 제출:', comment);
    setComment('');
  };

  const handlePlayPause = () => {
    const videoId = albums[currentAlbumIndex]?.videoId;
    if (!videoId) return;

    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.loadVideoById(videoId);
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (
      event.data === YouTube.PlayerState.PAUSED ||
      event.data === YouTube.PlayerState.ENDED
    ) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    setCurrentVideoId(albums[currentAlbumIndex]?.videoId);
  }, [currentAlbumIndex, albums]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <Header>
          <AuthorImage src={authorImage} alt={authorNickname} />
          <HeaderText>
            <PostTitle>{title || 'Untitled'}</PostTitle>
            <AuthorName>{authorNickname}</AuthorName>
          </HeaderText>
        </Header>
        <Divider />

        <AlbumSection>
          <AlbumNavButton onClick={handlePrevAlbum}>
            <img src={PreviousBtn} alt="Previous" />
          </AlbumNavButton>
          <AlbumImageContainer onClick={handlePlayPause}>
            <AlbumImage
              src={albums[currentAlbumIndex]?.coverUrl}
              alt={albums[currentAlbumIndex]?.title}
            />
            <PlayOverlay isPlaying={isPlaying}>
              <PlayPauseIcon
                src={isPlaying ? StopBtn : PlayBtn}
                alt={isPlaying ? 'Pause' : 'Play'}
              />
            </PlayOverlay>
          </AlbumImageContainer>
          <AlbumNavButton onClick={handleNextAlbum}>
            <img src={NextBtn} alt="Next" />
          </AlbumNavButton>
        </AlbumSection>

        <Pagination>
          {albums.map((_, index) => (
            <PaginationDot
              key={index}
              active={index === currentAlbumIndex}
              onClick={() => {
                setCurrentAlbumIndex(index);
                setCurrentVideoId(albums[index].videoId);
                setIsPlaying(false);
              }}
            />
          ))}
        </Pagination>

        <AlbumInfo>
          <AlbumTitle>{albums[currentAlbumIndex]?.title}</AlbumTitle>
          <AlbumArtist>{albums[currentAlbumIndex]?.artist}</AlbumArtist>
        </AlbumInfo>

        <DescriptionBox>
          <Description>{description || 'No description available'}</Description>
        </DescriptionBox>

        <CommentSection>
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
          </CommentForm>
        </CommentSection>

        <YouTube
          videoId={currentVideoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              controls: 0,
            },
          }}
          onReady={(event) => {
            playerRef.current = event.target;
          }}
          onStateChange={handleStateChange}
        />
      </ModalContainer>
    </ModalOverlay>
  );
};

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

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  width: 95%;
  max-width: 800px;
  height: 95vh;
  max-height: 800px;
  overflow-y: auto;
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
    height: 90vh;
    max-height: none;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const AuthorName = styled.span`
  font-size: 14px;
  color: #666;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin: 10px 0;
`;

const AlbumSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 40px;
  margin-bottom: 20px;
`;

const AlbumNavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 20px; // 원하는 버튼 너비
  height: 20px; // 원하는 버튼 높이
  margin-top: 40px;
  margin-left: 30px;
  margin-right: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const AlbumImageContainer = styled.div`
  width: 250px;
  height: 250px;
  position: relative;
  cursor: pointer;
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const PaginationDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? '#000' : '#ccc')};
  margin: 0 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const AlbumInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const AlbumTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const AlbumArtist = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
`;

const DescriptionBox = styled.div`
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  width: 280px;
  max-height: 150px;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 10px;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const CommentSubmitButton = styled.button`
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #0056b3;
  }
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.isPlaying ? 1 : 0)};
  transition: opacity 0.3s ease;

  ${AlbumImageContainer}:hover & {
    opacity: 1;
  }
`;

const PlayPauseIcon = styled.img`
  width: 50px; // 아이콘 크기 조절
  height: 50px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1); // 호버 시 약간 확대
  }
`;

export default PostDetailModal;
