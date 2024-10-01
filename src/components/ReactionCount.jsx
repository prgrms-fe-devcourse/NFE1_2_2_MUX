import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import likeIcon from '../assets/icons/Like.png';
import commentIcon from '../assets/icons/Comment.png';

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

