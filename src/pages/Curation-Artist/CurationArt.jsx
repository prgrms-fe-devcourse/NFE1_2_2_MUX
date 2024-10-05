import React, { useState, useEffect, useCallback, useRef } from 'react';
import CurationCard from '../../components/CurationCard';
import ArtistCard from '../../components/ArtistCard';
import styled from 'styled-components';
import { deletePost, getChannelPosts } from '../../utils/api';

const CurationArt = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [playingPostId, setPlayingPostId] = useState(null);
  const [showHint, setShowHint] = useState(true);
  const artistContainerRef = useRef();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const scrollDistance = useRef(0); 

  const channelId = '66fb53f9ed2d3c14a64eb9ea';
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const POSTS_PER_PAGE = 12;

  const fetchPosts = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const fetchedPosts = await getChannelPosts(
        channelId,
        page,
        POSTS_PER_PAGE,
        token,
      );
      if (fetchedPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          const newPosts = fetchedPosts.filter(
            (newPost) => !prevPosts.some((post) => post._id === newPost._id),
          );
          return [...prevPosts, ...newPosts];
        });
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('포스트를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [channelId, page, hasMore, isLoading, token]);

  const handleLikeUpdate = useCallback(
    (postId, isLiked, newLikeCount) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: isLiked
                  ? [...post.likes, { user: userId }]
                  : post.likes.filter((like) => like.user !== userId),
                likeCount: newLikeCount,
              }
            : post,
        ),
      );
    },
    [userId],
  );

  const handlePostDelete = useCallback(
    async (postId) => {
      try {
        await deletePost(postId, token);
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId),
        );
        alert('트랙이 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('트랙 삭제 중 오류 발생:', error);
        alert('트랙 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [token],
  );

  const handlePlayPause = (postId) => {
    if (playingPostId === postId) {
      setPlayingPostId(null);
    } else {
      setPlayingPostId(postId);
    }
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - artistContainerRef.current.offsetLeft;
    scrollLeft.current = artistContainerRef.current.scrollLeft;
    scrollDistance.current = 0;
    artistContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - artistContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    artistContainerRef.current.scrollLeft = scrollLeft.current - walk;
    scrollDistance.current = walk;

    if (scrollDistance.current > 100 && !isLoading) {
      fetchPosts();
    }
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    artistContainerRef.current.style.cursor = 'grab';
  };

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleHintClick = () => {
    setShowHint(false);
  };
  
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <Section>
        <SectionTitle>
          새로운 아티스트들의 멋진 앨범을 <br />
          확인해 보세요!
        </SectionTitle>
        <ArtistContainer
          ref={artistContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClick={handleHintClick}>
          {showHint && (
            <HintOverlay>
              <HintMessage>좌우로 스와이프</HintMessage>
            </HintOverlay>
          )}
          {posts.map((post) => (
            <div key={post._id}>
              <ArtistCard
                post={post}
                isPlaying={playingPostId === post._id}
                onPlayPause={() => handlePlayPause(post._id)}
                onLikeUpdate={handleLikeUpdate}
                onTrackDelete={handlePostDelete}
              />
            </div>
          ))}
        </ArtistContainer>
      </Section>
      <Section>
        <SectionTitle>
          당신의 취향에 맞는 <br />
          음악을 추천해 드릴게요
        </SectionTitle>
        <CurationCard onClick={handleHintClick}>
          {showHint && (
            <HintOverlay>
              <HintMessage>좌우로 스와이프</HintMessage>
            </HintOverlay>
          )}
        </CurationCard>
      </Section>
    </PageContainer>
  );
};

export default CurationArt;

// Styled Components

const PageContainer = styled.div`
  padding: 20px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    padding: 18px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    padding: 16px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    padding: 14px;
  }
`;

const Section = styled.div`
  margin-bottom: 50px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    margin-bottom: 45px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    margin-bottom: 40px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    margin-bottom: 35px;
  }
`;

const SectionTitle = styled.p`
  color: black;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: left;
  display: inline-block;
  border-bottom: 3px solid black;
  padding-bottom: 10px;
  font-weight: bold;
  width: 250px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 16px;
    width: 300px;
    padding-bottom: 12px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 15px;
    width: 280px;
    padding-bottom: 11px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 13px;
    width: 220px;
    padding-bottom: 9px;
  }
`;

const ArtistContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  gap: 20px;
  padding-bottom: 20px;
  caret-color: transparent;
  margin-bottom: 30px;
  -webkit-overflow-scrolling: touch;
  user-select: none;
  position: relative;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    gap: 18px;
    padding-bottom: 18px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    gap: 15px;
    padding-bottom: 16px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    gap: 12px;
    padding-bottom: 14px;
  }
`;

const HintOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(46, 45, 45, 0.7);
  z-index: 10;
`;

const HintMessage = styled.div`
  color: #d6cbf5;
  font-size: 80px;
  font-weight: bold;
  text-align: center;
  padding: 10px 20px;
  border-radius: 8px;
  z-index: 11;
  animation: blink 2s infinite; 

  @keyframes blink {
    0%  {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 18px;
  margin-top: 20px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 16px;
    margin-top: 18px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 15px;
    margin-top: 16px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 14px;
    margin-top: 14px;
  }
`;
