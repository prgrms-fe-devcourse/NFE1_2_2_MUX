import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import YoutubeMusicIcon from '../../assets/icons/YoutubeMusicIcon.png';

const PostUpload = () => {
  const [albumData, setAlbumData] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const maxCharLimit = 300;
  const maxTitleCharLimit = 20;

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
  };

  return (
    <PostUploadContainer>
      <ContentWrapper>
        {/* 앨범 가져오기 버튼: 앨범이 선택되지 않았을 때만 표시 */}
        <AlbumSection>
          <AlbumPlaceholder>
            {albumData ? (
              <AlbumCover src={albumData.coverUrl} alt="Album Cover" />
            ) : (
              <YouTubeMusicLink onClick={() => setIsSearchMode(true)}>
                <YoutubeMusicIconImage
                  src={YoutubeMusicIcon}
                  alt="YoutubeMusicIcon"
                />
                YouTube Music에서 <br />
                앨범 가져오기
              </YouTubeMusicLink>
            )}
          </AlbumPlaceholder>

          <TrackDetails>
            {/* 포스트 제목 필드와 인풋박스 */}
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
          </TrackDetails>
        </AlbumSection>

        {/* 검색 모드: 앨범을 선택하지 않았을 때만 검색 UI 표시 */}
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

            {/* 검색 결과 */}
            {searchResults.length > 0 && (
              <SearchResults>
                {searchResults.map((album) => (
                  <AlbumItem
                    key={album.videoId}
                    onClick={() => selectAlbum(album)}>
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

        {/* 설명 입력 섹션 */}
        <DescriptionSection>
          <DescriptionTitle>노래 소개</DescriptionTitle>
          <DescriptionInput
            placeholder="이 곡의 특별함은 무엇인가요?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={maxCharLimit}
          />
          <CharCount>
            {description.length}/{maxCharLimit}자
          </CharCount>
        </DescriptionSection>
      </ContentWrapper>
    </PostUploadContainer>
  );
};

export default PostUpload;

// Styled components

const PostUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
`;

const ContentWrapper = styled.div`
  background-color: #fff;
  padding: 10px;
  border-radius: 15px;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 60vh;
`;

const AlbumSection = styled.div`
  display: flex;
  margin-bottom: 20px;
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
  font-size: 11px;
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
`;

const PostTitleWrapper = styled.div`
  position: relative;
  margin-bottom: 15px;
`;

const PostTitleInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 94%;
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
  margin-bottom: 0;
`;

const ArtistName = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 50px;
`;

const SearchSection = styled.div`
  display: flex;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
`;

const AlbumItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  border-radius: 10px;
  border: 1px solid #d1c4e9;
`;

const DescriptionTitle = styled.p`
  font-size: 18px;
  margin-top: 0%;
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
