import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import defaultProfileImage from '../assets/images/default-profile.png';

const PostCard = ({ post }) => {
  const { _id, author } = post;
  const navigate = useNavigate();

  let parsedTitle, albums, description, nickName;
  try {
    const titleObject = JSON.parse(post.title);
    parsedTitle = titleObject.title;
    albums = titleObject.albums;
    description = titleObject.description;

    const authorInfo = JSON.parse(author.fullName);
    nickName = authorInfo.nickName || '익명';
  } catch (error) {
    console.error('JSON 파싱 에러:', error);
    parsedTitle = '제목 없음';
    albums = [];
    description = '';
    nickName = '익명';
  }

  const firstAlbum = albums && albums.length > 0 ? albums[0] : null;

  return (
    <Card onClick={() => navigate(`/posts/${_id}`)}>
      <CardHeader>
        <AuthorImage src={author.image || defaultProfileImage} alt={nickName} />
        <AuthorName>{nickName}</AuthorName>
      </CardHeader>
      {firstAlbum && <PostImage src={firstAlbum.coverUrl} alt={parsedTitle} />}
      <CardContent>
        <PostTitle>{parsedTitle}</PostTitle>
        <PostDescription>{description}</PostDescription>
      </CardContent>
    </Card>
  );
};

export default PostCard;

// Styled Components
const Card = styled.div`
  width: 300px;
  height: 400px;
  margin: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #e0e0e0; // 얇은 회색 테두리 추가
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
`;

const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const AuthorName = styled.p`
  color: #333;
  font-size: 0.9em;
  font-weight: bold;
  margin: 0;
  transform: translateY(-1px);
`;

const PostImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h2`
  font-size: 1.1em;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PostDescription = styled.p`
  font-size: 0.9em;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; // 최대 2줄로 제한
  -webkit-box-orient: vertical;
  flex-grow: 1;
  word-break: break-word; // 긴 단어가 있을 경우 줄바꿈
  max-height: 2.7em; // 대략 2줄의 높이
  line-height: 1.3em; // 줄 간격 설정
`;
