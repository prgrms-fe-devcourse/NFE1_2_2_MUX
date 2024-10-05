import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PlayBtn from '../../assets/icons/play-button-2.png';
import StopBtn from '../../assets/icons/stop-button-2.png';
import LikeIcon from '../../assets/icons/Like.png';
import TrashBtn from '../../assets/icons/trash-button.png';
import CommentIcon from '../../assets/icons/Comment.png';
import { useNavigate } from 'react-router-dom';

import {
  addLike,
  removeLike,
  addComment,
  deleteComment,
  getAuthUserData,
  getPostDetails,
  createNotification,
} from '../../utils/api.js';

const ArtistTrackDetailModal = ({
  track: initialTrack,
  onClose,
  onLikeUpdate,
  onTrackDelete,
  onCommentUpdate,
}) => {
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialTrack.likes.length);
  const [comments, setComments] = useState(initialTrack.comments);
  const [currentUser, setCurrentUser] = useState(null);
  const [track, setTrack] = useState(initialTrack);
  const [commentCount, setCommentCount] = useState(
    initialTrack.comments.length,
  );
  const [isDeleted, setIsDeleted] = useState(false);
  const token = localStorage.getItem('token');
  const audioRef = useRef(null);
  const navigate = useNavigate();

  const handleProfileClick = () => {
    onClose(); // 모달을 닫습니다.
    navigate(`/user/${track.author._id}`);
  };

  const updateLikeStatus = useCallback(
    (updatedTrack) => {
      if (currentUser) {
        const userLike = updatedTrack.likes.find(
          (like) => like.user === currentUser._id,
        );
        setIsLiked(!!userLike);
        setLikeCount(updatedTrack.likes.length);
      }
    },
    [currentUser],
  );

  const fetchTrackDetails = useCallback(() => {
    if (isDeleted) return;

    const fetchData = async () => {
      try {
        if (track && token) {
          const updatedTrack = await getPostDetails(track._id, token);
          if (updatedTrack) {
            setTrack(updatedTrack);
            updateLikeStatus(updatedTrack);
          } else {
            setIsDeleted(true);
            onClose();
          }
        }
      } catch (error) {
        console.warn('Failed to fetch track details:', error);
      }
    };

    fetchData();
  }, [track, token, isDeleted, onClose, updateLikeStatus]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (token) {
          const userData = await getAuthUserData(token);
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [token]);

  useEffect(() => {
    fetchTrackDetails();
  }, [fetchTrackDetails]);

  if (!track) return null;

  const parseTrackData = (track) => {
    let trackData = { title: '', albums: [], description: '' };
    let authorData = { nickName: '익명' };

    try {
      trackData = JSON.parse(track.title);
      authorData = JSON.parse(track.author.fullName);
    } catch (error) {
      console.error('데이터 파싱 에러:', error);
    }

    return {
      title: trackData.title,
      albums: trackData.albums,
      description: trackData.description,
      authorNickname: authorData.nickName || '익명',
      authorImage: track.author?.image || '/default-profile.png',
    };
  };

  if (!track) return null;
  if (isDeleted) return null;

  const { title, albums, description, authorNickname, authorImage } =
    parseTrackData(track);
  const album = albums[0]; // 단일 앨범 사용

  useEffect(() => {
    fetchTrackDetails();
  }, [fetchTrackDetails]);

  useEffect(() => {
    if (track) {
      const sortedComments = [...track.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setComments(sortedComments);
    }
  }, [track]);

  const handleLike = async () => {
    try {
      // 즉시 UI 업데이트
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));

      if (isLiked) {
        const likeToRemove = track.likes.find(
          (like) => like.user === currentUser._id,
        );
        if (likeToRemove) {
          await removeLike(likeToRemove._id, token);
        }
      } else {
        const newLike = await addLike(track._id, token);
        // 좋아요 클릭 시 알림 생성
        await createNotification(
          'LIKE',
          newLike._id,
          track.author._id,
          newLike.post,
          token,
        );
      }

      // 서버에서 최신 데이터 가져오기
      const updatedTrack = await getPostDetails(track._id, token);
      setTrack(updatedTrack);
      updateLikeStatus(updatedTrack);

      // 부모 컴포넌트에 좋아요 상태 변경을 알림
      if (onLikeUpdate) {
        onLikeUpdate(track._id, !isLiked, updatedTrack.likes.length);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      // 오류 발생 시 원래 상태로 되돌리기
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!comment.trim() || !currentUser) return;
      const newComment = await addComment(track._id, comment, token);
      setComments((prevComments) => [newComment, ...prevComments]);
      setComment('');
      setCommentCount((prevCount) => prevCount + 1);

      // 댓글 작성 시 알림 생성
      await createNotification(
        'COMMENT',
        newComment._id,
        track.author._id,
        newComment.post,
        token,
      );

      if (onCommentUpdate) {
        onCommentUpdate(commentCount + 1);
      }
    } catch (error) {
      console.error('댓글 작성 중 오류 발생:', error);
      alert('댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId, token);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId),
      );
      setCommentCount((prevCount) => {
        const newCount = prevCount - 1;
        if (onCommentUpdate) {
          onCommentUpdate(newCount);
        }
        return newCount;
      });
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글을 삭제할 수 없습니다. 다시 시도해 주세요.');
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);

      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('pause', handlePause);
      audioElement.addEventListener('ended', handleEnded);

      return () => {
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('pause', handlePause);
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  const handleDeleteTrack = async () => {
    if (window.confirm('정말로 이 트랙을 삭제하시겠습니까?')) {
      try {
        if (onTrackDelete) {
          await onTrackDelete(track._id);
        }
        onClose();
      } catch (error) {
        console.error('트랙 삭제 중 오류 발생:', error);
        alert('트랙을 삭제할 수 없습니다. 다시 시도해 주세요.');
      }
    }
  };

  if (isDeleted) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <Header>
          <AuthorImage
            src={authorImage}
            alt={authorNickname}
            onClick={(e) => {
              e.stopPropagation();
              handleProfileClick();
            }}
            style={{ cursor: 'pointer' }}
          />
          <HeaderText>
            <PostTitle>{title || 'Untitled'}</PostTitle>
            <AuthorName
              onClick={(e) => {
                e.stopPropagation();
                handleProfileClick();
              }}
              style={{ cursor: 'pointer' }}>
              {authorNickname}
            </AuthorName>
          </HeaderText>
        </Header>
        <Divider />

        <AlbumImageContainer onClick={handlePlayPause}>
          <AlbumImage src={album?.coverUrl} alt={album?.title} />
          <PlayOverlay $isPlaying={isPlaying}>
            <PlayPauseIcon
              src={isPlaying ? StopBtn : PlayBtn}
              alt={isPlaying ? 'Pause' : 'Play'}
            />
          </PlayOverlay>
        </AlbumImageContainer>

        <AlbumInfo>
          <AlbumTitle>{album?.title}</AlbumTitle>
          <AlbumArtist>{album?.artist}</AlbumArtist>
        </AlbumInfo>

        <DescriptionBox>
          <Description>{description || 'No description available'}</Description>
        </DescriptionBox>

        <Divider />

        <LikeSection>
          <InteractionGroup>
            <LikeButton onClick={handleLike}>
              <LikeIconImg src={LikeIcon} alt="Like" $isLiked={isLiked} />
              <Count>{likeCount}</Count>
            </LikeButton>
            <CommentDisplay>
              <CommentIconImg src={CommentIcon} alt="Comment" />
              <Count>{commentCount}</Count>
            </CommentDisplay>
          </InteractionGroup>
          {currentUser && currentUser._id === track.author._id && (
            <DeleteButton onClick={handleDeleteTrack}>
              <img src={TrashBtn} alt="Delete" />
            </DeleteButton>
          )}
        </LikeSection>

        <CommentSection>
          <CommentForm onSubmit={handleCommentSubmit}>
            <CommentInput
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <CommentSubmitButton type="submit">댓글 작성</CommentSubmitButton>
          </CommentForm>

          {comments.map((commentItem) => (
            <CommentItem key={commentItem._id}>
              <AuthorImage
                src={commentItem.author.image || '/default-profile.png'}
                alt={
                  JSON.parse(commentItem.author.fullName)?.nickName || '익명'
                }
              />
              <CommentContent>
                <CommentAuthor>
                  {JSON.parse(commentItem.author.fullName)?.nickName || '익명'}
                </CommentAuthor>
                <CommentText>{commentItem.comment}</CommentText>
              </CommentContent>
              {currentUser?._id === commentItem.author._id && (
                <DeleteButton
                  onClick={() => handleDeleteComment(commentItem._id)}>
                  🗑️
                </DeleteButton>
              )}
            </CommentItem>
          ))}
        </CommentSection>

        <audio
          ref={audioRef}
          src={album?.videoUrl}
          onEnded={() => setIsPlaying(false)}
        />
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ArtistTrackDetailModal;

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  width: 95%;
  max-width: 800px;
  height: 90vh;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }

  position: relative;

  /* 노트북 & 테블릿 가로 (해상도 1024px ~ 1279px) */
  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 90%;
    max-width: 750px;
  }

  /* 테블릿 가로 (해상도 768px ~ 1023px) */
  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 85%;
    max-width: 700px;
    height: 85vh;
  }

  /* 모바일 가로 & 테블릿 세로 (해상도 480px ~ 767px) */
  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 90%;
    height: 80vh;
    padding: 15px;
  }

  /* 모바일 세로 (해상도 ~ 479px) */
  @media all and (max-width: 479px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const AuthorImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid lightgray;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.h2`
  margin: 0;
  font-size: 18px;
`;

const AuthorName = styled.span`
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #444;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const AlbumImageContainer = styled.div`
  width: 250px;
  height: 250px;
  position: relative;
  cursor: pointer;
  margin: 30px auto; // 상하 마진을 30px로 설정
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AlbumInfo = styled.div`
  text-align: center;
  margin-top: 30px; // 상단 마진 추가
  margin-bottom: 30px; // 20px에서 30px로 증가
`;

const AlbumTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const AlbumArtist = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #666;
`;

const DescriptionBox = styled.div`
  background-color: #c0afe2;
  border-radius: 10px;
  padding: 15px;
  margin-top: 30px;
  margin-bottom: 30px;
  width: 90%;
  max-width: 400px;
  max-height: 200px;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  text-align: left;
  color: #fff;
  font-weight: bold;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;
`;

const LikeSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

const InteractionGroup = styled.div`
  display: flex;
  align-items: center;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  margin-right: 10px;
`;

const CommentDisplay = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  font-size: 14px;
`;

const LikeIconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
  filter: ${(props) =>
    props.$isLiked
      ? 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
      : 'none'};
  transition: filter 0.3s ease;
`;

const CommentIconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const Count = styled.span`
  font-weight: bold;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &:hover img {
    transform: scale(1.1);
  }
`;

const CommentSection = styled.div`
  margin-top: 20px;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const CommentInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
`;

const CommentSubmitButton = styled.button`
  padding: 8px 15px;
  background-color: #c0afe2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #a08fd1;
  }
`;

const CommentItem = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const CommentContent = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  font-size: 12px;
  color: grey;
  margin-bottom: 5px;
`;

const CommentText = styled.p`
  margin: 0;
  font-size: 14px;
  color: black;
`;

const PlayOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;

  ${AlbumImageContainer}:hover & {
    opacity: 1;
  }
`;

const PlayPauseIcon = styled.img`
  width: 50px;
  height: 50px;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;
