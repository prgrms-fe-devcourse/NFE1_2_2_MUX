import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PlayIcon from '../../assets/icons/Play.png';
import PauseIcon from '../../assets/icons/Pause.png';
import NextIcon from '../../assets/icons/Next.png';
import PrevIcon from '../../assets/icons/Prev.png';
import YouTube from 'react-youtube';

const MusicPlayer = ({ currentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');
  const [isDragging, setIsDragging] = useState(false);

  const youtubePlayerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const progressBarRef = useRef(null);
  const intervalRef = useRef(null);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    const formattedHours = hours > 0 ? `${hours}:` : '';
    return `${formattedHours}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (currentTrack) {
      setIsPlaying(true);
      if (currentTrack.videoId && youtubePlayerRef.current) {
        youtubePlayerRef.current.loadVideoById(currentTrack.videoId);
        youtubePlayerRef.current.playVideo();
      } else if (currentTrack.audioUrl && audioPlayerRef.current) {
        audioPlayerRef.current.src = currentTrack.audioUrl;
        audioPlayerRef.current.play();
      }
    }

    setProgress(0);
    setCurrentTime('0:00');
    setTotalTime('0:00');
  }, [currentTrack]);

  const togglePlay = () => {
    if (isPlaying) {
      if (currentTrack?.videoId && youtubePlayerRef.current) {
        youtubePlayerRef.current.pauseVideo();
      } else if (currentTrack?.audioUrl && audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    } else {
      if (currentTrack?.videoId && youtubePlayerRef.current) {
        youtubePlayerRef.current.playVideo();
      } else if (currentTrack?.audioUrl && audioPlayerRef.current) {
        audioPlayerRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const onYouTubeStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    } else if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        const currentTime = event.target.getCurrentTime();
        const totalDuration = event.target.getDuration();
        setCurrentTime(formatTime(currentTime));
        setTotalTime(formatTime(totalDuration));
        setProgress((currentTime / totalDuration) * 100);
      }, 1000);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
    }
  };

  const onAudioTimeUpdate = () => {
    if (audioPlayerRef.current) {
      const currentTime = audioPlayerRef.current.currentTime;
      const totalDuration = audioPlayerRef.current.duration;
      setCurrentTime(formatTime(currentTime));
      setTotalTime(formatTime(totalDuration));
      setProgress((currentTime / totalDuration) * 100);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    if (currentTrack?.audioUrl && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    clearInterval(intervalRef.current);
  };

  const handleMouseMove = (e) => {
    if (isDragging && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newProgress = Math.max(
        0,
        Math.min(100, (offsetX / rect.width) * 100),
      );
      setProgress(newProgress);
      const totalDuration = currentTrack?.videoId
        ? youtubePlayerRef.current.getDuration()
        : audioPlayerRef.current?.duration || 0;
      if (!isNaN(totalDuration)) {
        const newTime = (newProgress / 100) * totalDuration;
        setCurrentTime(formatTime(newTime));
      }
    }
  };

  const handleMouseUp = (e) => {
    if (isDragging && progressBarRef.current) {
      setIsDragging(false);
      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const newProgress = Math.max(
        0,
        Math.min(100, (offsetX / rect.width) * 100),
      );
      setProgress(newProgress);
      const totalDuration = currentTrack?.videoId
        ? youtubePlayerRef.current.getDuration()
        : audioPlayerRef.current?.duration || 0;
      if (!isNaN(totalDuration)) {
        const newTime = (newProgress / 100) * totalDuration;
        if (currentTrack?.videoId) {
          youtubePlayerRef.current.seekTo(newTime, true);
        } else if (currentTrack?.audioUrl && audioPlayerRef.current) {
          audioPlayerRef.current.currentTime = newTime;
          if (isPlaying) {
            audioPlayerRef.current.play();
          }
        }
      }
    }
  };

  useEffect(() => {
    const progressBar = progressBarRef.current;
    progressBar.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      progressBar.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      clearInterval(intervalRef.current);
    };
  }, [isDragging]);

  return (
    <PlayerContainer>
      <BlurBackground />
      <PlayerContent>
        <SongInfo>
          <SongTitle>
            {currentTrack ? currentTrack.title : '곡을 선택하세요.'}
          </SongTitle>
          <ArtistName>
            {currentTrack ? currentTrack.artist : '아티스트 이름'}
          </ArtistName>
        </SongInfo>
        <ControlsWrapper>
          <PlayerControls>
            <ControlButton>
              <img src={PrevIcon} alt="Previous" />
            </ControlButton>
            <ControlButton onClick={togglePlay}>
              <img
                src={isPlaying ? PauseIcon : PlayIcon}
                alt={isPlaying ? 'Pause' : 'Play'}
              />
            </ControlButton>
            <ControlButton>
              <img src={NextIcon} alt="Next" />
            </ControlButton>
          </PlayerControls>
          <ProgressSection>
            <TimeDisplay>{currentTime}</TimeDisplay>
            <ProgressBarContainer>
              <ProgressBar ref={progressBarRef}>
                <Progress style={{ width: `${progress}%` }} />
              </ProgressBar>
            </ProgressBarContainer>
            <TimeDisplay>{totalTime}</TimeDisplay>
          </ProgressSection>
        </ControlsWrapper>
      </PlayerContent>
      {currentTrack?.videoId && (
        <YouTube
          key={currentTrack.videoId}
          videoId={currentTrack.videoId}
          onReady={(event) => (youtubePlayerRef.current = event.target)}
          onStateChange={onYouTubeStateChange}
          opts={{
            height: '0',
            width: '0',
            playerVars: {
              autoplay: 1,
            },
          }}
        />
      )}
      {currentTrack?.audioUrl && (
        <audio ref={audioPlayerRef} onTimeUpdate={onAudioTimeUpdate} />
      )}
    </PlayerContainer>
  );
};

export default MusicPlayer;

// Styled Components

const PlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 90px;
  background-color: rgba(20, 20, 20, 0.9);
  z-index: 1000;
`;

const BlurBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(90, 90, 90, 0.2);
  backdrop-filter: blur(10px);
  z-index: -1;
`;

const PlayerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 20px;
  text-align: center;

  @media all and (min-width:1024px) and (max-width:1279px) {
    padding: 0 16px;
    height: 80px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    padding: 0 12px;
    height: 70px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    padding: 0 8px;
    height: 60px;
  }
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
`;

const SongTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 4px;

  @media all and (min-width:1024px) and (max-width:1279px) {
    font-size: 15px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    font-size: 14px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    font-size: 13px;
  }
`;

const ArtistName = styled.div`
  font-size: 14px;
  color: #b3b3b3;

  @media all and (min-width:1024px) and (max-width:1279px) {
    font-size: 13px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    font-size: 12px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    font-size: 11px;
  }
`;

const ControlsWrapper = styled.div`
  flex: 19;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PlayerControls = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;

  @media all and (min-width:1024px) and (max-width:1279px) {
    gap: 15px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    gap: 12px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    gap: 10px;
  }
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  img {
    width: 28px;
    height: 28px;

    @media all and (min-width:1024px) and (max-width:1279px) {
      width: 26px;
      height: 26px;
    }

    @media all and (min-width:768px) and (max-width:1023px) {
      width: 24px;
      height: 24px;
    }

    @media all and (min-width:480px) and (max-width:767px) {
      width: 22px;
      height: 22px;
    }
  }
`;

const ProgressSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 700px;

  @media all and (min-width:1024px) and (max-width:1279px) {
    max-width: 600px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    max-width: 500px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    max-width: 400px;
  }
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  position: relative;
  height: 4px;
  cursor: pointer;
  margin: 0 10px;

  @media all and (min-width:1024px) and (max-width:1279px) {
    height: 3px;
    margin: 0 8px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    height: 2px;
    margin: 0 6px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    height: 1px;
    margin: 0 4px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: #bf94e4;
  border-radius: 2px;
`;

const TimeDisplay = styled.span`
  font-size: 12px;
  color: #b3b3b3;
  min-width: 40px;
  text-align: center;

  @media all and (min-width:1024px) and (max-width:1279px) {
    font-size: 11px;
  }

  @media all and (min-width:768px) and (max-width:1023px) {
    font-size: 10px;
  }

  @media all and (min-width:480px) and (max-width:767px) {
    font-size: 9px;
  }
`;