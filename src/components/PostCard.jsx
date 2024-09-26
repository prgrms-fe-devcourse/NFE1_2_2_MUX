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

