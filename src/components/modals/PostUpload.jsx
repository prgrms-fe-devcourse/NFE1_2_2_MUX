import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import youtubeMusicIcon from '../../assets/icons/youtube-music-icon.png';
import stopButtonIcon from '../../assets/icons/stop-button.png';
import playButtonIcon from '../../assets/icons/play-button.png';
import YouTube from 'react-youtube';

const PostUpload = () => {
  const [albumData, setAlbumData] = useState(null);
  const [description, setDescription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [player, setPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const maxCharLimit = 300;
  const maxTitleCharLimit = 20;

  const intervalRef = useRef(null);
  const descriptionInputRef = useRef(null);

  // 앨범 검색 기능
  const searchAlbums = async () => {
    const options = {
      method: 'GET',
      url: 'https://youtube-music-api3.p.rapidapi.com/search',
      params: { q: searchTerm, type: 'song' },
      headers: {
        'x-rapidapi-key': '44e584cb92msh419c63d530f9731p198f8ejsn087035d40a78',
        'x-rapidapi-host': 'youtube-music-api3.p.rapidapi.com',
      },
      mode: 'no-cors',
    };

    try {
      const response = await axios.request(options);
      const results = response.data.result || [];
      setSearchResults(results);
    } catch (error) {
      console.error('검색 결과를 가져오는 중 오류 발생:', error);
    }
  };

  // 앨범 선택 시 처리
  const selectAlbum = (album) => {
    setAlbumData({
      title: album.title,
      artist: album.author,
      coverUrl: album.thumbnail,
    });
    setSelectedTrack(album);
    setSearchResults([]);
    setIsSearchMode(false);
    resetPlayer();

    if (descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  };

  // 플레이어 리셋
  const resetPlayer = () => {
    if (player) {
      player.stopVideo();
    }
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(0);
    clearInterval(intervalRef.current);
  };

  // 앨범 선택 초기화
  const resetAlbumSelection = () => {
    resetPlayer();
    setAlbumData(null);
    setIsSearchMode(true);
    setSearchTerm('');
  };

  // YouTube Player 설정
  const onPlayerReady = (event) => {
    setPlayer(event.target);
    setDuration(event.target.getDuration());
  };

  // 재생/일시정지 처리
  const handlePlayPause = () => {
    if (isPlaying) {
      player.pauseVideo();
      clearInterval(intervalRef.current);
    } else {
      player.playVideo();
      intervalRef.current = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
      }, 1000);
    }
    setIsPlaying(!isPlaying);
  };

  // 시간을 MM:SS 형식으로 변환
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // 게시하기 버튼 클릭 시 유효성 검사 및 성공 시 처리
  const handlePost = () => {
    if (postTitle.trim() === '') {
      setErrorMessage('포스트 제목을 입력해 주세요.');
      return;
    }

    if (!albumData) {
      setErrorMessage('추천 포스트를 업로드 하세요.');
      return;
    }

    if (description.trim() === '') {
      setErrorMessage('노래 소개를 입력하세요.');
      return;
    }

    setErrorMessage('');

    const newPost = {
      postTitle: postTitle,
      title: albumData.title,
      artist: albumData.artist,
      description: description,
      coverUrl: albumData.coverUrl,
    };

    if (typeof onPostSuccess === 'function') {
      onPostSuccess(newPost);
      alert('포스트가 성공적으로 업로드되었습니다!');
    } else {
      alert('포스트 업로드에 실패하였습니다!');
    }

    resetPlayer();
    setPostTitle('');
    setAlbumData(null);
    setDescription('');
  };

  return (
    <PostUploadContainer>
      <ContentWrapper>
        <AlbumSection>
          <AlbumPlaceholder onClick={albumData ? resetAlbumSelection : () => setIsSearchMode(true)}>
            {albumData ? (
              <AlbumCover src={albumData.coverUrl} alt="Album Cover" />
            ) : (
              <YouTubeMusicLink>
                <YoutubeMusicIconImage src={youtubeMusicIcon} alt="YoutubeMusicIcon" />
                YouTube Music에서 <br />
                앨범 가져오기
              </YouTubeMusicLink>
            )}
          </AlbumPlaceholder>

          <TrackDetails>
            <PostTitleWrapper>
              <PostTitleInput
                type="text"
                placeholder="포스트 제목을 입력해주세요"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                maxLength={maxTitleCharLimit}
              />
              <TitleCharCount>
                {postTitle.length}/{maxTitleCharLimit}자
              </TitleCharCount>
            </PostTitleWrapper>

            <TrackTitle>{albumData ? albumData.title : '제목'}</TrackTitle>
            <ArtistName>{albumData ? albumData.artist : '아티스트'}</ArtistName>
            <AudioPlayer>
              <PlayPauseButton onClick={handlePlayPause} disabled={!albumData}>
                <img src={isPlaying ? stopButtonIcon : playButtonIcon} alt="Play/Pause Button" />
              </PlayPauseButton>
              <TrackTime>{formatTime(currentTime)}</TrackTime>
              <ProgressBar
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(e) => player.seekTo(e.target.value)}
              />
              <TrackTime>{formatTime(duration)}</TrackTime>
            </AudioPlayer>
          </TrackDetails>
        </AlbumSection>

        {selectedTrack && (
          <YouTube videoId={selectedTrack.videoId} opts={{ height: '0', width: '0', playerVars: { autoplay: 0 }}} onReady={onPlayerReady} />
        )}

        {isSearchMode && !albumData && (
          <>
            <SearchSection>
              <SearchInput
                type="text"
                placeholder="앨범 이름을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchButton onClick={searchAlbums}>검색</SearchButton>
            </SearchSection>

            {searchResults.length > 0 && (
              <SearchResults>
                {searchResults.map((album) => (
                  <AlbumItem key={album.videoId} onClick={() => selectAlbum(album)}>
                    <AlbumThumbnail src={album.thumbnail} alt={album.title} />
                    <AlbumInfo>
                      <AlbumTitle>{album.title}</AlbumTitle>
                      <AlbumArtist>{album.author}</AlbumArtist>
                    </AlbumInfo>
                  </AlbumItem>
                ))}
              </SearchResults>
            )}
          </>
        )}

        <DescriptionSection>
          <DescriptionTitle>노래 소개</DescriptionTitle>
          <DescriptionInput
            ref={descriptionInputRef}
            placeholder="이 곡의 특별함은 무엇인가요?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={maxCharLimit}
          />
          <CharCount>
            {description.length}/{maxCharLimit}자
          </CharCount>
        </DescriptionSection>

        <PostButtonWrapper>
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          <PostButton onClick={handlePost}>게시하기</PostButton>
        </PostButtonWrapper>
      </ContentWrapper>
    </PostUploadContainer>
  );
};

export default PostUpload;

// Styled components

const PostUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 97%;
  height: 100%;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 15px;
  width: 100%;
  max-width: 650px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60vh;
`;

const AlbumSection = styled.div`
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
`;

const AlbumPlaceholder = styled.div`
  background-color: #c0afe2;
  height: 200px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  border-radius: 10px;
  cursor: pointer;
`;

const AlbumCover = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`;

const YouTubeMusicLink = styled.p`
  display: flex;
  align-items: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  margin-right: 5%;
`;

const YoutubeMusicIconImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 7px;
`;

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-width: 200px;
`;

const PostTitleWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const PostTitleInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 95%;
`;

const TitleCharCount = styled.p`
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 10px;
  color: #666;
`;

const TrackTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-top: 0;
`;

const ArtistName = styled.p`
  font-size: 15px;
  color: #666;
  margin-top: 0;
`;

const AudioPlayer = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid #666;
  padding-top: 10px;
  margin-top: 10px;
`;

const PlayPauseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
  img {
    width: 40px;
    height: 40px;
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const ProgressBar = styled.input`
  flex-grow: 1;
  margin: 0 10px;
  height: 5px;
`;

const TrackTime = styled.span`
  font-size: 14px;
  color: #666;
`;

const SearchSection = styled.div`
  display: flex;
  margin-bottom: 13px;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 40%;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  padding: 5px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SearchResults = styled.div`
  margin-bottom: 10px;
`;

const AlbumItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const AlbumThumbnail = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const AlbumTitle = styled.p`
  font-size: 16px;
  margin: 0;
`;

const AlbumArtist = styled.span`
  font-size: 12px;
  color: #666;
`;

const DescriptionSection = styled.div`
  background-color: #c0afe2;
  padding: 15px;
  margin-top: 5px;
  border-radius: 10px;
  border: 1px solid #d1c4e9;
  min-height: 150px;
`;

const DescriptionTitle = styled.p`
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 15px;
  color: white;
  border-bottom: 2px solid white;
`;

const DescriptionInput = styled.textarea`
  width: 95%;
  height: 70px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #c0afe2;
  font-size: 14px;
  color: white;
  resize: none;

  &::placeholder {
    color: white;
  }
`;

const CharCount = styled.p`
  font-size: 12px;
  color: white;
  text-align: right;
  margin-top: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 0px;
  margin-right: 25%;
`;

const PostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 15px;
`;

const PostButton = styled.button`
  padding: 3px 20px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
`;