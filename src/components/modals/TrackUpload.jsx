import React from 'react';
import styled from 'styled-components';

const TrackUpload = () => {

  return (
    <TrackUploadContent>
            <>
              <UploadButton htmlFor="fileUpload">
                또는 이 버튼을 클릭하여 음원을 선택해주세요.
              </UploadButton>
              <input
                id="fileUpload"
                type="file"
                style={{ display: 'none' }}
              />
            </>
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
