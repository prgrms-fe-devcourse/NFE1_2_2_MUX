import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import img1 from '../../assets/images/musician-349790_1280.jpg';
import img2 from '../../assets/images/guitar-3943201_1280.jpg';
import img3 from '../../assets/images/adult-3086307_1280.jpg';
import ipod from '../../assets/images/KakaoTalk_Image_2024-09-28-19-59-52.png';
import logo from '../../assets/images/Chat (7).png';
import play from '../../assets/images/landing-play.png';
import anim1 from '../../assets/images/image 1.png';
import anim2 from '../../assets/images/image 2.png';
import anim3 from '../../assets/images/image 3.png';
import anim4 from '../../assets/images/image 4.png';

const LandingApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [img1, img2, img3];
  const totalImages = images.length;
  const animImages = [anim1, anim2, anim3, anim4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 3000);

    return () => clearInterval(interval);
  }, [totalImages]);

  const offset = (-currentIndex * 100) / totalImages;

  return (
    <AppContainer>
      <GlobalStyle />
      <Top>
        <Header>
          <Logo>
            <LogoImg src={logo} alt="MUX 로고" />
          </Logo>
        </Header>
      </Top>
      <Main>
        <ContentContainer>
          <TextContent>
            <TitleRow>
              <Title>We connect</Title>
              <PlayButtonImg src={play} alt="Play Button" />
            </TitleRow>
            <Subtitle>music and artist</Subtitle>
            <Description>
              creating a community where inspiration thrives.
            </Description>
            <Buttons>
              <Button href="#sign-in">Sign In</Button>
              <Button href="#sign-up">Sign Up</Button>
            </Buttons>
          </TextContent>
          <ImageSection>
            <AnimElements>
              {animImages.map((src, index) => (
                <AnimElement key={index}>
                  <img src={src} alt={`음계 ${index + 1}`} />
                </AnimElement>
              ))}
            </AnimElements>
            <IpodContainer>
              <IpodImage src={ipod} alt="ipod" />
              <Screen>
                <SliderContainer
                  style={{ transform: `translateX(${offset}%)` }}>
                  {images.map((src, index) => (
                    <SliderImage
                      key={index}
                      src={src}
                      alt={`슬라이드 이미지 ${index + 1}`}
                    />
                  ))}
                </SliderContainer>
              </Screen>
            </IpodContainer>
          </ImageSection>
        </ContentContainer>
      </Main>
    </AppContainer>
  );
};

export default LandingApp;

const SliderContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
  width: 300%;
  height: 100%;
`;

const SliderImage = styled.img`
  width: 33.33%;
  height: 100%;
  object-fit: cover;
`;

const AppContainer = styled.div`
  text-align: center;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Top = styled.div`
  position: relative;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2;
`;

const Logo = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;

  @media (max-width: 1023px) {
    top: 15px;
    left: 15px;
  }

  @media (max-width: 767px) {
    top: 10px;
    left: 10px;
  }
`;

const LogoImg = styled.img`
  width: 220px;
  height: auto;
  object-fit: contain;

  @media (max-width: 1023px) {
    width: 200px; // 태블릿에서 크기 조정
  }

  @media (max-width: 767px) {
    width: 110px; // 모바일에서 크기 조정
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1023px) {
    max-width: 90%; // 태블릿에서 전체 너비 줄임
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    top: 10%;
    transform: translate(-50%, 0);
  }
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  max-width: 50%;
  padding-left: 0;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;

const Title = styled.div`
  font-size: 84px;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 10px;

  @media (max-width: 1023px) {
    font-size: 68px; // 태블릿에서 크기 줄임
  }
`;

const Subtitle = styled.div`
  font-size: 84px;
  font-weight: bold;
  color: #888;
  line-height: 1;
  margin-bottom: 10px;
  white-space: nowrap;

  @media (max-width: 1023px) {
    font-size: 68px; // 태블릿에서 크기 줄임
  }
`;

const Description = styled.div`
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 40px;
  line-height: 1.2;
  max-width: 100%;
  white-space: nowrap;

  @media (max-width: 1023px) {
    font-size: 20px; // 태블릿에서 크기 줄임
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 767px) {
    gap: 10px;
  }
`;

const Button = styled.a`
  padding: 12px 24px;
  border: 1px solid rgba(128, 0, 128, 0.6);
  font-size: 18px;
  text-decoration: none;
  background: rgba(128, 0, 128, 0.4);
  color: #fff;
  border-radius: 30px;
  transition: all 0.3s ease;
  width: 180px;
  display: inline-block;
  text-align: center;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(128, 0, 128, 0.6);
    box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.4);
    transform: translateY(-3px);
  }

  @media (max-width: 1023px) {
    padding: 10px 20px;
    font-size: 14px; // 태블릿에서 글자 크기 줄임
    width: 140px; // 버튼 너비 약간 줄임
  }

  @media (max-width: 767px) {
    padding: 8px 16px;
    font-size: 14px;
    width: 120px;
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const IpodContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 350px;
  height: auto;
  margin-right: 0;

  @media (max-width: 1023px) {
    max-width: 300px;
  }

  @media (max-width: 767px) {
    max-width: 250px;
  }
`;

const IpodImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const Screen = styled.div`
  position: absolute;
  top: 6.5%;
  left: 6%;
  width: 88%;
  height: 46%;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid black;
`;

const AnimElements = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  left: -50px;
  top: 40%;
  transform: translateY(-50%);
  z-index: 1;

  @media (max-width: 1023px) {
    width: 200px;
    height: 200px;
    left: -30px;
  }

  @media (max-width: 767px) {
    width: 150px;
    height: 150px;
    left: -20px;
  }
`;

const AnimElement = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  animation-timing-function: ease-in-out;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:nth-child(1) {
    top: -40px;
    left: 40%;
    animation: float1 8s ease-in-out infinite alternate;
  }

  &:nth-child(2) {
    top: 20%;
    left: -40px;
    animation: float2 9s ease-in-out infinite alternate;
  }

  &:nth-child(3) {
    top: 55%;
    left: 20%;
    animation: float3 7s ease-in-out infinite alternate;
  }

  &:nth-child(4) {
    top: 85%;
    left: 60%;
    animation: float4 10s ease-in-out infinite alternate;
  }
`;

const GlobalStyle = createGlobalStyle`
  @keyframes float1 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(80px, 80px) rotate(10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes float2 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-60px, 60px) rotate(-10deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes float3 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(70px, -70px) rotate(8deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  @keyframes float4 {
    0% { transform: translate(0, 0) rotate(0deg); }
    50% { transform: translate(-50px, -50px) rotate(-8deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
`;

const PlayButtonImg = styled.img`
  width: 80px;
  height: 80px;
  margin-left: 20px;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
  filter: drop-shadow(0px 6px 12px rgba(0, 0, 0, 0.3));
  background: none;
  border: none;
  outline: none;

  &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0px 12px 24px rgba(0, 0, 0, 0.4));
  }

  @media (max-width: 1023px) {
    width: 65px; // 태블릿에서 크기 줄임
    height: 65px;
  }
`;
