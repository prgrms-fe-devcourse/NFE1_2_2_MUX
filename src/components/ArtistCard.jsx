import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ExampleImage from '../assets/images/default-profile.png';
import playButtonIcon from '../assets/icons/play-button.png';
import stopButtonIcon from '../assets/icons/stop-button.png';

const ArtistCard = ({ artist, albumId, artistId, postId }) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);

  // 유저 페이지 이동 부분
  const handleArtistClick = (e) => {
    e.stopPropagation();
    navigate(`/artist/${artistId}`);
  }; 

  //가운데 앨범 클릭했을때 부분
  const handleAlbumClick = (e) => {
    e.stopPropagation();
    console.log(`앨범 ${albumId}를 재생목록에 추가`);
  };

  // 포스트 클릭했을
  const handlePostClick = () => {
    navigate(`/post/${postId}`);
  };

  const togglePlayPause = (e) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  return (
    <CardContainer onClick={handlePostClick}>
      <ArtistInfo>
        <ArtistAvatar src={ExampleImage} alt="Artist profile" onClick={handleArtistClick} />
        <ArtistName onClick={handleArtistClick}>Artist. Sun_gliter</ArtistName>
      </ArtistInfo>
      <CardImageContainer>
        <CardImageWrapper onClick={togglePlayPause}>
          <CardImage
            src="https://via.placeholder.com/270x300"
            alt={`${artist}의 아트워크`}
          />
          <PlayPauseButton>
            <img
              src={isPlaying ? stopButtonIcon : playButtonIcon}
              alt="Play/Pause Button"
            />
          </PlayPauseButton>
        </CardImageWrapper>
      </CardImageContainer>
      <CardContent>
        <PostContent>
          <SongTitle>나란 놈은 답은 너다(feat. 하림)</SongTitle>
          <SongInformation>이별 후 듣기 좋은 노래. 이별 후 듣기 좋은 노래. 이별 후 듣기 좋은 노래 ...더보기</SongInformation>
        </PostContent>
      </CardContent>
      <ExtraSpace />
    </CardContainer>
  );
};

export default ArtistCard;

// 스타일드 컴포넌트
const CardContainer = styled.div`
  width: 300px;
  height: 480px; // 높이를 늘렸습니다
  background-color: #f3e8fb;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-family: 'Arial', sans-serif;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.02);
  }
`;

const ArtistInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 13px;
`;

const ArtistAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  cursor: pointer;
`;

const ArtistName = styled.span`
  font-weight: 600;
  color: #333333;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: -10px;
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 270px;
  height: 300px;

  &:hover div {
    opacity: 1;
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const PlayPauseButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  img {
    width: 100%;
    height: 100%;
  }
`;

const CardContent = styled.div`
  padding: 15px;
  width: 270px;
  text-align: left;
`;

const PostContent = styled.div`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const SongTitle = styled.h3`
  margin: 0 0 5px 0;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
`;

const SongInformation = styled.p`
  color: #666666;
  font-size: 12px;
  margin-bottom: 10px;
`;

const ExtraSpace = styled.div`
  flex: 1;
  // 필요에 따라 여기에 추가 스타일을 적용할 수 있습니다.
`;