import React, { useState } from 'react';
import styled from 'styled-components';
import YouTube from 'react-youtube';
import playButtonIcon from '../assets/icons/play-button.png';
import stopButtonIcon from '../assets/icons/stop-button.png';

// 더미 데이터
const dummyPosts = [
    {
        _id: "1",
        title: "Album 1",
        artist: "Artist 1",
        coverUrl: "https://via.placeholder.com/200",
        videoId: "dQw4w9WgXcQ", // 예시 비디오 ID
    },
    {
        _id: "2",
        title: "Album 2",
        artist: "Artist 2",
        coverUrl: "https://via.placeholder.com/200",
        videoId: "eYq7WapuZJ8", // 예시 비디오 ID
    },
    {
        _id: "3",
        title: "Album 3",
        artist: "Artist 3",
        coverUrl: "https://via.placeholder.com/200",
        videoId: "2Vv-BfVoq4g", // 예시 비디오 ID
    },
];

const AlbumCurationCard = () => {
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [player, setPlayer] = useState(null);

    // YouTube Player 설정
    const onPlayerReady = (event) => {
        setPlayer(event.target);
    };

    // 재생/일시정지 처리
    const handlePlayPause = (videoId) => {
        if (playingVideoId === videoId) {
            player.pauseVideo();
            setPlayingVideoId(null);
        } else {
            setPlayingVideoId(videoId);
            if (player) {
                player.loadVideoById(videoId);
                player.playVideo();
            }
        }
    };

    const youtubeOptions = {
        height: '0',
        width: '0',
        playerVars: { autoplay: 1 },
    };

    return (
        <CardContainer>
            {dummyPosts.map((album) => (
                <AlbumContainer key={album._id}>
                    <AlbumCover src={album.coverUrl} alt={album.title} />
                    <PlayPauseButtonContainer>
                        <PlayPauseButton
                            onClick={() => handlePlayPause(album.videoId)}
                        >
                            <img
                                src={playingVideoId === album.videoId ? stopButtonIcon : playButtonIcon}
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
    display: flex; /* 플렉스 박스를 사용하여 카드 배열 */
    flex-wrap: wrap; /* 여러 카드가 자동으로 줄 바꿈 */
`;

const AlbumContainer = styled.div`
    position: relative;
    width: 200px;
    height: 240px; /* 높이 조정 */
    margin: 10px;
    cursor: pointer;
    border-radius: 10px; /* 모서리 둥글게 */
    overflow: hidden; /* 자식 요소가 컨테이너를 넘칠 경우 숨김 */
    background-color: #c0afe3; /* 배경색 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
    transition: transform 0.2s; /* 애니메이션 효과 */
    
    &:hover {
        transform: scale(1.04); /* 마우스 오버 시 확대 효과 */
    }
`;

const AlbumCover = styled.img`
    width: 90%;
    margin-top: 10px;
    height: 170px; /* 앨범 커버 높이 설정 */
    object-fit: cover;
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
    visibility: hidden; /* 기본적으로 버튼 숨기기 */

    ${AlbumContainer}:hover & {
        visibility: visible; /* 카드 호버 시 버튼 보이기 */
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
`;

const AlbumInfo = styled.div`
    margin-left: 15px;
    text-align: left;
`;

const AlbumTitle = styled.h3`
    font-size: 14px;
    margin: 0;
`;

const AlbumArtist = styled.p`
    font-size: 13px;
    color: #666;
    margin: 3px 0;
`;