import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import defaultProfileImage from '../assets/images/default-profile.png';
import playButtonIcon from '../assets/icons/play-button.png';
import pauseButtonIcon from '../assets/icons/stop-button.png'; // 일시정지 아이콘 추가

const PostCard = ({ post, onPlayPause, isPlaying }) => {
  const { _id, author } = post;
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleImageClick = (e) => {
    e.stopPropagation();
    if (firstAlbum && firstAlbum.videoId && onPlayPause) {
      onPlayPause(firstAlbum.videoId, _id); // 포스트 ID도 전달
    }
  };

  return (
    <Card onClick={() => navigate(`/posts/${_id}`)}>
      <CardHeader>
        <AuthorImage src={author.image || defaultProfileImage} alt={nickName} />
        <AuthorName>{nickName}</AuthorName>
      </CardHeader>
      <ImageContainer
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}>
        {firstAlbum && (
          <PostImage src={firstAlbum.coverUrl} alt={parsedTitle} />
        )}
        {/* Hover 상태이거나 재생 중일 때 일시정지 버튼으로 변경 */}
        {(isHovered || isPlaying) && (
          <PlayButton>
            <PlayButtonImage
              src={isPlaying ? pauseButtonIcon : playButtonIcon} // 재생 상태에 따라 아이콘 변경
              alt={isPlaying ? 'Pause' : 'Play'}
            />
          </PlayButton>
        )}
      </ImageContainer>
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
  width: 340px;
  height: 500px;
  margin: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease; // 트랜지션 추가

  &:hover {
    transform: translateY(-10px); // 약간 떠오르는 효과
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); // 그림자 강화
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const AuthorImage = styled.img`
  width: 30px;
  height: 30px;
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
  height: 300px;
  object-fit: cover;
  border: 1px solid #e0e0e0;
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
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex-grow: 1;
  word-break: break-word;
  max-height: 2.7em;
  line-height: 1.3em;
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PlayButtonImage = styled.img`
  width: 30px;
  height: 30px;
`;
