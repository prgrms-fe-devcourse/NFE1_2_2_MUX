import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { uploadProfileImage, updateUser } from '../../utils/api';

const ProfileEditModal = ({ user, token, onClose, onNicknameUpdate, onBioUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '****',
    nickname: '',
    bio: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName.fullName,
        email: user.email,
        password: '****',
        nickname: user.fullName.nickName,
        bio: user.bio || '',
      });
      setProfileImage(user.profileImage);
    }
  }, [user]);

  // 닉네임 엔터 처리
  const handleNicknameKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        await updateUser(user.id, token, { username: formData.nickname });
        onNicknameUpdate(formData.nickname);
        alert('닉네임이 성공적으로 변경되었습니다.');
      } catch (error) {
        alert('닉네임 변경에 실패했습니다.');
      }
    }
  };

  // 자기소개 엔터 처리
  const handleBioKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        await updateUser(user.id, token, { comment: formData.bio });
        onBioUpdate(formData.bio);
        alert('자기소개가 성공적으로 변경되었습니다.');
      } catch (error) {
        alert('자기소개 변경에 실패했습니다.');
      }
    }
  };

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
  
    // 파일 형식 제한 (jpg와 png만 허용)
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(imageFile.type)) {
      alert('jpg 또는 png 형식의 파일만 업로드 가능합니다.');
      return;
    }
  
    // 파일 크기 제한 (최대 2MB)
    const maxSizeInMB = 2;
    if (imageFile.size > maxSizeInMB * 1024 * 1024) {
      alert('파일 크기는 최대 2MB까지 허용됩니다.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('isCover', false);
  
    try {
      const updateUser = await uploadProfileImage(formData, token);
      setProfileImage(URL.createObjectURL(imageFile)); // 선택된 파일을 미리 보기
    } catch (error) {
      console.error('프로필 이미지를 변경할 수 없습니다.', error);
    }
  };
  
  

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseBtn onClick={onClose}>X</CloseBtn>

        <ProfileSection>
          <ProfileImageWrapper>
            <ProfileImage
              src={profileImage || '/path/to/default-image.png'}
              alt="프로필 이미지"
            />
            <ProfileChangeButton onClick={handleImageUploadClick}>
              프로필 이미지 변경
            </ProfileChangeButton>
            <FileInput
              ref={fileInputRef}
              type="file"
              onChange={handleImageChange}
              accept="image/jpeg, image/png" // 파일 형식 제한
            />
          </ProfileImageWrapper>
        </ProfileSection>

        <SectionTitle>기본 정보</SectionTitle>
        <Divider />
        <StyledForm>
          <InputWrapper>
            <InputField
              type="text"
              value={formData.fullName}
              name="fullName"
              onChange={handleChange}
              disabled
            />
            <FixedLabel>이름</FixedLabel>
          </InputWrapper>

          <InputWrapper>
            <InputField
              type="email"
              value={formData.email}
              name="email"
              onChange={handleChange}
              disabled
            />
            <FixedLabel>이메일</FixedLabel>
          </InputWrapper>

          <InputWrapper>
            <InputField
              type="password"
              value={formData.password}
              name="password"
              onChange={handleChange}
              disabled
            />
            <FixedLabel>비밀번호</FixedLabel>
          </InputWrapper>
        </StyledForm>

        <SectionTitle>추가 정보</SectionTitle>
        <Divider />
        <StyledForm>
          <InputWrapper>
            <InputField
              type="text"
              value={formData.nickname}
              name="nickname"
              onChange={handleChange}
              onKeyDown={handleNicknameKeyDown} // 닉네임 엔터 처리
            />
            <FixedLabel>닉네임</FixedLabel>
          </InputWrapper>

          <InputWrapper>
            <TextArea
              value={formData.bio}
              name="bio"
              onChange={handleChange}
              onKeyDown={handleBioKeyDown} // 자기소개 엔터 처리
            />
            <FixedLabel>자기소개</FixedLabel>
          </InputWrapper>
        </StyledForm>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ProfileEditModal;




// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #d5c4ff;
  width: 500px;
  padding: 30px;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto; /* 스크롤 추가 */
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  color: #6c5dd3;
`;

const ProfileSection = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  border: 2px solid #6c5dd3;
  margin-bottom: 10px;
`;

const ProfileChangeButton = styled.button`
  font-size: 14px;
  color: #6c5dd3;
  background: none;
  border: none;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const SectionTitle = styled.h3`
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-align: left;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #ffffff;
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px; /* 간격 조정 */
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 12px;
`;

const InputField = styled.input`
  padding: 15px 10px 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  box-sizing: border-box;
  text-align: ${({ value }) => (value ? 'right' : 'left')}; /* 값이 있으면 오른쪽 정렬, 없으면 왼쪽 정렬 */
  &:focus {
    outline: none;
    border-color: #6c5dd3;
  }
`;


const TextArea = styled.textarea`
  padding: 15px 10px 5px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  font-size: 14px;
  height: 80px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #6c5dd3;
  }
`;

const FixedLabel = styled.span`
  position: absolute;
  top: 12px;
  left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #000;
  background-color: #fff;
  padding: 0 5px;
  pointer-events: none;
  z-index: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: -10px;
`;

const ChangePasswordButton = styled.button`
  background-color: #fff;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  &:hover {
    background-color: #5a4bc1;
  }
`;



