import React from 'react';
import styled from 'styled-components';
import likeIcon from '../assets/icons/Like.png';
import commentIcon from '../assets/icons/Comment.png';

const ReactionCount = ({ likes, comments }) => {
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

export default ReactionCount;

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
  display: flex;
  align-items: center;
  margin-right: 4px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
`;

const Count = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: bold;
  position: relative;
  top: -1px; // 숫자를 약간 위로 올립니다
`;
