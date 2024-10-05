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
  const cardContainerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchTopAlbums = async () => {
      const options = {
        method: 'GET',
        url: 'https://yt-api.p.rapidapi.com/search',
        params: { query: '2024 j-pop playlist' },
        params: { query: '2024 k-pop playlist' },
        headers: {
          'x-rapidapi-key': '44e584cb92msh419c63d530f9731p198f8ejsn087035d40a78',
          'x-rapidapi-host': 'yt-api.p.rapidapi.com'
        }
      };
    
      try {
        const response = await axios.request(options);
        const results = response.data.data || []; 
    
        setAlbums(
          results
            .filter((video) => video.videoId && video.type === 'video') 
            .map((video) => ({
              videoId: video.videoId,
              title: video.title,
              artist: video.channelTitle || 'Unknown Artist', 
              coverUrl: video.thumbnail ? video.thumbnail[0].url : '', 
              duration: video.lengthText || 'Unknown Duration', 
            }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - cardContainerRef.current.offsetLeft;
    scrollLeft.current = cardContainerRef.current.scrollLeft;
    cardContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - cardContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    cardContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDown.current = false;
    cardContainerRef.current.style.cursor = 'grab';
  };

  return (
    <CardContainer
      ref={cardContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}>
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
  cursor: grab;
  user-select: none;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    flex-direction: row;
    flex-wrap: nowrap;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    flex-direction: row;
    flex-wrap: nowrap;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    flex-direction: row;
    align-items: scroll;
    flex-wrap: nowrap;
  }
`;

const AlbumContainer = styled.div`
  flex: none;
  width: 250px;
  height: 300px;
  margin: 15px;
  border-radius: 12px;
  overflow: hidden;
  background-color: #BF94E4;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    width: 220px;
    height: 270px;
    margin: 12px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    width: 220px;
    height: 270px;
    margin: 12px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 220px;
    height: 270px;
    margin: 12px
  }
`;

const AlbumCover = styled.img`
  width: 90%;
  height: 210px;
  object-fit: cover;
  margin: 0 auto;
  pointer-events: none;

  @media all and (min-width: 1024px) and (max-width: 1279px) {
    height: 180px;
  }

  @media all and (min-width: 768px) and (max-width: 1023px) {
    height: 180px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    height: 180px;
    margin-top: 0;
  }
`;

const PlayPauseButtonContainer = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;

  ${AlbumContainer}:hover & {
    visibility: visible;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 50px;
    height: 50px;
  }
`;

const PlayPauseButton = styled.div`
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 35px;
    height: 35px;
  }

  @media all and (min-width: 480px) and (max-width: 767px) {
    width: 50px;
    height: 50px;

    img {
      width: 30px;
      height: 30px;
    }
  }
`;

const AlbumInfo = styled.div`
  padding: 10px 15px;
  text-align: left;
  width: 100%;
  box-sizing: border-box;

  @media all and (min-width: 480px) and (max-width: 767px) {
    text-align: center;
  }
`;

const AlbumTitle = styled.h3`
  font-size: 16px;
  margin: 0;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 18px;
  }
`;

const AlbumArtist = styled.p`
  font-size: 14px;
  color: #867A7A;
  margin: 5px 0;

  @media all and (min-width: 480px) and (max-width: 767px) {
    font-size: 16px;
  }
`;
