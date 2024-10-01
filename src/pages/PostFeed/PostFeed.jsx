import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getChannelPosts } from '../../utils/api.js';
import PostCard from '../../components/PostCard.jsx';
import YouTube from 'react-youtube';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const channelId = '66fb541ced2d3c14a64eb9ee';
  const token = localStorage.getItem('token');
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, isLoading],
  );

  const fetchPosts = useCallback(
    async (pageToFetch = page) => {
      if (!hasMore || isLoading) return;

      setIsLoading(true);
      try {
        const fetchedPosts = await getChannelPosts(
          channelId,
          pageToFetch,
          12,
          token,
        );
        if (fetchedPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => {
            if (pageToFetch === 0) {
              return fetchedPosts;
            }
            const newPosts = fetchedPosts.filter(
              (newPost) => !prevPosts.some((post) => post._id === newPost._id),
            );
            return [...prevPosts, ...newPosts];
          });
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('포스트를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    [channelId, token, page, hasMore],
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePlay = (videoId) => {
    setCurrentVideoId(videoId);
    if (playerRef.current) {
      playerRef.current.internalPlayer.loadVideoById(videoId);
    }
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <MainContent>
        <PostGrid>
          {posts.map((post, index) => (
            <div
              key={post._id}
              ref={index === posts.length - 1 ? lastPostElementRef : null}>
              <PostCard
                post={post}
                onPlay={handlePlay}
                isPlaying={
                  currentVideoId ===
                  (post.albums && post.albums[0]
                    ? post.albums[0].videoId
                    : null)
                }
              />
            </div>
          ))}
        </PostGrid>
      </MainContent>
      <YouTubePlayerContainer>
        <YouTube
          videoId={currentVideoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
            },
          }}
          onReady={(event) => {
            playerRef.current = event;
          }}
        />
      </YouTubePlayerContainer>
    </PageContainer>
  );
};

export default PostFeed;

// Styled components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 18px;
  margin-top: 20px;
`;

const YouTubePlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
`;
