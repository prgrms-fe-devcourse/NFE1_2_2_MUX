import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ImageChangeIcon from '../../assets/icons/image-change.png';
import defaultAlbumImage from '../../assets/images/default-album.png';

const TrackUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showUploadedContent, setShowUploadedContent] = useState(false);
  const [selectedAlbumImage, setSelectedAlbumImage] =
    useState(defaultAlbumImage);
  const [audioErrorMessage, setAudioErrorMessage] = useState('');
  const [imageErrorMessage, setImageErrorMessage] = useState('');

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

    setSelectedAlbumImage(URL.createObjectURL(file));
    setImageErrorMessage('');
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

  return (
    <TrackUploadContent>
      {showUploadedContent ? (
        <UploadedContent>
          <LeftSection>
            <AlbumSection>
              <AlbumCover>
                <img src={selectedAlbumImage} alt="앨범 이미지" />
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
          </LeftSection>

          <RightSection></RightSection>
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

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 55%;
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
