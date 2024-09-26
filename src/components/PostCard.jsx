import React from "react";
import styled from "styled-components";
import Example from '../assets/images/example.png'; // 예시 이미지 경로

// PostCard 컴포넌트
const PostCard = ({ post }) => {
  const { image, title, author, comments } = post;
  //api에서 받아올 post 정보

  // 본문 내용이 없는 경우
  const content = comments.length > 0 ? comments[0].text : "";

  return (
    <Card>
      {/* 이미지가 있는 경우에만 PostImage 렌더링 */}
      {image && <PostImage src={Example} alt={title} />}
      <PostTitle>{title}</PostTitle> {/* 포스트 제목 */}
      <PostAuthor>{author.name}</PostAuthor> {/* 저자 이름 */}
      <PostContent>{content}</PostContent> {/* 본문 내용 */}
    </Card>
  );
};

// PostList 컴포넌트
const PostList = ({ posts }) => {
  return (
    <PostContainer>
      {/* 포스트 데이터를 기반으로 PostCard 렌더링 */}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </PostContainer>
  );
};

// 테스트를 위한 App 컴포넌트
const App = () => {
  // 예시 포스트 데이터
  const posts = [
    {
      _id: "1",
      image: "https://example.com/image1.jpg",
      title: "추천 음악 1",
      author: { name: "작성자 A" },
      comments: [{ text: "이 음악 정말 좋아요! 이 음악 정말 좋아요! 이 음악 정말 좋아요! 이 음악 정말 좋아요! 이 음악 정말 좋아요! 이 음악 정말 좋아요!" }],
    },
    {
      _id: "2",
      image: "https://example.com/image2.jpg",
      title: "추천 음악 2",
      author: { name: "작성자 B" },
      comments: [{ text: "이 곡을 꼭 들어보세요!" }],
    },
  ];

  return (
    <div>
      <h1>포스트 카드</h1> {/* 페이지 제목 */}
      <PostList posts={posts} /> {/* 포스트 리스트 렌더링 */}
    </div>
  );
};

export default App;

// Styled Components
const Card = styled.div`
  width: 250px; /* 카드 너비 */
  margin: 10px 0; /* 상하 여백 조정 */
  border-radius: 0px; /* 카드 모서리 둥글기 */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  background-color: #fff; /* 카드 배경색 */
  display: flex; /* Flexbox 사용 */
  flex-direction: column; /* 세로 방향으로 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
`;

const PostImage = styled.img`
  width: 100%; /* 이미지 너비 100% */
  height: 210px; /* 이미지 높이 */
  object-fit: cover; /* 이미지 비율 유지 */
  border-radius: 0px; /* 이미지 모서리 둥글기 */
`;

const PostTitle = styled.h2`
  font-size: 1.2em; /* 제목 폰트 크기 */
  margin: 5px; /* 제목 위아래 여백 감소 */
`;

const PostAuthor = styled.p`
  color: #555; /* 저자 이름 색상 */
  font-size: 0.8em; /* 저자 이름 폰트 크기 */
  margin: 5px; /* 저자 위아래 여백 감소 */
`;

const PostContent = styled.p`
  font-size: 0.8em; /* 본문 내용 폰트 크기 */
  color: #333; /* 본문 내용 색상 */
  overflow: hidden; /* 넘치는 내용 숨김 */
  margin: 5px; /* 내용 위아래 여백 감소 */
  text-overflow: ellipsis; /* 넘치는 내용 생략 표시 */
  display: -webkit-box; /* Flexbox 사용 */
  -webkit-line-clamp: 2; /* 본문을 2줄로 제한 */
  -webkit-box-orient: vertical; /* 세로 방향 정렬 */
`;

const PostContainer = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-wrap: wrap; /* 줄 바꿈 허용 */
  justify-content: center; /* 중앙 정렬 */
  gap: 20px; /* 카드 간 간격 */
`;