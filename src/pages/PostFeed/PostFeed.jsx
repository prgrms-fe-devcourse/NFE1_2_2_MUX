import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getChannelPosts, createPost } from '../../utils/api.js';
import PostCard from '../../components/PostCard.jsx';
import YouTube from 'react-youtube';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingPostId, setPlayingPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef(null);
  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore],
  );

  const channelId = '66fb541ced2d3c14a64eb9ee';
  const token = localStorage.getItem('token');
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
  }, [channelId, token, page, hasMore, isLoading]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePlayPause = (videoId, postId) => {
    if (
      currentVideoId === videoId &&
      playerRef.current &&
      playerRef.current.internalPlayer
    ) {
      const playerState = playerRef.current.internalPlayer.getPlayerState();

      if (playerState === 1) {
        playerRef.current.internalPlayer.pauseVideo();
        setIsPlaying(false);
        setPlayingPostId(null);
      } else {
        playerRef.current.internalPlayer.playVideo();
        setIsPlaying(true);
        setPlayingPostId(postId);
      }
    } else {
      setCurrentVideoId(videoId);
      setPlayingPostId(postId);
      if (playerRef.current && playerRef.current.internalPlayer) {
        playerRef.current.internalPlayer.loadVideoById(videoId);
        playerRef.current.internalPlayer.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleStateChange = (event) => {
    if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false);
    }
  };

  const handleCreatePost = async (newPostData) => {
    try {
      const createdPost = await createPost(newPostData, token);
      setPosts((prevPosts) => [createdPost, ...prevPosts]);
    } catch (err) {
      console.error('Failed to create post:', err);
      setError('게시글 생성에 실패했습니다.');
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
                onPlayPause={handlePlayPause}
                isPlaying={playingPostId === post._id && isPlaying}
              />
            </div>
          ))}
        </PostGrid>
        {isLoading && <LoadingMessage>포스트를 불러오는 중...</LoadingMessage>}
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
          onStateChange={handleStateChange}
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

const LoadingMessage = styled.div`
  text-align: center;
  color: #6c5ce7;
  font-size: 18px;
  margin-top: 20px;
`;

const YouTubePlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
`;
