import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { getChannelPosts, deletePost } from '../../utils/api.js';
import PostCard from '../../components/PostCard.jsx';

const PostFeed = ({ onPlayTrack }) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
  }, [channelId, token, page, hasMore, isLoading]);

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
        alert('게시글이 삭제되었습니다.');
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        alert('게시글 삭제에 실패했습니다. 다시 시도해주세요.');
      }
    },
    [token],
  );

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
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
                onLikeUpdate={handleLikeUpdate}
                onPostDelete={handlePostDelete}
                onPlayTrack={onPlayTrack}
              />
            </div>
          ))}
        </PostGrid>
        {isLoading && <LoadingMessage>포스트를 불러오는 중...</LoadingMessage>}
      </MainContent>
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
