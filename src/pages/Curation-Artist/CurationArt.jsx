import React, { useState } from 'react';
import CurationCard from '../../components/CurationCard';
import ArtistCard from '../../components/ArtistCard';
import styled from 'styled-components';
import { deletePost } from '../../utils/api';

const CurationArt = () => {
  const handlePostDelete = async (postId) => {
    console.log('CurationArt: handlePostDelete called with postId:', postId);
    try {
      const token = localStorage.getItem('token');
      console.log(
        'CurationArt: Token retrieved:',
        token ? 'Token exists' : 'No token',
      );
      await deletePost(postId, token);
      console.log('CurationArt: deletePost API call successful');
      alert('트랙이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('CurationArt: Error in handlePostDelete:', error);
      alert('트랙 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <PageContainer>
      <Section>
        <SectionTitle>
          새로운 아티스트들의 멋진 앨범을 <br />
          확인해 보세요!
        </SectionTitle>
        <ArtistCard onPostDelete={handlePostDelete} />
      </Section>
      <Section>
        <SectionTitle>
          당신의 취향에 맞는 <br />
          음악을 추천해 드릴게요
        </SectionTitle>
        {/* 재생 중인 트랙 ID와 핸들러 전달 */}
        <CurationCard />
      </Section>
    </PageContainer>
  );
};

export default CurationArt;

// Styled Components

const PageContainer = styled.div`
  padding: 20px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    padding: 15px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    padding: 10px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    padding: 5px;
  }
`;

const Section = styled.div`
  margin-bottom: 50px;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    margin-bottom: 40px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    margin-bottom: 30px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    margin-bottom: 20px;
  }
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

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    font-size: 16px;
    width: 300px;
    padding-bottom: 12px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    font-size: 15px;
    width: 280px;
    padding-bottom: 11px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 13px;
    width: 220px;
    padding-bottom: 9px;
  }
`;
