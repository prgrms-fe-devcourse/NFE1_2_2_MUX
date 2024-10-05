import React, { useState } from 'react';
import CurationCard from '../../components/CurationCard';
import ArtistCard from '../../components/ArtistCard';
import styled from 'styled-components';

const CurationArt = () => {

  return (
    <PageContainer>
      <Section>
        <SectionTitle>
          새로운 아티스트들의 멋진 앨범을 <br />
          확인해 보세요!
        </SectionTitle>
        {/* 재생 중인 트랙 ID와 핸들러 전달 */}
        <ArtistCard/>
      </Section>
      <Section>
        <SectionTitle>
          당신의 취향에 맞는 <br />
          음악을 추천해 드릴게요
        </SectionTitle>
        {/* 재생 중인 트랙 ID와 핸들러 전달 */}
        <CurationCard/>
      </Section>
    </PageContainer>
  );
};

export default CurationArt;

// Styled Components

const PageContainer = styled.div`
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 50px;
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
`;
