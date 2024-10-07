import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import defaultProfileImage from '../assets/images/default-profile.png';
import ReactionCount from '../components/ReactionCount';
import ArtistTrackDetailModal from './modals/ArtistTrackDetailModal';
import { getPostDetails } from '../utils/api';

const HorizontalArtistCard = ({
  post,
  onLikeUpdate,
  onPostDelete,
  isAuthor,
  currentUser,
}) => {
  if (!post || !post.author) {
    return null;
  }

  const { author } = post;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState(post.likes ? post.likes.length : 0);
  const [comments, setComments] = useState(
    post.comments ? post.comments.length : 0,
  );
  const navigate = useNavigate();

  let parsedTitle, albums, nickName;
  try {
    const titleObject = JSON.parse(post.title);
    parsedTitle = titleObject.title;
    albums = titleObject.albums;

    const authorInfo = JSON.parse(author.fullName);
    nickName = authorInfo.nickName || '익명';
  } catch (error) {
    console.error('JSON 파싱 에러:', error);
    parsedTitle = '제목 없음';
    albums = [];
    nickName = '익명';
  }

  const firstAlbum = albums && albums.length > 0 ? albums[0] : null;

  const handleCardClick = async () => {
    try {
      const postDetails = await getPostDetails(post._id);
      if (postDetails) {
        setSelectedPost(postDetails);
        setIsModalOpen(true);
      } else {
        throw new Error('포스트 정보를 가져오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('포스트 상세 정보를 가져오는데 실패했습니다:', error);
      alert(
        '포스트 정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleLikeUpdate = (postId, isLiked, newLikeCount) => {
    setLikes(newLikeCount);
    if (onLikeUpdate) {
      onLikeUpdate(postId, isLiked, newLikeCount);
    }
  };

  const handleCommentUpdate = (newCommentCount) => {
    setComments(newCommentCount);
  };

  const handleTrackDelete = async (postId) => {
    if (onTrackDelete) {
      await onTrackDelete(postId);
    }
    handleCloseModal();
  };

  return (
    <>
      <CardContainer onClick={handleCardClick}>
        <AlbumImageContainer>
          <AlbumImage
            src={firstAlbum ? firstAlbum.coverUrl : 'default-image-url'}
            alt={parsedTitle}
          />
        </AlbumImageContainer>
        <ContentContainer>
          <SongTitle>{parsedTitle}</SongTitle>
          <ArtistName>{nickName}</ArtistName>
        </ContentContainer>
        <ReactionContainer>
          <ReactionCount likes={likes} comments={comments} />
        </ReactionContainer>
      </CardContainer>
      {isModalOpen && selectedPost && (
        <ArtistTrackDetailModal
          track={selectedPost}
          onClose={handleCloseModal}
          onLikeUpdate={onLikeUpdate}
          onTrackDelete={onPostDelete}
          onCommentUpdate={handleCommentUpdate}
          isAuthor={isAuthor}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default HorizontalArtistCard;

// Styled Components
const CardContainer = styled.div`
  display: flex;
  align-items: center;
  width: 400px;
  height: 80px;
  background-color: #ddd5f3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`;

const AlbumImageContainer = styled.div`
  width: 80px;
  height: 80px;
  flex-shrink: 0; // 이미지 컨테이너가 줄어들지 않도록 설정
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 0 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start; // 왼쪽 정렬
`;

const SongTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; // 최대 너비 설정
`;

const ArtistName = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%; // 최대 너비 설정
`;

const ReactionContainer = styled.div`
  padding: 0 15px;
  flex-shrink: 0; // 반응 컨테이너가 줄어들지 않도록 설정
`;
