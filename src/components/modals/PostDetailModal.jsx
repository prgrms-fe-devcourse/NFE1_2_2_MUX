import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PreviousBtn from '../../assets/icons/Previous-Btn.png';
import NextBtn from '../../assets/icons/Next-Btn.png';
import PlayBtn from '../../assets/icons/play-button-2.png';
import StopBtn from '../../assets/icons/stop-button-2.png';
import LikeIcon from '../../assets/icons/Like.png';
import YouTube from 'react-youtube';
import { addLike, removeLike, addComment } from '../../utils/api.js'; // 댓글 관련 함수 추가

const PostDetailModal = ({ post, onClose, onLikeUpdate }) => {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [currentLikeId, setCurrentLikeId] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 상태 추가
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
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

  useEffect(() => {
    if (post) {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      setIsLiked(likedPosts[post._id] || false);
      setLikeCount(post.likes.length);

      // 댓글을 최신 순으로 정렬
      const sortedComments = [...post.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setComments(sortedComments);
    }
  }, [post]);

  const handleLike = async () => {
    try {
      let newLikedState;
      if (isLiked) {
        await removeLike(currentLikeId, token);
        setLikeCount((prev) => prev - 1);
        newLikedState = false;
      } else {
        const likeResponse = await addLike(post._id, token);
        setLikeCount((prev) => prev + 1);
        newLikedState = true;
        setCurrentLikeId(likeResponse._id);
      }

      setIsLiked(newLikedState);

      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (newLikedState) {
        likedPosts[post._id] = currentLikeId;
      } else {
        delete likedPosts[post._id];
      }
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

      if (onLikeUpdate) {
        onLikeUpdate(post._id, newLikedState);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!comment) return;
      const newComment = await addComment(post._id, comment, token); // 댓글 추가 API 호출
      setComment(''); // 입력 필드 초기화
      setComments((prevComments) => [newComment, ...prevComments]); // 새로운 댓글을 배열의 맨 앞에 추가
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
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
            <PlayOverlay $isPlaying={isPlaying}>
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
              $active={index === currentAlbumIndex}
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

        <Divider />

        <LikeSection>
          <LikeButton onClick={handleLike}>
            <LikeIconImg src={LikeIcon} alt="Like" $isLiked={isLiked} />
            <LikeCount>{likeCount}</LikeCount>
          </LikeButton>
        </LikeSection>

        {/* 댓글 리스트 섹션 */}
        <CommentSection>
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
          </CommentForm>

          {comments.map((commentItem) => (
            <CommentItem key={commentItem._id}>
              <AuthorImage
                src={commentItem.author.image || '/default-profile.png'}
                alt={commentItem.author.nickName}
              />
              <CommentContent>
                <CommentAuthor>
                  {JSON.parse(commentItem.author.fullName)?.nickName || '익명'}
                </CommentAuthor>
                <CommentText>{commentItem.comment}</CommentText>
              </CommentContent>
            </CommentItem>
          ))}
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
  height: 90vh; /* 모달창 크기를 고정 */
  overflow-y: scroll; /* 내부에서 스크롤되게 설정 */
  scrollbar-width: none; /* Firefox에서 스크롤바 숨김 */
  -ms-overflow-style: none; /* IE 및 Edge에서 스크롤바 숨김 */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera에서 스크롤바 숨김 */
  }

  position: relative;

  @media (max-width: 768px) {
    width: 90%;
    height: 90vh;
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

// 프로필 이미지에 얇은 회색 테두리 추가
const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid lightgray; /* 얇은 회색 테두리 */
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
  margin-top: 20px;
  margin-left: 10px;
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
  width: 20px;
  height: 20px;
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
  opacity: ${(props) => (props.$isPlaying ? 1 : 0)};
  transition: opacity 0.3s ease;

  ${AlbumImageContainer}:hover & {
    opacity: 1;
  }
`;

const PlayPauseIcon = styled.img`
  width: 50px;
  height: 50px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
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
  background-color: ${(props) => (props.$active ? '#000' : '#ccc')};
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

const LikeSection = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  margin-left: 20px;
  margin-top: 20px;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 14px;
`;

const LikeIconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  filter: ${(props) =>
    props.$isLiked
      ? 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
      : 'none'};
  transition: filter 0.3s ease;
`;

const LikeCount = styled.span`
  font-weight: bold;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  margin-left: 20px;
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
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const CommentContent = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
`;

// 닉네임 스타일: 굵은 회색 글씨, 작은 크기
const CommentAuthor = styled.span`
  font-weight: bold;
  font-size: 12px; /* 글자 크기를 줄임 */
  color: grey; /* 굵은 회색 글씨 */
  margin-bottom: 5px;
`;

// 댓글 내용 스타일: 굵은 검정색 글씨
const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: bold; /* 굵은 글씨 */
  color: black; /* 검정색 */
`;

export default PostDetailModal;
