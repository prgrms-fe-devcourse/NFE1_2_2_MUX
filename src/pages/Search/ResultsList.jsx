import React, { useState } from 'react';
import styled from 'styled-components';
import ArtistCard from '../../components/ArtistCard';
import PostCard from '../../components/PostCard';
import UserCard from '../../components/UserCard';

const ResultsList = ({ artistPosts, recommendedPosts, users, loading, onUserClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('artists');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const renderResults = () => {
    switch(selectedCategory) {
      case 'artists':
        return artistPosts.map((post) => (
          <ArtistCard key={post._id} post={post} />
        ));
      case 'recommended':
        return recommendedPosts.map((post) => (
          <PostCard key={post._id} post={post} />
        ));
      case 'users':
        return users.map((user) => (
          <UserCard key={user._id} user={user} onClick={() => onUserClick(user._id)} />
        ));
      default:
        return null;
    }
  };

  return (
    <ResultsContainer>
      <FilterSection>
        <FilterButton 
          onClick={() => handleCategorySelect('artists')}
          isSelected={selectedCategory === 'artists'}
        >
          아티스트 포스트
        </FilterButton>
        <FilterButton 
          onClick={() => handleCategorySelect('recommended')}
          isSelected={selectedCategory === 'recommended'}
        >
          추천 포스트
        </FilterButton>
        <FilterButton 
          onClick={() => handleCategorySelect('users')}
          isSelected={selectedCategory === 'users'}
        >
          사용자
        </FilterButton>
      </FilterSection>
      <ResultsSection>
        {loading ? (
          <LoadingMessage>결과를 불러오는 중...</LoadingMessage>
        ) : (
          renderResults()
        )}
        {!loading && artistPosts.length === 0 && recommendedPosts.length === 0 && users.length === 0 && (
          <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
        )}
      </ResultsSection>
    </ResultsContainer>
  );
};

export default ResultsList;

const ResultsContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const FilterSection = styled.div`
  width: 200px;
  margin-right: 20px;
`;

const FilterButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${props => props.isSelected ? 'black' : '#f0f0f0'};
  color: ${props => props.isSelected ? 'white' : 'black'};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.isSelected ? 'black' : '#e0e0e0'};
  }
`;

const ResultsSection = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  width: 100%;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  width: 100%;
`;