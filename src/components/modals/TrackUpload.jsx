import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TrackUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    let interval = null;
    if (uploadProgress < 100 && selectedFile) {
      interval = setInterval(() => {
        setUploadProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          if (newProgress >= 100) {
            clearInterval(interval);
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
      setSelectedFile(file);
      setUploadProgress(0);
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

  return (
    <TrackUploadContent>
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
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </>
          )}
        </UploadArea>
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
