import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import axios from 'axios';
import playButtonIcon from '../assets/icons/play-button.png';
import stopButtonIcon from '../assets/icons/stop-button.png';

const AlbumCurationCard = () => {
  const [albums, setAlbums] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchTopAlbums = async () => {
      const options = {
        method: 'GET',
        url: 'https://youtube-music6.p.rapidapi.com/ytmusic/',
        params: { query: '2024 k-pop , j-pop song' },
        headers: {
          'x-rapidapi-key':
            '474a94c639ec3a9ee5cc079e1d96ffa5687f2765',
          'x-rapidapi-host': 'youtube-music6.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        const results = response.data || [];
        setAlbums(
          results
            .filter((album) => album.videoId && album.category !== 'Episodes')
            .map((album) => ({
              videoId: album.videoId,
              title: album.title,
              artist:
                album.artists && album.artists.length > 0
                  ? album.artists[0].name
                  : 'Unknown Artist',
              coverUrl:
                album.thumbnails && album.thumbnails[0]
                  ? album.thumbnails[0].url
                  : '',
              duration: album.duration,
            })),
        );
      } catch (error) {
        console.error('데이터 불러오는 중 오류 발생:', error);
      }
    };

    fetchTopAlbums();
  }, []);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
  };

  const handlePlayPause = (videoId) => {
    if (playingVideoId === videoId) {
      playerRef.current.pauseVideo();
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(videoId);
      playerRef.current.loadVideoById(videoId);
      playerRef.current.playVideo();
    }
  };

  const youtubeOptions = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      origin: window.location.origin,
    },
  };

  return (
    <CardContainer>
      {albums.map((album) => (
        <AlbumContainer key={album.videoId}>
          <AlbumCover src={album.coverUrl} alt={album.title} />
          <PlayPauseButtonContainer>
            <PlayPauseButton onClick={() => handlePlayPause(album.videoId)}>
              <img
                src={
                  playingVideoId === album.videoId
                    ? stopButtonIcon
                    : playButtonIcon
                }
                alt="Play/Pause Button"
              />
            </PlayPauseButton>
            {playingVideoId === album.videoId && (
              <YouTube
                videoId={album.videoId}
                opts={youtubeOptions}
                onReady={onPlayerReady}
              />
            )}
          </PlayPauseButtonContainer>
          <AlbumInfo>
            <AlbumTitle>{album.title}</AlbumTitle>
            <AlbumArtist>{album.artist}</AlbumArtist>
          </AlbumInfo>
        </AlbumContainer>
      ))}
    </CardContainer>
  );
};

export default AlbumCurationCard;

// Styled Components

const CardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 20px;
  caret-color: transparent;
  margin-bottom: 30px;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 1023px) {
    padding-bottom: 15px;
    margin-bottom: 20px;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    overflow-x: visible;
  }
`;

const AlbumContainer = styled.div`
  flex: none;
  width: 200px;
  height: 240px;
  margin: 10px;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  background-color: #c0afe3;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.04);
  }

  @media (max-width: 1023px) {
    width: 180px;
    height: 220px;
    margin: 8px;
  }

  @media (max-width: 767px) {
    width: 100%;
    height: auto;
    margin: 15px 0;
  }
`;

const AlbumCover = styled.img`
  width: 90%;
  margin-top: 10px;
  height: 170px;
  object-fit: cover;

  @media (max-width: 1023px) {
    height: 150px;
  }

  @media (max-width: 767px) {
    width: 100%;
    height: auto;
    margin-top: 0;
  }
`;

const PlayPauseButtonContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;

  ${AlbumContainer}:hover & {
    visibility: visible;
  }

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const PlayPauseButton = styled.div`
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;

    img {
      width: 25px;
      height: 25px;
    }
  }
`;

const AlbumInfo = styled.div`
  margin-left: 15px;
  text-align: left;

  @media (max-width: 767px) {
    margin-left: 0;
    text-align: center;
  }
`;

const AlbumTitle = styled.h3`
  font-size: 14px;
  margin: 0;
  color: #ffffff;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

const AlbumArtist = styled.p`
  font-size: 13px;
  color: #ffffff;
  margin: 3px 0;

  @media (max-width: 767px) {
    font-size: 14px;
  }
`;
