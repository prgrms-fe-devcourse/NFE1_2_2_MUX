import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getUsers, getPosts } from '../../utils/api';
import UserProfileCard from '../../components/UserProfile';
import PostCard from '../../components/PostCard';
import { ChevronRight } from 'lucide-react';

const CardSection = ({ title, cards, cardWidth }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = 4;
  const cardCount = cards.length;

  const nextCards = () => {
    setCurrentIndex((prevIndex) => 
      Math.min(prevIndex + 1, cardCount - visibleCards)
    );
  };

  const prevCards = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <Section>
      <Header>
        <Title>{title}</Title>
        <MoreButton>
          More <ChevronRight className="w-4 h-4 ml-1" />
        </MoreButton>
      </Header>
      <CardContainer>
        <PrevButton onClick={prevCards} disabled={currentIndex === 0}>
          ◀
        </PrevButton>
        <CardWrapper currentIndex={currentIndex} visibleCards={visibleCards}>
          {cards.map((card, index) => (
            <Card key={index} className={cardWidth}>
              {card}
            </Card>
          ))}
        </CardWrapper>
        <NextButton 
          onClick={nextCards} 
          disabled={currentIndex >= cardCount - visibleCards}
        >
          ▶
        </NextButton>
      </CardContainer>
    </Section>
  );
};

const MainPage = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedUsers, fetchedPosts] = await Promise.all([
          getUsers(),
          getPosts()
        ]);
        setUsers(fetchedUsers);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const artistCards = users.map((user) => (
    <UserProfileCard key={user._id} user={user} />
  ));

  const postCards = posts.map((post) => (
    <PostCard 
      key={post._id} 
      post={post} 
      onLikeUpdate={(postId, isLiked, newLikeCount) => {
        // Handle like update logic here
      }}
      onPostDelete={(postId) => {
        // Handle post delete logic here
      }}
    />
  ));

  return (
    <PageContainer>
      <CardSection 
        title="취향이 비슷한 유저가 있을지도 몰라요. 프로필을 눌러 확인해보세요!" 
        cards={artistCards}
        cardWidth="w-48"
      />
      <CardSection 
        title="사람들이 가장 공감하고 있는 노래는 무엇일까요?" 
        cards={postCards}
        cardWidth="w-64"
      />
      <Section>
        <Header>
          <Title>지금 가장 주목받고 있는 노래들은 무엇일까요?</Title>
          <MoreButton>
            More <ChevronRight className="w-4 h-4 ml-1" />
          </MoreButton>
        </Header>
        <AlbumCurationCard />
      </Section>
    </PageContainer>
  );
};

export default MainPage;

// Styled Components
const Section = styled.section`
  margin-bottom: 3rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 0.875rem;
  &:hover {
    color: #1f2937;
  }
`;

const CardContainer = styled.div`
  position: relative;
`;

const PrevButton = styled.button`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background-color: white;
  border-radius: 50%;
  padding: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  &:disabled {
    opacity: 0.5;
  }
`;

const NextButton = styled(PrevButton)`
  left: auto;
  right: 0;
`;

const CardWrapper = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
  transform: ${({ currentIndex, visibleCards }) => 
    `translateX(-${currentIndex * (100 / visibleCards)}%)`};
  overflow: hidden;
`;

const Card = styled.div`
  flex-shrink: 0;
`;

const PageContainer = styled.div`
  padding: 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;