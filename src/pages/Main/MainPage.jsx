import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { getUsers, getPosts } from '../../utils/api';
import UserProfile from '../../components/UserProfile';
import PostCard from '../../components/PostCard';
import AlbumCurationCard from '../../components/CurationCard';
import LeftButton from '../../assets/icons/LeftButton.png';
import RightButton from '../../assets/icons/RightButton.png';

const CardSection = ({ cards, cardWidth, isUserProfile = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCards = isUserProfile ? 5 : 4;

  const nextCards = () => {
    setCurrentIndex((prevIndex) => 
      Math.min(prevIndex + 1, cards.length - visibleCards)
    );
  };

  const prevCards = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <CardContainerWrapper isUserProfile={isUserProfile}>
      <PrevButton onClick={prevCards} disabled={currentIndex === 0}>
        <img src={LeftButton} alt="Previous" />
      </PrevButton>
      <CardContainer>
        <CardWrapper currentIndex={currentIndex} visibleCards={visibleCards}>
          {cards.map((card, index) => (
            <Card key={index} className={cardWidth} isUserProfile={isUserProfile}>
              {card}
            </Card>
          ))}
        </CardWrapper>
      </CardContainer>
      <NextButton 
        onClick={nextCards} 
        disabled={currentIndex >= cards.length - visibleCards}
      >
        <img src={RightButton} alt="Next" />
      </NextButton>
    </CardContainerWrapper>
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
        
        const sortedUsers = fetchedUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setUsers(sortedUsers.slice(0, 10));

        const sortedPosts = fetchedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  const artistCards = users.map((user) => (
    <UserProfile key={user._id} user={user} />
  ));

  const postCards = posts.map((post) => (
    <PostCard key={post._id} post={post} />
  ));

  return (
    <PageContainer>
      <Section>
        <SectionHeader>
          <Title>지금 가장 핫한 아티스트의 음원을 확인해 보세요!</Title>
          <MoreLink>More <img src={RightButton} alt="More" style={{ width: '16px', height: '16px', marginLeft: '4px' }} /></MoreLink>
        </SectionHeader>
        <Underline />
        <CardSection 
          cards={artistCards}
          cardWidth="w-40"
          isUserProfile={true}
        />
      </Section>

      <Section>
        <SectionHeader>
          <Title>많은 사람들이 공감하는 노래는 무엇일까요?</Title>
          <MoreLink as={Link} to="/postfeed">More <img src={RightButton} alt="More" style={{ width: '16px', height: '16px', marginLeft: '4px' }} /></MoreLink>
        </SectionHeader>
        <Underline />
        <CardSection 
          cards={postCards}
          cardWidth="w-64"
        />
      </Section>

      <Section>
        <SectionHeader>
          <Title>세계에서 주목받고 있는 음악을 만나보세요!</Title>
        </SectionHeader>
        <Underline />
        <AlbumCurationCard />
      </Section>
    </PageContainer>
  );
};

export default MainPage;

// Styled Components
const PageContainer = styled.div`
  padding: 20px;
  min-width: 1024px;
  max-width: 1279px;
  min-height: 100vh;
  display: flex;
  flex-direction: column; 

@media all and (min-width: 1024px) and (max-width: 1279px) {
  padding: 18px;
}

@media all and (min-width: 768px) and (max-width: 1023px) {
  padding: 16px;
}

@media all and (min-width: 480px) and (max-width: 767px) {
  padding: 14px;
}
`;

const Section = styled.section`
  margin-bottom: 40px;
  @media all and (min-width: 1024px) and (max-width: 1279px) {
    margin-bottom: 45px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    margin-bottom: 40px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    margin-bottom: 35px;
  }
`;

const SectionHeader = styled.div`
margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.15rem;
  font-weight: 600;
`;

const Underline = styled.div`
  color: black;
  margin-top: -23px;
  margin-bottom: 2rem;
  font-size: 1.15rem;
  text-align: left;
  display: inline-block;
  border-bottom: 2.8px solid black;
  padding-bottom: 10px;
  font-weight: 600;
  width: 400px;
`;

const MoreLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #6b7280;
  font-size: 1.1rem;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CardContainerWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: ${props => props.isUserProfile ? '1rem' : '1rem'};
  margin-bottom: 1rem;
`;

const CardContainer = styled.div`
  overflow: hidden;
  width: 100%;
`;

const PrevButton = styled.button`
  position: absolute;
  left: -40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  img {
    width: 50px;
    height: 50px;
  }
`;

const NextButton = styled(PrevButton)`
  left: auto;
  right: -40px;
`;

const CardWrapper = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
  transform: ${({ currentIndex, visibleCards }) => 
    `translateX(-${currentIndex * (100 / visibleCards)}%)`};
    margin-bottom: 1rem;
`;

const Card = styled.div`
  flex: 0 0 ${props => props.isUserProfile ? (100 / 5) : (100 / 4)}%;
  max-width: ${props => props.isUserProfile ? (100 / 5) : (100 / 4)}%;
  padding: 0 10px;
  box-sizing: border-box;
`;