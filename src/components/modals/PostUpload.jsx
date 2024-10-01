import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import youtubeMusicIcon from '../../assets/icons/youtube-music-icon.png';
import stopButtonIcon from '../../assets/icons/stop-button.png';
import playButtonIcon from '../../assets/icons/play-button.png';
import YouTube from 'react-youtube';
import { createPost } from '../../utils/api'; // API 함수 불러오기

const PostUpload = ({ onPostSuccess }) => {
  const [albums, setAlbums] = useState([]);
  const [description, setDescription] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [postTitle, setPostTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [player, setPlayer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const maxAlbums = 5;
  const maxCharLimit = 300;
  const maxTitleCharLimit = 20;

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
    // 중복 여부 확인
    const isDuplicate = albums.some(existingAlbum => existingAlbum.videoId === album.videoId);

    if (isDuplicate) {
      alert('중복된 앨범입니다.');
      return;
    }

    if (albums.length < maxAlbums) {
      setAlbums([
        ...albums,
        {
          title: album.title,
          artist: album.author,
          coverUrl: album.thumbnail,
          videoId: album.videoId,
        },
      ]);
    } else {
      alert(`최대 ${maxAlbums}개의 앨범만 추가할 수 있습니다.`);
    }
    setSearchResults([]);
    setIsSearchMode(false);
  };

  // 재생/일시정지 처리
  const handlePlayPause = (album) => {
    if (selectedTrack && selectedTrack.videoId === album.videoId && isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (player) {
        player.loadVideoById(album.videoId);
        player.playVideo();
      }
      setSelectedTrack(album);
    }
  };

  // 새로운 곡을 재생할 때 기존 곡 멈추기
  const playNewAlbum = (album) => {
    if (player && selectedTrack && selectedTrack.videoId !== album.videoId) {
      player.stopVideo();
      setPlayer(null);
      setIsPlaying(false);
    }
    handlePlayPause(album);
  };

  // YouTube Player 설정
  const onPlayerReady = (event) => {
    setPlayer(event.target);
  };

  // 앨범 삭제 처리
  const removeAlbum = (index) => {
    const albumToRemove = albums[index];
    if (selectedTrack && selectedTrack.videoId === albumToRemove.videoId) {
      player.stopVideo();
      setIsPlaying(false);
      setSelectedTrack(null);
      setPlayer(null); 
    }
  
    const updatedAlbums = [...albums];
    updatedAlbums.splice(index, 1);
    setAlbums(updatedAlbums);
  };

  // 게시하기 버튼 클릭 시 유효성 검사 및 성공 시 처리
  const handlePost = async () => {
    if (postTitle.trim() === "albums.length === 0  description.trim() === ") {
      setErrorMessage('모든 필드를 채워주세요.');
      return;
    }
  
    setErrorMessage('');
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      setErrorMessage('로그인이 필요합니다.');
      return;
    }
  
    const postData = {
      title: postTitle,
      albums: albums,
      description: description,
    };
  
    const formData = new FormData();
    formData.append('title', JSON.stringify(postData));
    formData.append('channelId', "66fb541ced2d3c14a64eb9ee");

    if (albums[0]?.coverUrl) {
      formData.append('image', albums[0].coverUrl);
    }
  
    try {
      const response = await createPost(formData, token);
      console.log('Post uploaded successfully:', response);
  
      alert('포스트가 성공적으로 업로드되었습니다!');
  
      setAlbums([]);
      setPostTitle('');
      setDescription('');
  
      if (typeof onPostSuccess === 'function') {
        onPostSuccess(response);
      }
    } catch (error) {
      console.error('포스트 업로드 실패:', error);
      setErrorMessage(error.response?.data?.message || '포스트 업로드에 실패했습니다.');
    }
  };


  return (
    <PostUploadContainer>
      <ContentWrapper>
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

        {/* 앨범 목록 섹션 */}
        <AlbumListSection>
          <AlbumListHeader>
            <h3>앨범 목록</h3>
            <AlbumCount>
              {albums.length}/{maxAlbums} 앨범 추가됨
            </AlbumCount>
          </AlbumListHeader>
          <AlbumList>
            {/* AlbumPlaceholder가 조건부 렌더링되도록 수정 */}
            {albums.length < maxAlbums && (
              <AlbumPlaceholder onClick={() => setIsSearchMode(true)}>
                <YouTubeMusicLink>
                  <YoutubeMusicIconImage
                    src={youtubeMusicIcon}
                    alt="YoutubeMusicIcon"
                  />
                  YouTube Music에서 <br />
                  앨범 가져오기
                </YouTubeMusicLink>
              </AlbumPlaceholder>
            )}

            {albums.map((album, index) => (
              <AlbumItemWrapper key={index}>
                <AlbumCoverWrapper>
                  <AlbumCover src={album.coverUrl} alt={album.title} />
                  <PlayPauseButton onClick={() => playNewAlbum(album)}>
                    <img
                      src={
                        selectedTrack &&
                        selectedTrack.videoId === album.videoId &&
                        isPlaying
                          ? stopButtonIcon
                          : playButtonIcon
                      }
                      alt="Play/Pause Button"
                    />
                  </PlayPauseButton>
                  <RemoveButton onClick={() => removeAlbum(index)}>×</RemoveButton>
                </AlbumCoverWrapper>
                <AlbumInfo>
                  <AlbumTitle>{album.title}</AlbumTitle>
                  <AlbumArtist>{album.artist}</AlbumArtist>
                </AlbumInfo>
              </AlbumItemWrapper>
            ))}
          </AlbumList>
        </AlbumListSection>

        {/* YouTube Player */}
        {selectedTrack && (
          <YouTube
            videoId={selectedTrack?.videoId}
            opts={{ height: '0', width: '0', playerVars: { autoplay: 1 } }}
            onReady={onPlayerReady}
          />
        )}

        {/* 앨범 검색 모드 */}
        {isSearchMode && (
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
                  <AlbumItem
                    key={album.videoId}
                    onClick={() => selectAlbum(album)}
                  >
                    <AlbumThumbnail src={album.thumbnail} alt={album.title} />
                    <AlbumInfoLeftAligned>
                      <AlbumTitleLeftAligned>{album.title}</AlbumTitleLeftAligned>
                      <AlbumArtistLeftAligned>{album.author}</AlbumArtistLeftAligned>
                    </AlbumInfoLeftAligned>
                  </AlbumItem>
                ))}
              </SearchResults>
            )}
          </>
        )}

        {/* 노래 소개 섹션 */}
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

        {/* 게시하기 버튼 */}
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

const PostTitleWrapper = styled.div`
  position: relative;
  margin-bottom: 0;
`;

const PostTitleInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 97%;
`;

const TitleCharCount = styled.p`
  position: absolute;
  bottom: 1px;
  right: 10px;
  font-size: 13px;
  color: #666;
`;

/* 앨범 리스트 섹션 */
const AlbumListSection = styled.div`
  margin-top: 0;
`;

const AlbumListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AlbumCount = styled.p`
  font-size: 14px;
  color: #666;
`;

const AlbumList = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-top: 10px;
`;

const AlbumItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 15px;
`;

const AlbumCoverWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 10px;
  overflow: hidden;
`;

const AlbumCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayPauseButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
`;

const AlbumInfo = styled.div`
  text-align: center;
  margin-top: 10px;
  width: 150px;
`;

const AlbumTitle = styled.p`
  font-size: 14px;
  font-weight: bold;
`;

const AlbumArtist = styled.p`
  font-size: 12px;
  color: #666;
`;

const AlbumPlaceholder = styled.div`
  background-color: #c0afe2;
  height: 150px;
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 10px;
  margin-bottom: 15px;
  margin-right: 15px;
  cursor: pointer;
`;

const YouTubeMusicLink = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
`;

const YoutubeMusicIconImage = styled.img`
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
`;

/* 검색 및 노래 소개 */
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

const AlbumInfoLeftAligned = styled.div`
  text-align: left; /* 왼쪽 정렬 */
`;

const AlbumTitleLeftAligned = styled.p`
  font-size: 14px;
  font-weight: bold;
  max-width: 100%;
`;

const AlbumArtistLeftAligned = styled.p`
  font-size: 12px;
  color: #666;
  max-width: 100%;
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