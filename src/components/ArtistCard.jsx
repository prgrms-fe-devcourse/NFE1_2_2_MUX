import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getPostDetails } from '../utils/api';
import playButtonIcon from '../assets/icons/play-button.png';
import stopButtonIcon from '../assets/icons/stop-button.png';
import defaultProfileImage from '../assets/images/default-profile.png';
import ReactionCount from '../components/ReactionCount';
import ArtistTrackDetailModal from './modals/ArtistTrackDetailModal';

const ArtistCard = ({
  post,
  isPlaying,
  onPlayPause,
  onLikeUpdate,
  onTrackDelete,
}) => {
  if (!post || !post.author) {
    return null;
  }

  const { author } = post;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState(post.likes ? post.likes.length : 0);
  const [comments, setComments] = useState(
    post.comments ? post.comments.length : 0,
  );
  const audioRef = useRef(null);
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

  const handleArtistClick = (e) => {
    e.stopPropagation();
    navigate(`/user/${author._id}`);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  const handleCardClick = async (e, post) => {
    if (
      !e.target.closest('.profile-area') &&
      !e.target.closest('.play-button')
    ) {
      try {
        const postDetails = await getPostDetails(post._id);
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

  const handlePlayPauseClick = (e) => {
    e.stopPropagation();
    onPlayPause();
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

  const handleTrackDelete = async (postId) => {
    if (onTrackDelete) {
      await onTrackDelete(postId);
    }
    handleCloseModal();
  };

  return (
    <>
      <CardContainer>
        <PostWrapper key={post._id} onClick={(e) => handleCardClick(e, post)}>
          <ArtistInfo className="profile-area" onClick={handleArtistClick}>
            <ArtistAvatar
              src={author.image || defaultProfileImage}
              alt={nickName}
            />
            <ArtistName>{nickName}</ArtistName>
          </ArtistInfo>
          <CardImageContainer>
            <CardImageWrapper>
              <CardImage
                src={firstAlbum ? firstAlbum.coverUrl : 'default-image-url'}
                alt={parsedTitle}
              />
              <PlayPauseButton onClick={handlePlayPauseClick}>
                <img
                  src={isPlaying ? stopButtonIcon : playButtonIcon}
                  alt="play-pause"
                />
              </PlayPauseButton>
            </CardImageWrapper>
          </CardImageContainer>
          <CardContent>
            <PostContent>
              <SongTitle>{parsedTitle}</SongTitle>
              <SongInformation>{description}</SongInformation>
            </PostContent>
            <ReactionCountWrapper>
              <ReactionCount likes={likes} comments={comments} />
            </ReactionCountWrapper>
          </CardContent>
          {firstAlbum && firstAlbum.videoId && (
            <audio ref={audioRef} src={firstAlbum.videoUrl} />
          )}
        </PostWrapper>
      </CardContainer>
      {isModalOpen && selectedPost && (
        <ArtistTrackDetailModal
          track={selectedPost}
          onClose={handleCloseModal}
          onLikeUpdate={handleLikeUpdate}
          onTrackDelete={handleTrackDelete}
          onCommentUpdate={handleCommentUpdate}
        />
      )}
    </>
  );
};

export default ArtistCard;

// Styled Components

const CardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 20px;
  caret-color: transparent;
  margin-bottom: 30px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    flex-direction: row;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    flex-direction: row;
    align-items: scroll;
  }
`;

const PostWrapper = styled.div`
  flex: none;
  width: 300px;
  height: 490px;
  margin: 10px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #ddd5f3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 280px;
    height: 460px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 240px;
    height: 400px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 180px;
    height: 320px;
  }
`;

const ArtistInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 13px;

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

const ArtistAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  cursor: pointer;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 28px;
    height: 28px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 25px;
    height: 25px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 20px;
    height: 20px;
  }
`;

const ArtistName = styled.span`
  font-weight: 600;
  color: #333333;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 12px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 11px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 10px;
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -10px;
`;

const CardImageWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 270px;
  height: 300px;
  margin-top: 10px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 250px;
    height: 280px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 210px;
    height: 250px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 160px;
    height: 180px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  pointer-events: none;
  transition: filter 0.3s ease;

  ${CardImageWrapper}:hover & {
    filter: brightness(70%);
  }
`;

const PlayPauseButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

  ${CardImageWrapper}:hover & {
    opacity: 1;
  }

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 45px;
    height: 45px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 40px;
    height: 40px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 30px;
    height: 30px;
  }
`;

const CardContent = styled.div`
  padding: 15px;
  text-align: left;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    padding: 14px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    padding: 10px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    padding: 8px;
  }
`;

const PostContent = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SongTitle = styled.h3`
  margin: 0 0 5px 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 15px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 14px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 12px;
  }
`;

const SongInformation = styled.p`
  color: #666666;
  font-size: 12px;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.2em;
  height: 2.4em;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 12px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 11px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 10px;
  }
`;

const ReactionCountWrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    margin-top: 18px;
    margin-bottom: 18px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    margin-top: 15px;
    margin-bottom: 15px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;
