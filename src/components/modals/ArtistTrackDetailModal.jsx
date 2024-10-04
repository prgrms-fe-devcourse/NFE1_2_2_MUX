import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PreviousBtn from '../../assets/icons/Previous-Btn.png';
import NextBtn from '../../assets/icons/Next-Btn.png';
import PlayBtn from '../../assets/icons/play-button-2.png';
import StopBtn from '../../assets/icons/stop-button-2.png';
import LikeIcon from '../../assets/icons/Like.png';
import TrashBtn from '../../assets/icons/trash-button.png';
import CommentIcon from '../../assets/icons/Comment.png';

import {
  addLike,
  removeLike,
  addComment,
  deleteComment,
  getAuthUserData,
  getTrackDetails,
} from '../../utils/api.js';

const ArtistTrackDetailModal = ({
  track: initialTrack,
  onClose,
  onLikeUpdate,
  onTrackDelete,
}) => {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [track, setTrack] = useState(initialTrack);
  const [isDeleted, setIsDeleted] = useState(false);
  const [commentCount, setCommentCount] = useState(
    initialTrack.comments.length,
  );
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const token = localStorage.getItem('token');
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const fetchTrackDetails = useCallback(async () => {
    if (isDeleted) return;

    try {
      if (track && token) {
        const updatedTrack = await getTrackDetails(track._id, token);
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
  }, [track, token, isDeleted, onClose]);

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
    fetchTrackDetails();
  }, [token, fetchTrackDetails]);

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

  if (!track) return null;

  let trackData = JSON.parse(track.title);
  let authorData = JSON.parse(track.author.fullName);

  const { title, albums, description } = trackData;
  const authorNickname = authorData.nickName || '익명';
  const authorImage = track.author?.image || '/default-profile.png';

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
        await addLike(track._id, token);
      }

      const updatedTrack = await getTrackDetails(track._id, token);
      setTrack(updatedTrack);
      updateLikeStatus(updatedTrack);

      if (onLikeUpdate) {
        onLikeUpdate(track._id, !isLiked, updatedTrack.likes.length);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    }
  };

  const handleNextAlbum = () => {
    const nextIndex = (currentAlbumIndex + 1) % albums.length;
    setCurrentAlbumIndex(nextIndex);
    setIsPlaying(false);
  };

  const handlePrevAlbum = () => {
    const prevIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    setCurrentAlbumIndex(prevIndex);
    setIsPlaying(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!comment.trim() || !currentUser) return;
      const newComment = await addComment(track._id, comment, token);
      setComments((prevComments) => [newComment, ...prevComments]);
      setComment('');
      setCommentCount((prevCount) => prevCount + 1);
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
      setCommentCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글을 삭제할 수 없습니다. 다시 시도해 주세요.');
    }
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleAudioProgress = () => {
    const audio = audioRef.current;
    if (audio) {
      const progress = (audio.currentTime / audio.duration) * 100;
      setAudioProgress(progress);
      setCurrentTime(audio.currentTime);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (audio && progressBar) {
      const rect = progressBar.getBoundingClientRect();
      const seekPosition = (e.clientX - rect.left) / rect.width;
      audio.currentTime = seekPosition * audio.duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleDeleteTrack = async () => {
    if (window.confirm('정말로 이 음원을 삭제하시겠습니까?')) {
      try {
        if (onTrackDelete) {
          await onTrackDelete(track._id);
        }
        onClose();
      } catch (error) {
        console.error('음원 삭제 중 오류 발생:', error);
      }
    }
  };

  if (isDeleted) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>

        <Header>
          <AuthorImage src={authorImage} alt={authorNickname} />
          <HeaderText>
            <TrackTitle>{title || 'Untitled'}</TrackTitle>
            <AuthorName>{authorNickname}</AuthorName>
          </HeaderText>
        </Header>
        <Divider />

        <AlbumSection>
          <AlbumNavButton onClick={handlePrevAlbum}>
            <img src={PreviousBtn} alt="Previous" />
          </AlbumNavButton>
          <AlbumImageContainer onClick={handlePlayPause}>
            <AlbumImage
              src={albums[currentAlbumIndex]?.coverUrl}
              alt={albums[currentAlbumIndex]?.title}
            />
            <PlayOverlay $isPlaying={isPlaying}>
              <PlayPauseIcon
                src={isPlaying ? StopBtn : PlayBtn}
                alt={isPlaying ? 'Pause' : 'Play'}
              />
            </PlayOverlay>
          </AlbumImageContainer>
          <AlbumNavButton onClick={handleNextAlbum}>
            <img src={NextBtn} alt="Next" />
          </AlbumNavButton>
        </AlbumSection>

        <AudioControls>
          <ProgressBarContainer ref={progressBarRef} onClick={handleSeek}>
            <ProgressBarFill style={{ width: `${audioProgress}%` }} />
          </ProgressBarContainer>
          <TimeDisplay>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioDuration)}</span>
          </TimeDisplay>
        </AudioControls>

        <AlbumInfo>
          <AlbumTitle>{albums[currentAlbumIndex]?.title}</AlbumTitle>
          <AlbumArtist>{albums[currentAlbumIndex]?.artist}</AlbumArtist>
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
          src={albums[currentAlbumIndex]?.videoUrl}
          onTimeUpdate={handleAudioProgress}
          onLoadedMetadata={() => setAudioDuration(audioRef.current.duration)}
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

  @media (max-width: 768px) {
    width: 90%;
    height: 90vh;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
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
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e0e0e0;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const AlbumSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
`;

const AlbumNavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin: 0 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }

  &:hover {
    opacity: 0.7;
  }
`;

const AlbumImageContainer = styled.div`
  width: 250px;
  height: 250px;
  position: relative;
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AlbumInfo = styled.div`
  text-align: center;
  margin-bottom: 20px;
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

const AudioControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto 20px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #c0bfc3;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #3f3f44;
  border-radius: 4px;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  margin-bottom: 10px;
  color: #666;
`;

const DescriptionBox = styled.div`
  background-color: #c0afe2;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  width: 280px;
  max-height: 150px;
  overflow-y: auto;
  margin-left: auto;
  margin-right: auto;
`;

const Description = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  color: #fff;
  font-weight: bold;
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
