import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import likeIcon from '../assets/icons/Like.png';
import commentIcon from '../assets/icons/Comment.png';

// 더미 포스트 데이터
const dummyPosts = [
  {
    _id: "post-1",
    likes: Array.from({ length: 10 }), // 10명의 사용자가 좋아요를 누른 것으로 가정
    comments: Array.from({ length: 5 }, (_, i) => `Comment ${i + 1}`), // 5개의 댓글
    title: "첫 번째 게시물",
    author: { fullName: "사용자 1" },
  },
  {
    _id: "post-2",
    likes: Array.from({ length: 23 }), // 23개의 좋아요
    comments: Array.from({ length: 8 }, (_, i) => `Comment ${i + 1}`), // 8개의 댓글
    title: "두 번째 게시물",
    author: { fullName: "사용자 2" },
  },
  {
    _id: "post-3",
    likes: Array.from({ length: 15 }), // 15개의 좋아요
    comments: Array.from({ length: 3 }, (_, i) => `Comment ${i + 1}`), // 3개의 댓글
    title: "세 번째 게시물",
    author: { fullName: "사용자 3" },
  },
  {
    _id: "post-4",
    likes: Array.from({ length: 50 }), // 50개의 좋아요
    comments: Array.from({ length: 12 }, (_, i) => `Comment ${i + 1}`), // 12개의 댓글
    title: "네 번째 게시물",
    author: { fullName: "사용자 4" },
  },
  {
    _id: "post-5",
    likes: Array.from({ length: 30 }), // 30개의 좋아요
    comments: Array.from({ length: 9 }, (_, i) => `Comment ${i + 1}`), // 9개의 댓글
    title: "다섯 번째 게시물",
    author: { fullName: "사용자 5" },
  },
];

// ReactionCount 컴포넌트: 게시물의 좋아요 수와 댓글 수를 표시합니다.
const ReactionCount = ({ postId }) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const post = dummyPosts.find((p) => p._id === postId);
    if (post) {
      setLikes(post.likes.length); // 더미 데이터의 좋아요 수 사용
      setComments(post.comments.length); // 더미 데이터의 댓글 수 사용
    }
  }, [postId]);

  return (
    <MetricsContainer>
      <MetricItem>
        <IconWrapper>
          <Icon src={likeIcon} alt="likes" />
        </IconWrapper>
        <Count>{likes}</Count>
      </MetricItem>
      <MetricItem>
        <IconWrapper>
          <Icon src={commentIcon} alt="comments" />
        </IconWrapper>
        <Count>{comments}</Count>
      </MetricItem>
    </MetricsContainer>
  );
};

// 테스트를 위한 App 컴포넌트
const App = () => {
  const [postIds, setPostIds] = useState([]);

  useEffect(() => {
    const ids = ["post-1", "post-2", "post-3", "post-4", "post-5"];
    setPostIds(ids); // 더미 데이터에 해당하는 ID로 설정
  }, []);

  return (
    <AppContainer>
      <h1>게시물 반응 카운트 테스트</h1>
      <UserList>
        {postIds.map((id) => (
          <PostContainer key={id}>
            <h2>게시물 ID: {id}</h2>
            <ReactionCount postId={id} />
          </PostContainer>
        ))}
      </UserList>
    </AppContainer>
  );
};

export default App;

// 스타일 정의
const MetricsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MetricItem = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  margin-right: 4px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

const Count = styled.span`
  font-size: 14px;
  color: #333;
`;

const AppContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const PostContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const UserList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

