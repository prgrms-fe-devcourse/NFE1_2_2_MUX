import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { getChannelPosts, getPostDetails } from '../utils/api';
import playButtonIcon from '../assets/icons/play-button.png';
import stopButtonIcon from '../assets/icons/stop-button.png';
import defaultProfileImage from '../assets/images/default-profile.png';
import ReactionCount from '../components/ReactionCount';
import ArtistTrackDetailModal from './modals/ArtistTrackDetailModal';

const ArtistCard = ({ onLikeUpdate, onPostDelete }) => {
  const [playingPostId, setPlayingPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const audioRefs = useRef([]);
  const navigate = useNavigate();

  const channelId = '66fb53f9ed2d3c14a64eb9ea';

  useEffect(() => {
    const fetchChannelPosts = async () => {
      try {
        const fetchedPosts = await getChannelPosts(channelId);
        const sortedPosts = fetchedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error('Failed to fetch channel posts:', error);
        setError('포스트를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchChannelPosts();
  }, [channelId]);

  const togglePlayPause = (post, index, e) => {
    e.stopPropagation();
    const titleObject = JSON.parse(post.title);
    const album = titleObject.albums?.[0];

    if (!album || !album.videoUrl) {
      console.error('오디오 URL을 찾을 수 없습니다.');
      return;
    }

    const audioElement = audioRefs.current[index];

    if (playingPostId === post._id) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setPlayingPostId(null);
    } else {
      if (playingPostId !== null) {
        const currentAudioIndex = posts.findIndex(
          (p) => p._id === playingPostId,
        );
        const currentAudio = audioRefs.current[currentAudioIndex];
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      }

      audioElement.play();
      setPlayingPostId(post._id);

      audioElement.addEventListener('ended', () => {
        setPlayingPostId(null);
      });
    }
  };

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleLikeUpdate = (postId, isLiked, newLikeCount) => {
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? { ...post, likes: { length: newLikeCount } }
          : post,
      ),
    );
    if (onLikeUpdate) {
      onLikeUpdate(postId, isLiked, newLikeCount);
    }
  };

  const handleCommentUpdate = (postId, newCommentCount) => {
    setPosts(
      posts.map((post) =>
        post._id === postId
          ? { ...post, comments: { length: newCommentCount } }
          : post,
      ),
    );
  };

  const handleProfileClick = (e, authorId) => {
    e.stopPropagation();
    navigate(`/user/${authorId}`);
  };

  const parseAuthorNickName = (author) => {
    let nickName = '익명';

    try {
      const authorInfo = JSON.parse(author.fullName);
      nickName = authorInfo.nickName || '익명';
    } catch (error) {
      console.error('닉네임 파싱 중 오류 발생:', error);
    }

    return nickName;
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <CardContainer>
      {posts.map((post, index) => {
        const titleObject = JSON.parse(post.title);
        const { title, description, albums } = titleObject;
        const album = albums?.[0];
        const nickName = parseAuthorNickName(post.author);

        return (
          <PostWrapper key={post._id} onClick={(e) => handleCardClick(e, post)}>
            <ArtistInfo
              className="profile-area"
              onClick={(e) => handleProfileClick(e, post.author._id)}>
              <ArtistAvatar
                src={post.author.image || defaultProfileImage}
                alt={nickName}
              />
              <ArtistName>{nickName}</ArtistName>
            </ArtistInfo>
            <CardImageContainer>
              <CardImageWrapper>
                <CardImage
                  src={album?.coverUrl || 'default-image-url'}
                  alt={`${nickName}의 아트워크`}
                />
                <PlayPauseButton
                  className="play-button"
                  onClick={(e) => togglePlayPause(post, index, e)}>
                  <img
                    src={
                      playingPostId === post._id
                        ? stopButtonIcon
                        : playButtonIcon
                    }
                    alt={
                      playingPostId === post._id
                        ? 'Pause Button'
                        : 'Play Button'
                    }
                  />
                </PlayPauseButton>
              </CardImageWrapper>
            </CardImageContainer>
            <CardContent>
              <PostContent>
                <SongTitle>{title}</SongTitle>
                <SongInformation>{description}</SongInformation>
              </PostContent>
              <ReactionCount
                likes={post.likes.length}
                comments={post.comments.length}
              />
            </CardContent>
            {album?.videoUrl && (
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={album.videoUrl}
              />
            )}
          </PostWrapper>
        );
      })}
      {isModalOpen && selectedPost && (
        <ArtistTrackDetailModal
          track={selectedPost}
          onClose={handleCloseModal}
          onLikeUpdate={handleLikeUpdate}
          onTrackDelete={onPostDelete}
          onCommentUpdate={(commentCount) =>
            handleCommentUpdate(selectedPost._id, commentCount)
          }
        />
      )}
    </CardContainer>
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
  -webkit-overflow-scrolling: touch;

  /* 노트북 & 테블릿 가로 (해상도 1024px ~ ) */
  @media all and (min-width: 1024px) and (max-width: 1279px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  /* 테블릿 가로 (해상도 768px ~ 1023px) */
  @media all and (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
    flex-wrap: wrap;
  }

  /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px) */
  @media all and (min-width: 480px) and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PostWrapper = styled.div`
  flex: none;
  width: 300px;
  height: 480px;
  margin: 10px;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f3e8fb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }

  /* 노트북 & 테블릿 가로 (해상도 1024px ~ ) */
  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 260px;
    height: 420px;
  }

  /* 테블릿 가로 (해상도 768px ~ 1023px) */
  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 240px;
    height: 400px;
  }

  /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px) */
  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 100%;
    height: 380px;
  }
`;

const ArtistInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 13px;
`;

const ArtistAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  cursor: pointer;
`;

const ArtistName = styled.span`
  font-weight: 600;
  color: #333333;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -10px;
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 270px;
  height: 300px;

  &:hover div {
    opacity: 1;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;

  /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px) */
  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 100%;
    height: 240px;
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

  img {
    width: 100%;
    height: 100%;
  }

  ${CardImageWrapper}:hover & {
    opacity: 1;
  }
`;

const CardContent = styled.div`
  padding: 15px;
  text-align: left;
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
`;

const SongInformation = styled.p`
  color: #666666;
  font-size: 12px;
  margin-bottom: 10px;
`;
