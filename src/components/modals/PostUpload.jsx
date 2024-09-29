import React, { useState } from 'react';
import styled from 'styled-components';

const PostUpload = () => {
    
  const [description, setDescription] = useState('');

  return (
    <PostUploadContainer>
      <ContentWrapper>

        {/* 설명 입력 섹션 */}
        <DescriptionSection>
          <DescriptionTitle>노래 소개</DescriptionTitle>
          <DescriptionInput
            placeholder="이 곡의 특별함은 무엇인가요?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DescriptionSection>

      </ContentWrapper>
    </PostUploadContainer>
  );
};

export default PostUpload;

// Styled components

const PostUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 15px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60vh;
`;

const DescriptionSection = styled.div`
  background-color: #C0AFE2;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #d1c4e9;
`;

const DescriptionTitle = styled.p`
  font-size: 18px;
  margin-top: 0%;
  margin-bottom: 15px;
  color: white;
  border-bottom: 2px solid white;
`;

const DescriptionInput = styled.textarea`
  width: 95%;
  height: 70px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #C0AFE2;
  font-size: 14px;
  color: white;
  resize: none;

  &::placeholder {
    color: white;
  }
`;

const CharCount = styled.p`
  font-size: 12px;
  color: white;
  text-align: right;
  margin-top: 5px;
`;

