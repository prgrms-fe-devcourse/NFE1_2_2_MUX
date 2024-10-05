import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getChannelPosts } from '../utils/api';
import playButtonIcon from '../assets/icons/play-button.png';
import stopButtonIcon from '../assets/icons/stop-button.png';
import defaultProfileImage from '../assets/images/default-profile.png';

const ArtistCard = ({ artistId }) => {
  const [playingPostId, setPlayingPostId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const audioRefs = useRef([]);
  const cardContainerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const channelId = '66fb53f9ed2d3c14a64eb9ea';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChannelPosts = async () => {
      try {
        const fetchedPosts = await getChannelPosts(channelId, 0, 10, token);
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
  }, [channelId, token]);

  const togglePlayPause = (post, index) => {
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
          audioElement.currentTime = 0;
        }
      }

      audioElement.play();
      setPlayingPostId(post._id);

      audioElement.addEventListener('ended', () => {
        setPlayingPostId(null);
      });
    }
  };

  const handleArtistClick = (e) => {
    e.stopPropagation();
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

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - cardContainerRef.current.offsetLeft;
    scrollLeft.current = cardContainerRef.current.scrollLeft;
    cardContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - cardContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    cardContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDown.current = false;
    cardContainerRef.current.style.cursor = 'grab';
  };

  return (
    <CardContainer
      ref={cardContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}>
      {posts.map((post, index) => {
        const titleObject = JSON.parse(post.title);
        const { title, description, albums } = titleObject;
        const album = albums?.[0];
        const nickName = parseAuthorNickName(post.author);

        return (
          <PostWrapper key={post._id}>
            <ArtistInfo>
              <ArtistAvatar
                src={post.author.image || defaultProfileImage}
                alt={nickName}
                onClick={handleArtistClick}
              />
              <ArtistName onClick={handleArtistClick}>{nickName}</ArtistName>
            </ArtistInfo>
            <CardImageContainer>
              <CardImageWrapper>
                <CardImage
                  src={album?.coverUrl || 'default-image-url'}
                  alt={`${nickName}의 아트워크`}
                />
                <PlayPauseButton onClick={() => togglePlayPause(post, index)}>
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
  cursor: grab;
  user-select: none;
  width: 100%;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
    flex-wrap: nowrap;
    width: 100%;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    flex-direction: row;
    align-items: scroll;
    flex-wrap: nowrap;
    width: 100%;
  }
`;

const PostWrapper = styled.div`
  flex: none;
  width: 300px;
  height: 480px;
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
    width: 260px;
    height: 420px;
    justify-content: flex-start;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 240px;
    height: 400px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 220px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 270px;
  height: 300px;

  &:hover div {
    opacity: 1;
  }

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 240px;
    height: 280px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 220px;
    height: 260px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 200px;
    height: 240px;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  pointer-events: none;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    height: 280px;
    width: 240px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    height: 260px;
    width: 220px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    height: 240px;
    width: 200px;
    margin-top: 0;
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
