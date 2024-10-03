import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ImageChangeIcon from '../../assets/icons/image-change.png';
import playButtonIcon from '../../assets/icons/play-button.png';
import stopButtonIcon from '../../assets/icons/stop-button.png';
import defaultAlbumImage from '../../assets/images/default-album.png';
import { createTrack, getUserData } from '../../utils/api';
import { uploadToS3 } from '../../utils/s3';
import { v4 as uuidv4 } from 'uuid';

const TrackUpload = ({ onTrackSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showUploadedContent, setShowUploadedContent] = useState(false);
  const [selectedAlbumImage, setSelectedAlbumImage] =
    useState(defaultAlbumImage);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(defaultAlbumImage);
  const [songTitle, setSongTitle] = useState('');
  const [songDescription, setSongDescription] = useState('');
  const [audioErrorMessage, setAudioErrorMessage] = useState('');
  const [imageErrorMessage, setImageErrorMessage] = useState('');
  const [ErrorMessage, setErrorMessage] = useState('');
  const [artistName, setArtistName] = useState('');

  const maxTitleCharLimit = 20;
  const maxDescriptionCharLimit = 100;

  const MAX_FILE_SIZE = 4 * 1024 * 1024 * 1024;
  const SUPPORTED_AUDIO_FORMATS = [
    'audio/wav',
    'audio/flac',
    'audio/aiff',
    'audio/alac',
    'audio/ogg',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp2',
    'audio/aac',
    'audio/amr',
    'audio/wma',
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let interval = null;
    if (uploadProgress < 100 && selectedFile) {
      interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
            setUploadComplete(true);
            return 100;
          }
          return newProgress;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [uploadProgress, selectedFile]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current && !isDragging) {
        const { currentTime, duration } = audioRef.current;
        setCurrentTime(currentTime);
        setAudioProgress((currentTime / duration) * 100);
        setAudioDuration(duration);
      }
    };

    if (isPlaying) {
      intervalRef.current = setInterval(updateProgress, 1000);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isPlaying, isDragging]);

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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!SUPPORTED_AUDIO_FORMATS.includes(file.type)) {
        setAudioErrorMessage('지원되는 음원 형식이 아닙니다.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setAudioErrorMessage('파일 크기는 최대 4GB까지 허용됩니다.');
        return;
      }

      setSelectedFile(file);
      setUploadProgress(0);
      setUploadComplete(false);
      setAudioErrorMessage('');
    }
  };

  const handleAlbumCoverChange = (event) => {
    const file = event.target.files[0];
    const SUPPORTED_FORMATS = ['image/jpeg', 'image/png'];
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      setImageErrorMessage('지원되는 이미지 형식은 JPEG 및 PNG입니다.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setImageErrorMessage('이미지 파일 크기는 최대 5MB까지 허용됩니다.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedAlbumImage(file);
    setImagePreviewUrl(previewUrl);
    setImageErrorMessage('');
  };

  const handleAlbumCoverDelete = () => {
    if (selectedAlbumImage === defaultAlbumImage) {
      return;
    }

    const confirmDelete = window.confirm('앨범 이미지를 삭제하시겠습니까?');
    if (confirmDelete) {
      setSelectedAlbumImage(defaultAlbumImage);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [file] } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleNextStep = () => {
    setShowUploadedContent(true);
  };

  const handlePrevStep = () => {
    setShowUploadedContent(false);
    setSelectedFile(null);
    setImagePreviewUrl(defaultAlbumImage);
    setSelectedAlbumImage(defaultAlbumImage);
    setSongTitle('');
    setSongDescription('');
    setUploadProgress(0);
    setUploadComplete(false);
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioDuration(0);
    setCurrentTime(0);
    setAudioErrorMessage('');
    setImageErrorMessage('');
  };

  useEffect(() => {
    const fetchUserNickname = async () => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      if (userData && token) {
        try {
          const user = await getUserData(userData.id || userData._id, token);
          const fullNameData = JSON.parse(user.fullName);
          const nickName = fullNameData.nickName;

          setArtistName(nickName);
        } catch (error) {
          console.error('Failed to fetch user nickname:', error);
          setErrorMessage('User data could not be loaded.');
        }
      }
    };

    fetchUserNickname();
  }, []);

  const handlePostSubmit = async () => {
    setErrorMessage('');

    if (selectedAlbumImage === defaultAlbumImage) {
      setErrorMessage('앨범 이미지를 선택해 주세요.');
      return;
    }

    if (!songTitle.trim()) {
      setErrorMessage('앨범 제목을 입력해 주세요.');
      return;
    }

    if (!songDescription.trim()) {
      setErrorMessage('음원을 소개해 주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }
    try {
      const imageUrl = await uploadToS3(selectedAlbumImage);
      const audioUrl = await uploadToS3(selectedFile); // 음원 파일 업로드

      const generatedVideoId = uuidv4();
      const trackData = {
        title: songTitle,
        albums: [
          {
            title: songTitle,
            artist: artistName,
            coverUrl: imageUrl,
            videoId: generatedVideoId,
            videoUrl: audioUrl,
          },
        ],
        description: songDescription,
      };

      const formData = new FormData();
      formData.append('title', JSON.stringify(trackData));
      formData.append('channelId', '66fb53f9ed2d3c14a64eb9ea');

      const response = await createTrack(formData, token);
      console.log('Track uploaded successfully:', response);

      alert('음원이 성공적으로 업로드되었습니다!');

      // 업로드 후 상태 초기화
      setShowUploadedContent(false);
      setSelectedFile(null);
      setImagePreviewUrl(defaultAlbumImage);
      setSelectedAlbumImage(defaultAlbumImage);
      setSongTitle('');
      setSongDescription('');
      setUploadProgress(0);
      setUploadComplete(false);
      setIsPlaying(false);
      setAudioProgress(0);
      setAudioDuration(0);
      setCurrentTime(0);
      setAudioErrorMessage('');
      setImageErrorMessage('');

      if (typeof onTrackSuccess === 'function') {
        onTrackSuccess(response);
      }
    } catch (error) {
      console.error('음원 업로드 실패:', error);
      setErrorMessage(
        error.response?.data?.message || '음원 업로드에 실패했습니다.',
      );
    }
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
    handleSeek(event);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      handleSeek(event);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAudioEnd = () => {
    setIsPlaying(false);
  };

  const handleSeek = (event) => {
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const seekTime = Math.min(
      (offsetX / rect.width) * audioDuration,
      audioDuration,
    );
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    setAudioProgress((seekTime / audioDuration) * 100);
  };

  return (
    <TrackUploadContent>
      {showUploadedContent ? (
        <UploadedContent>
          <LeftSection>
            <AlbumSection>
              <AlbumCover onClick={handleAlbumCoverDelete}>
                <img
                  src={imagePreviewUrl || defaultAlbumImage}
                  alt="앨범 이미지"
                />
              </AlbumCover>
              <CoverChangeContainer
                onClick={() =>
                  document.getElementById('albumImageUpload').click()
                }>
                <CoverChangeText>앨범 이미지 변경</CoverChangeText>
                <ChangeIcon src={ImageChangeIcon} alt="Change Icon" />
              </CoverChangeContainer>
              <input
                id="albumImageUpload"
                type="file"
                accept="image/*"
                onChange={handleAlbumCoverChange}
                style={{ display: 'none' }}
              />
              {imageErrorMessage && (
                <ImageErrorText>{imageErrorMessage}</ImageErrorText>
              )}
              <ImageInfoText>
                지원 파일 형식: JPEG, PNG (최대 5MB)
              </ImageInfoText>
            </AlbumSection>

            <AudioControls>
              <ProgressBarContainer
                ref={progressBarRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}>
                <ProgressBarFill style={{ width: `${audioProgress}%` }} />
                <ProgressCircle style={{ left: `${audioProgress}%` }} />
              </ProgressBarContainer>
              <TimeDisplay>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(audioDuration)}</span>
              </TimeDisplay>
              <PlayPauseButton onClick={handlePlayPause}>
                <img
                  src={isPlaying ? stopButtonIcon : playButtonIcon}
                  alt="Play/Pause Button"
                />
              </PlayPauseButton>
              <AudioPlayer
                ref={audioRef}
                onLoadedMetadata={() =>
                  setAudioDuration(audioRef.current.duration)
                }
                onEnded={handleAudioEnd}
                controls>
                <source
                  src={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                  type={selectedFile ? selectedFile.type : ''}
                />
                브라우저에서 오디오를 재생할 수 없습니다.
              </AudioPlayer>
            </AudioControls>
          </LeftSection>

          <RightSection>
            <TitleField>
              <TitleLabel>음원 제목</TitleLabel>
              <TextInput
                type="text"
                placeholder="제목을 입력해주세요"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                maxLength={maxTitleCharLimit}
              />
              <TitleCharCount>
                {songTitle.length}/{maxTitleCharLimit}자
              </TitleCharCount>
            </TitleField>

            <InputField>
              <InputLabel>음원 소개</InputLabel>
              <InputArea
                value={songDescription}
                placeholder="소개를 입력해주세요"
                onChange={(e) => setSongDescription(e.target.value)}
                maxLength={maxDescriptionCharLimit}
              />
              <CharCount>
                {songDescription.length}/{maxDescriptionCharLimit}자
              </CharCount>
            </InputField>
          </RightSection>

          <ButtonContainer>
            <PrevButton onClick={handlePrevStep}>이전</PrevButton>
            {ErrorMessage && <ErrorText>{ErrorMessage}</ErrorText>}
            <PostButton onClick={handlePostSubmit}>게시하기</PostButton>
          </ButtonContainer>
        </UploadedContent>
      ) : uploadComplete ? (
        <CompletedSection>
          <SuccessMessage>
            업로드 완료!
            <br />
            다음 단계로 이동하여 추가 정보를 입력해주세요.
          </SuccessMessage>
          <NextButton onClick={handleNextStep}>다음</NextButton>
        </CompletedSection>
      ) : (
        <UploadArea onDrop={handleDrop} onDragOver={handleDragOver}>
          {selectedFile && uploadProgress > 0 ? (
            <ProgressContainer>
              <ProgressBar progress={uploadProgress} />
              <ProgressText>{uploadProgress}%</ProgressText>
            </ProgressContainer>
          ) : (
            <>
              <MainText>당신의 음원을 드래그 후, 드롭하여 주세요.</MainText>
              <UploadButton htmlFor="fileUpload">
                또는 이 버튼을 클릭하여 음원을 선택해주세요.
              </UploadButton>
              <input
                id="fileUpload"
                type="file"
                accept={SUPPORTED_AUDIO_FORMATS.join(',')}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <AudioInfoText>
                지원 파일 형식: WAV, FLAC, AIFF, ALAC, OGG, MP2, MP3, AAC, AMR,
                and WMA (최대 4GB)
              </AudioInfoText>
            </>
          )}
          {audioErrorMessage && (
            <AudioErrorText>{audioErrorMessage}</AudioErrorText>
          )}
        </UploadArea>
      )}
    </TrackUploadContent>
  );
};

export default TrackUpload;

// Styled components

const TrackUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  caret-color: transparent;
`;

const UploadedContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 90%;
  padding: 10px;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 36%;
`;

const AlbumSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const AlbumCover = styled.div`
  img {
    width: 260px;
    height: 260px;
    border-radius: 10px;
    object-fit: cover;
  }
`;

const CoverChangeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: -3px;
  cursor: pointer;
  justify-content: center;
`;

const CoverChangeText = styled.p`
  color: gray;
  font-size: 20px;
  margin-top: 0px;
  margin-right: 5px;
`;

const ChangeIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-top: -18px;
`;

const ImageErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -15px;
`;

const ImageInfoText = styled.p`
  color: gray;
  font-size: 12px;
  margin-top: -10px;
`;

const AudioControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin-top: -10px;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #c0bfc3;
  border-radius: 1px;
  margin-bottom: 10px;
  cursor: pointer;
  position: relative;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #3f3f44;
  border-radius: 5px;
`;

const ProgressCircle = styled.div`
  width: 15px;
  height: 15px;
  background-color: #3f3f44;
  border-radius: 50%;
  position: absolute;
  top: -4px;
  transform: translateX(-50%);
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  margin-bottom: 0;
  color: #666;
`;

const PlayPauseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-top: -5px;
  img {
    width: 40px;
    height: 40px;
  }
`;

const AudioPlayer = styled.audio`
  width: 80%;
  margin: 0;
  display: none;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 55%;
`;

const TitleField = styled.div`
  width: 100%;
  background-color: #c0afe2;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  flex-direction: row;
`;

const TitleLabel = styled.span`
  color: white;
  font-size: 17px;
  font-weight: bold;
`;

const TextInput = styled.input`
  padding: 5px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  margin-left: 10px;
  background-color: #c0afe2;
  color: white;

  &::placeholder {
    color: white;
  }
`;

const TitleCharCount = styled.p`
  position: absolute;
  right: 30px;
  top: 99px;
  font-size: 12px;
  color: white;
`;

const InputField = styled.div`
  width: 100%;
  background-color: #c0afe2;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
`;

const InputLabel = styled.span`
  color: white;
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 5px;
  padding-bottom: 10px;
  border-bottom: 1px solid white;
`;

const InputArea = styled.textarea`
  padding: 10px;
  padding-bottom: 55px;
  font-size: 15px;
  border: none;
  border-radius: 5px;
  background-color: #c0afe2;
  color: white;
  height: 200px;
  resize: none;

  &::placeholder {
    color: white;
  }
`;

const CharCount = styled.p`
  font-size: 12px;
  color: white;
  text-align: right;
  margin-top: -25px;
  margin-right: 10px;
`;

const ButtonContainer = styled.div`
  width: 95%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const PrevButton = styled.button`
  padding: 3px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 15px;
  margin-bottom: 10px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 15px;
  margin-top: 4px;
  margin-left: 15px;
`;

const PostButton = styled.button`
  padding: 3px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  margin-bottom: 10px;
`;

const CompletedSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #c0afe2;
  width: 95%;
  height: 80%;
  padding: 20px;
  border-radius: 10px;
  border: 2px dashed white;
`;

const SuccessMessage = styled.p`
  font-size: 25px;
  color: white;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const NextButton = styled.button`
  background-color: #bf94e4;
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
`;

const UploadArea = styled.div`
  background-color: #c0afe2;
  width: 95%;
  height: 80%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border: 2px dashed white;
`;

const ProgressContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const ProgressBar = styled.div`
  background-color: #bf94e4;
  height: 25px;
  width: ${(props) => props.progress}%!;
  border-radius: 5px;
  transition: width 0.2s;
`;

const ProgressText = styled.span`
  margin-top: 10px;
  font-size: 16px;
`;

const MainText = styled.p`
  font-size: 30px;
  color: white;
  font-weight: bold;
  margin-bottom: 50px;
  text-align: center;
`;

const UploadButton = styled.label`
  background-color: #bf94e4;
  color: white;
  padding: 20px 40px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
`;

const AudioInfoText = styled.p`
  color: gray;
  font-size: 12px;
  margin-top: 0px;
`;

const AudioErrorText = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 10px;
`;
