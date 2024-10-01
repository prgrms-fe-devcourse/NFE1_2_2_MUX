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
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
  const [playingPostId, setPlayingPostId] = useState(null); // 현재 재생 중인 포스트 ID 관리
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const playerRef = useRef(null); // YouTube 플레이어 참조

  const channelId = '66fb541ced2d3c14a64eb9ee';
  const token = localStorage.getItem('token');

  const fetchPosts = useCallback(
    async (pageToFetch = page) => {
      if (!hasMore || isLoading) return;

      setIsLoading(true); // 로딩 시작
      try {
        const fetchedPosts = await getChannelPosts(
          channelId,
          pageToFetch,
          12,
          token,
        );
        if (fetchedPosts.length === 0) {
          setHasMore(false); // 더 이상 가져올 데이터가 없음
        } else {
          // 중복 제거 로직: 기존 포스트와 새로운 포스트를 비교하여 중복 제거
          setPosts((prevPosts) => {
            const newPosts = fetchedPosts.filter(
              (newPost) => !prevPosts.some((post) => post._id === newPost._id),
            );
            return [...prevPosts, ...newPosts]; // 중복되지 않은 새로운 포스트만 추가
          });
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError('포스트를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    },
    [channelId, token, page, hasMore, isLoading],
  );

  useEffect(() => {
    fetchPosts(page); // 페이지가 변경될 때마다 fetchPosts 호출
  }, [page]);

  // YouTube 플레이어의 상태를 확인하고 재생/일시정지를 처리하는 함수
  const handlePlayPause = (videoId, postId) => {
    if (
      currentVideoId === videoId &&
      playerRef.current &&
      playerRef.current.internalPlayer
    ) {
      const playerState = playerRef.current.internalPlayer.getPlayerState();

      if (playerState === 1) {
        // 현재 재생 중이면 일시정지
        playerRef.current.internalPlayer.pauseVideo();
        setIsPlaying(false); // 재생 상태를 false로 전환
        setPlayingPostId(null); // 재생 중인 포스트 초기화
      } else {
        // 현재 일시정지 중이거나 멈췄다면 재생
        playerRef.current.internalPlayer.playVideo();
        setIsPlaying(true); // 재생 상태를 true로 전환
        setPlayingPostId(postId); // 현재 재생 중인 포스트 ID 설정
      }
    } else {
      // 새로 재생할 경우
      setCurrentVideoId(videoId);
      setPlayingPostId(postId); // 재생 중인 포스트 ID 설정
      if (playerRef.current && playerRef.current.internalPlayer) {
        playerRef.current.internalPlayer.loadVideoById(videoId);
        playerRef.current.internalPlayer.playVideo(); // 비디오 재생
        setIsPlaying(true); // 재생 상태로 전환
      }
    }
  };

  // YouTube 플레이어의 상태 변화를 처리하는 함수
  const handleStateChange = (event) => {
    if (event.data === 1) {
      setIsPlaying(true); // 재생 상태로 변경
    } else if (event.data === 2 || event.data === 0) {
      setIsPlaying(false); // 일시정지 또는 종료 상태로 변경
    }
  };

  const loadMorePosts = () => {
    setPage((prevPage) => prevPage + 1); // 페이지 증가
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <PageContainer>
      <MainContent>
        <PostGrid>
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onPlayPause={handlePlayPause}
              isPlaying={playingPostId === post._id && isPlaying} // 개별 카드의 재생 상태
            />
          ))}
        </PostGrid>
        {/* 더보기 버튼 */}
        {hasMore && !isLoading && (
          <LoadMoreButton onClick={loadMorePosts}>더보기</LoadMoreButton>
        )}
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
          onStateChange={handleStateChange} // YouTube API의 상태 변화를 처리
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

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto; // 자동으로 양옆에 마진을 주어 가운데 정렬
  padding: 10px 20px;
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #5a4db1;
  }
`;
