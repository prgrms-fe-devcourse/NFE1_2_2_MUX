import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../assets/images/default-profile.png';
import playButtonIcon from '../assets/icons/play-button.png';
import pauseButtonIcon from '../assets/icons/stop-button.png';
import PostDetailModal from '../components/modals/PostDetailModal';
import { getPostDetails } from '../utils/api';
import ReactionCount from '../components/ReactionCount'; // ReactionCount 컴포넌트 import

// 정적 변수로 현재 재생 중인 플레이어 관리
let currentPlayingPlayer = null;

const PostCard = ({ post, onLikeUpdate, onPostDelete }) => {
  const { author } = post;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments.length);
  const playerRef = useRef(null);
  const navigate = useNavigate();

  let parsedTitle, albums, description, nickName;
  try {
    const titleObject = JSON.parse(post.title);
    parsedTitle = titleObject.title;
    albums = titleObject.albums;
    description = titleObject.description;

    const authorInfo = JSON.parse(author.fullName);
    nickName = authorInfo.nickName || '익명';
  } catch (error) {
    console.error('JSON 파싱 에러:', error);
    parsedTitle = '제목 없음';
    albums = [];
    description = '';
    nickName = '익명';
  }

  const firstAlbum = albums && albums.length > 0 ? albums[0] : null;

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (
      firstAlbum &&
      firstAlbum.videoId &&
      isPlayerReady &&
      playerRef.current
    ) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        currentPlayingPlayer = null;
      } else {
        if (
          currentPlayingPlayer &&
          currentPlayingPlayer !== playerRef.current
        ) {
          currentPlayingPlayer.pauseVideo();
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
        currentPlayingPlayer = playerRef.current;
      }
    } else if (!isPlayerReady) {
      alert('플레이어가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleStateChange = (event) => {
    switch (event.data) {
      case YouTube.PlayerState.PLAYING:
        setIsPlaying(true);
        currentPlayingPlayer = playerRef.current;
        break;
      case YouTube.PlayerState.PAUSED:
      case YouTube.PlayerState.ENDED:
        setIsPlaying(false);
        if (currentPlayingPlayer === playerRef.current) {
          currentPlayingPlayer = null;
        }
        break;
      default:
        break;
    }
  };

  const handleReady = (event) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  useEffect(() => {
    return () => {
      if (playerRef.current && playerRef.current.stopVideo) {
        try {
          playerRef.current.stopVideo();
        } catch (error) {
          console.error('Error stopping video:', error);
        }
        if (currentPlayingPlayer === playerRef.current) {
          currentPlayingPlayer = null;
        }
      }
    };
  }, []);

  const handleCardClick = async (e) => {
    // 프로필 영역이나 재생 버튼 클릭 시 모달 열지 않음
    if (
      !e.target.closest('.profile-area') &&
      !e.target.closest('.play-button')
    ) {
      try {
        const token = localStorage.getItem('token');
        const postDetails = await getPostDetails(post._id, token);
        if (postDetails) {
          setSelectedPost(postDetails);
          setIsModalOpen(true);
        } else {
          throw new Error('포스트 정보를 가져오는데 실패했습니다.');
        }
      } catch (error) {
        console.error('포스트 상세 정보를 가져오는데 실패했습니다:', error);
        alert(
          '포스트 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleLikeUpdate = (postId, isLiked, newLikeCount) => {
    setLikes(newLikeCount);
    if (onLikeUpdate) {
      onLikeUpdate(postId, isLiked, newLikeCount);
    }
  };

  const handleCommentUpdate = (newCommentCount) => {
    setComments(newCommentCount);
  };

  const handlePostDelete = async (postId) => {
    if (onPostDelete) {
      await onPostDelete(postId);
    }
    handleCloseModal();
  };

  const handleProfileClick = (e) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    navigate(`/user/${author._id}`); // 작성자의 프로필 페이지로 이동
  };

  return (
    <>
      <Card onClick={handleCardClick}>
        <CardHeader onClick={handleProfileClick} className="profile-area">
          <AuthorImage
            src={author.image || defaultProfileImage}
            alt={nickName}
          />
          <AuthorName>{nickName}</AuthorName>
        </CardHeader>
        <ImageContainer
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}>
          {firstAlbum && (
            <PostImage src={firstAlbum.coverUrl} alt={parsedTitle} />
          )}
          {(isHovered || isPlaying) && (
            <PlayButton className="play-button" onClick={handlePlayPause}>
              <PlayButtonImage
                src={isPlaying ? pauseButtonIcon : playButtonIcon}
                alt={isPlaying ? 'Pause' : 'Play'}
              />
            </PlayButton>
          )}
        </ImageContainer>
        <CardContent>
          <PostTitle>{parsedTitle}</PostTitle>
          <PostDescription>{description}</PostDescription>
          <ReactionCountWrapper>
            <ReactionCount likes={likes} comments={comments} />
          </ReactionCountWrapper>
        </CardContent>
        {firstAlbum && firstAlbum.videoId && (
          <YouTubePlayerContainer>
            <YouTube
              videoId={firstAlbum.videoId}
              opts={{
                height: '0',
                width: '0',
                playerVars: {
                  autoplay: 0,
                },
              }}
              onReady={handleReady}
              onStateChange={handleStateChange}
            />
          </YouTubePlayerContainer>
        )}
      </Card>
      {isModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={handleCloseModal}
          onLikeUpdate={handleLikeUpdate}
          onPostDelete={handlePostDelete}
          onCommentUpdate={handleCommentUpdate}
        />
      )}
    </>
  );
};

export default PostCard;

// Styled Components
const Card = styled.div`
  width: 340px;
  height: 500px;
  margin: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const AuthorImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AuthorName = styled.p`
  color: #333;
  font-size: 0.9em;
  font-weight: bold;
  margin: 0;
  transform: translateY(-1px);
  transition: all 0.3s ease;

  ${CardHeader}:hover & {
    text-decoration: underline;
  }
`;

const PostImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
`;

const CardContent = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h2`
  font-size: 1.1em;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-grow: 1;
  word-break: break-word;
  max-height: 2.7em;
  line-height: 1.3em;
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayButtonImage = styled.img`
  width: 30px;
  height: 30px;
`;

const YouTubePlayerContainer = styled.div`
  display: none;
`;

const ReactionCountWrapper = styled.div`
  margin-top: 10px;
`;
