import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PreviousBtn from '../../assets/icons/Previous-Btn.png';
import NextBtn from '../../assets/icons/Next-Btn.png';
import PlayBtn from '../../assets/icons/play-button-2.png';
import StopBtn from '../../assets/icons/stop-button-2.png';
import LikeIcon from '../../assets/icons/Like.png';
import TrashBtn from '../../assets/icons/trash-button.png';
import CommentIcon from '../../assets/icons/Comment.png';
import YouTube from 'react-youtube';

import {
  addLike,
  removeLike,
  addComment,
  deleteComment,
  getAuthUserData,
  getPostDetails,
  createNotification
} from '../../utils/api.js';

const PostDetailModal = ({
  post: initialPost,
  onClose,
  onLikeUpdate,
  onPostDelete,
  onCommentUpdate,
}) => {
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [post, setPost] = useState(initialPost);
  const [isDeleted, setIsDeleted] = useState(false);
  const [commentCount, setCommentCount] = useState(initialPost.comments.length);
  const token = localStorage.getItem('token');
  const playerRef = useRef(null);

  const fetchPostDetails = useCallback(async () => {
    if (isDeleted) return; // 게시글이 삭제되었다면 데이터를 가져오지 않음

    try {
      if (post && token) {
        const updatedPost = await getPostDetails(post._id, token);
        if (updatedPost) {
          setPost(updatedPost);
          updateLikeStatus(updatedPost);
        } else {
          setIsDeleted(true);
          onClose();
        }
      }
    } catch (error) {
      console.warn('Failed to fetch post details:', error);
      // 오류 발생 시 무시하고 계속 진행
    }
  }, [post, token, isDeleted, onClose]);

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
    fetchPostDetails();
  }, [token, fetchPostDetails]);

  const updateLikeStatus = useCallback(
    (updatedPost) => {
      if (currentUser) {
        const userLike = updatedPost.likes.find(
          (like) => like.user === currentUser._id,
        );
        setIsLiked(!!userLike);
        setLikeCount(updatedPost.likes.length);
      }
    },
    [currentUser],
  );

  if (!post) return null;

  let postData = { title: '', albums: [], description: '' };
  let authorData = { nickName: '익명' };

  try {
    postData = JSON.parse(post.title);
    authorData = JSON.parse(post.author.fullName);
  } catch (error) {
    console.error('데이터 파싱 에러:', error);
  }

  const { title, albums, description } = postData;
  const authorNickname = authorData.nickName || '익명';
  const authorImage = post.author?.image || '/default-profile.png';

  useEffect(() => {
    if (post) {
      const sortedComments = [...post.comments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setComments(sortedComments);
      // console.log('Sorted comments:', sortedComments);
    }
  }, [post]);

  const handleLike = async () => {
    try {
      // 즉시 UI 업데이트
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  
      if (isLiked) {
        const likeToRemove = post.likes.find(
          (like) => like.user === currentUser._id,
        );
        if (likeToRemove) {
          await removeLike(likeToRemove._id, token);
        }
      } else {
        const newLike = await addLike(post._id, token); 
        // 좋아요 클릭 시 알림 생성
        await createNotification('LIKE', newLike._id, post.author._id, newLike.post, token);
      }
  
      // 서버에서 최신 데이터 가져오기
      const updatedPost = await getPostDetails(post._id, token);
      setPost(updatedPost);
      updateLikeStatus(updatedPost);
  
      // 부모 컴포넌트에 좋아요 상태 변경을 알림
      if (onLikeUpdate) {
        onLikeUpdate(post._id, !isLiked, updatedPost.likes.length);
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류 발생:', error);
      alert('좋아요 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      // 오류 발생 시 원래 상태로 되돌리기
      setIsLiked(!isLiked);
      setLikeCount((prevCount) => (isLiked ? prevCount + 1 : prevCount - 1));
    }
  };

  const handleNextAlbum = () => {
    const nextIndex = (currentAlbumIndex + 1) % albums.length;
    setCurrentAlbumIndex(nextIndex);
    setCurrentVideoId(albums[nextIndex].videoId);
    setIsPlaying(false);
  };

  const handlePrevAlbum = () => {
    const prevIndex = (currentAlbumIndex - 1 + albums.length) % albums.length;
    setCurrentAlbumIndex(prevIndex);
    setCurrentVideoId(albums[prevIndex].videoId);
    setIsPlaying(false);
  };

  useEffect(() => {
    setComments(initialPost.comments);
    setCommentCount(initialPost.comments.length);
  }, [initialPost]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!comment.trim() || !currentUser) return;
      const newComment = await addComment(post._id, comment, token);
      setComments((prevComments) => [newComment, ...prevComments]);
      setComment('');
      setCommentCount((prevCount) => prevCount + 1); // 댓글 수 증가
  
      // 댓글 작성 시 알림 생성, newComment._id를 사용
      await createNotification('COMMENT', newComment._id, post.author._id, newComment.post, token);
      
      setCommentCount((prevCount) => {
        const newCount = prevCount + 1;
        if (onCommentUpdate) {
          onCommentUpdate(newCount); // postId 제거, 댓글 수만 전달
        }
        return newCount;
      });
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
          onCommentUpdate(newCount); // postId 제거, 댓글 수만 전달
        }
        return newCount;
      });
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글을 삭제할 수 없습니다. 다시 시도해 주세요.');
    }
  };

  const handlePlayPause = () => {
    const videoId = albums[currentAlbumIndex]?.videoId;
    if (!videoId) return;

    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.loadVideoById(videoId);
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStateChange = (event) => {
    if (event.data === YouTube.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (
      event.data === YouTube.PlayerState.PAUSED ||
      event.data === YouTube.PlayerState.ENDED
    ) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    setCurrentVideoId(albums[currentAlbumIndex]?.videoId);
  }, [currentAlbumIndex, albums]);

  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        if (onPostDelete) {
          await onPostDelete(post._id);
        }
        onClose();
      } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
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
            <PostTitle>{title || 'Untitled'}</PostTitle>
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

        <Pagination>
          {albums.map((_, index) => (
            <PaginationDot
              key={index}
              $active={index === currentAlbumIndex}
              onClick={() => {
                setCurrentAlbumIndex(index);
                setCurrentVideoId(albums[index].videoId);
                setIsPlaying(false);
              }}
            />
          ))}
        </Pagination>

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
          {currentUser && currentUser._id === post.author._id && (
            <DeleteButton onClick={handleDeletePost}>
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

          {comments.map((commentItem) => {
            /*
            console.log('Comment item:', commentItem);
            console.log('Comment author ID:', commentItem.author._id);
            console.log('Current user ID:', currentUser?._id);
            console.log(
              'Is author:',
              currentUser?._id === commentItem.author._id,
            );*/

            return (
              <CommentItem key={commentItem._id}>
                <AuthorImage
                  src={commentItem.author.image || '/default-profile.png'}
                  alt={
                    JSON.parse(commentItem.author.fullName)?.nickName || '익명'
                  }
                />
                <CommentContent>
                  <CommentAuthor>
                    {JSON.parse(commentItem.author.fullName)?.nickName ||
                      '익명'}
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
            );
          })}
        </CommentSection>

        <YouTube
          videoId={currentVideoId}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 0,
              controls: 0,
            },
          }}
          onReady={(event) => {
            playerRef.current = event.target;
          }}
          onStateChange={handleStateChange}
        />
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PostDetailModal;

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
  margin-left: 10px;
`;

const AlbumSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const AlbumNavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin: 0 40px;
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
  cursor: pointer;
`;

const AlbumImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  opacity: ${(props) => (props.$isPlaying ? 1 : 0)};
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const PaginationDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$active ? '#000' : '#ccc')};
  margin: 0 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
  margin: 20px;
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
  pointer-events: none;
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

const CommentSection = styled.div`
  margin-top: 20px;
  margin-left: 20px;
`;

const CommentForm = styled.form`
  display: flex;
  gap: 10px;
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
    background-color: #c86edf;
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
  font-weight: bold;
  color: black;
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

const CommentIconImg = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 5px;
`;

const Count = styled.span`
  font-weight: bold;
`;
