import React from 'react';
import styled from 'styled-components';

const TrackUpload = () => {

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
            <>
              <MainText>당신의 음원을 드래그 후, 드롭하여 주세요.</MainText>
              <UploadButton htmlFor="fileUpload">
                또는 이 버튼을 클릭하여 음원을 선택해주세요.
              </UploadButton>
              <input
                id="fileUpload"
                type="file"
                style={{ display: 'none' }}
              />
            </>
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

const UploadedContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 90%;
  padding: 10px;
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
