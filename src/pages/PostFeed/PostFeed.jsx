import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getChannelPosts, createPost } from '../../utils/api.js';
import PostCard from '../../components/PostCard.jsx';
import YouTube from 'react-youtube';

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0); // 페이지 상태 관리
  const [hasMore, setHasMore] = useState(true);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingPostId, setPlayingPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef(null);
  const observer = useRef(); // 스크롤 관찰을 위한 ref

  const channelId = '66fb541ced2d3c14a64eb9ee';
  const token = localStorage.getItem('token');
  const POSTS_PER_PAGE = 12; // 한 번에 불러올 포스트 개수

  // 포스트 데이터 가져오기
  const fetchPosts = useCallback(async () => {
    if (!hasMore || isLoading) return; // 더 이상 가져올 데이터가 없거나 로딩 중이면 중단

    setIsLoading(true);
    try {
      const fetchedPosts = await getChannelPosts(
        channelId,
        page,
        POSTS_PER_PAGE,
        token,
      );
      if (fetchedPosts.length === 0) {
        setHasMore(false); // 더 이상 가져올 데이터가 없음
      } else {
        setPosts((prevPosts) => {
          const newPosts = fetchedPosts.filter(
            (newPost) => !prevPosts.some((post) => post._id === newPost._id),
          );
          return [...prevPosts, ...newPosts]; // 중복되지 않은 새로운 포스트만 추가
        });
        setPage((prevPage) => prevPage + 1); // 페이지 수 증가
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('포스트를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [channelId, token, page, hasMore, isLoading]);

  // 무한 스크롤을 위한 IntersectionObserver 설정
  const lastPostElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect(); // 기존 observer 해제

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPosts(); // 페이지 끝에 도달하면 추가 포스트 로드
        }
      });

      if (node) observer.current.observe(node); // 마지막 포스트 요소를 관찰
    },
    [isLoading, hasMore, fetchPosts],
  );

  // 컴포넌트 마운트 시 처음 12개 포스트 불러오기
  useEffect(() => {
    fetchPosts();
  }, []); // 페이지가 처음 로드될 때 한 번만 실행

  // YouTube 플레이어 재생/일시정지 처리
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

  // YouTube 플레이어 상태 변화를 처리하는 함수
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
      setPosts((prevPosts) => [createdPost, ...prevPosts]); // 새로운 포스트를 배열 앞에 추가
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

const YouTubePlayerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
`;
