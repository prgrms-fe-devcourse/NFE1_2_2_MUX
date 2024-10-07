import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { searchArtistPosts, searchRecommendedPosts, searchUsers } from '../../utils/api';
import ResultsList from './ResultsList';

const SearchPage = () => {
  const [artistPosts, setArtistPosts] = useState([]);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q') || '';
  const token = localStorage.getItem('token');

  const fetchResults = useCallback(async () => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    console.log("Query being sent to API:", query);
    console.log("Token being used:", token);

    try {
      const [artistResults, recommendedResults, userResults] = await Promise.all([
        searchArtistPosts(query, token),
        searchRecommendedPosts(query, token),
        searchUsers(query, token)
      ]);

      console.log("Artist Posts results:", artistResults);
      console.log("Recommended Posts results:", recommendedResults);
      console.log("User results:", userResults);

      // 개선된 필터링 로직
      const filterByQuery = (item) => {
        const lowerQuery = query.toLowerCase();
        return Object.values(item).some(value => 
          typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
        );
      };

      const filteredArtistPosts = artistResults.filter(filterByQuery);
      const filteredRecommendedPosts = recommendedResults.filter(filterByQuery);
      const filteredUsers = userResults.filter(filterByQuery);

      setArtistPosts(filteredArtistPosts);
      setRecommendedPosts(filteredRecommendedPosts);
      setUsers(filteredUsers);

      // 필터링된 결과 로깅
      console.log("Filtered Artist Posts:", filteredArtistPosts);
      console.log("Filtered Recommended Posts:", filteredRecommendedPosts);
      console.log("Filtered Users:", filteredUsers);

    } catch (err) {
      console.error('Error fetching search results:', err);
      setError('검색 결과를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  }, [query, token]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleUserClick = useCallback((userId) => {
    navigate(`/user/${userId}`);
  }, [navigate]);

  return (
    <SearchPageContainer>
      <h1>"{query}"에 대한 검색 결과</h1>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <ResultsList
        artistPosts={artistPosts}
        recommendedPosts={recommendedPosts}
        users={users}
        loading={loading}
        onUserClick={handleUserClick}
      />
      {!loading && artistPosts.length === 0 && recommendedPosts.length === 0 && users.length === 0 && (
        <NoResultsMessage>검색 결과가 없습니다.</NoResultsMessage>
      )}
    </SearchPageContainer>
  );
};

export default SearchPage;

const SearchPageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  text-align: center;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 40px;
`;