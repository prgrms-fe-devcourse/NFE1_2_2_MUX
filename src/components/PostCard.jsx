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

const PostCard = ({ post, onPlayTrack, onLikeUpdate, onPostDelete }) => {
  const { author } = post;
  const [isHovered, setIsHovered] = useState(false);;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments.length);
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

  const handlePlayPause = () => {
    if (firstAlbum && firstAlbum.videoId) {
      const track = {
        title: parsedTitle,
        artist: nickName,
        videoId: firstAlbum.videoId,
      };
      onPlayTrack(track);
    }
  };

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
          {isHovered && (
            <PlayButton className="play-button" onClick={handlePlayPause}>
              <PlayButtonImage src={playButtonIcon} alt="Play" />
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
      </Card>
      {isModalOpen && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={handleCloseModal}
          onLikeUpdate={handleLikeUpdate}
          onPostDelete={handlePostDelete}
          onCommentUpdate={handleCommentUpdate}
          onPlayTrack={handlePlayPause}
        />
      )}
    </>
  );
};

export default PostCard;

// Styled Components
const Card = styled.div`
  width: 280px; // 340px에서 축소
  height: 420px; // 500px에서 축소
  margin: 12px; // 15px에서 축소
  border-radius: 8px; // 10px에서 축소
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const AuthorImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 8px;
`;

const AuthorName = styled.p`
  color: #333;
  font-size: 0.8em;
  font-weight: bold;
  margin: 0;
  transform: translateY(-1px);
  transition: all 0.3s ease;

  ${CardHeader}:hover & {
    text-decoration: underline;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const PostImage = styled.img`
  width: 100%;
  height: 250px; // 300px에서 축소
  object-fit: cover;
  border: 1px solid #e0e0e0;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayButtonImage = styled.img`
  width: 25px;
  height: 25px;
`;

const CardContent = styled.div`
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h2`
  font-size: 1em;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostDescription = styled.p`
  font-size: 0.8em;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-grow: 1;
  word-break: break-word;
  max-height: 2.4em;
  line-height: 1.2em;
`;

const YouTubePlayerContainer = styled.div`
  display: none;
`;

const ReactionCountWrapper = styled.div`
  margin-top: 20px;
`;
