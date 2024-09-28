import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { uploadProfileImage, updateUser } from '../../utils/api';

const ProfileEditModal = ({ user, token, onClose, onNicknameUpdate, onBioUpdate, setUser }) => {
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

  const handleImageChange = async (e) => {
    const imageFile = e.target.files[0];
  
    // 파일 형식 및 크기 제한
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(imageFile.type)) {
      alert('jpg 또는 png 형식의 파일만 업로드 가능합니다.');
      return;
    }
  
    const maxSizeInMB = 2;
    if (imageFile.size > maxSizeInMB * 1024 * 1024) {
      alert('파일 크기는 최대 2MB까지 허용됩니다.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('isCover', false);
  
    try {
      const response = await uploadProfileImage(formData, token);
  
      // 서버에서 반환된 이미지 URL 사용
      const imageUrl = response.image; // response의 'image' 필드를 사용
      if (!imageUrl) {
        console.error('이미지 URL이 없습니다.', response);
        alert('프로필 이미지 업로드에 실패했습니다.');
        return;
      }
  
      // 유저 상태에 프로필 이미지 업데이트
      const updatedUser = { ...user, profileImage: imageUrl };
  
      // 상태 업데이트 및 localStorage에 저장
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
  
      // 미리보기 업데이트
      setProfileImage(imageUrl); // 서버에서 받은 이미지 URL로 미리보기 설정
  
      alert('프로필 이미지가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('프로필 이미지를 변경할 수 없습니다.', error);
      alert('프로필 이미지를 변경하는 데 실패했습니다.');
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // 회원 정보 수정 버튼 클릭 시 닉네임과 자기소개 업데이트
  const handleSaveChanges = async () => {
    try {
      let nicknameUpdated = false;
      let bioUpdated = false;

      // 닉네임 업데이트
      if (formData.nickname !== user.fullName.nickName) {
        await updateUser(user.id, token, { username: formData.nickname });
        nicknameUpdated = true;
      }

      // 자기소개 업데이트
      if (formData.bio !== user.bio) {
        await updateUser(user.id, token, { comment: formData.bio });
        bioUpdated = true;
      }

      // 닉네임 업데이트가 성공적으로 완료된 경우
      if (nicknameUpdated) {
        onNicknameUpdate(formData.nickname);
      }

      // 자기소개 업데이트가 성공적으로 완료된 경우
      if (bioUpdated) {
        onBioUpdate(formData.bio);
      }

      alert('회원 정보가 성공적으로 변경되었습니다.');
    } catch (error) {
      alert('회원 정보 변경에 실패했습니다.');
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseBtn onClick={onClose}>X</CloseBtn>

        <ProfileSection>
          <ProfileImageWrapper>
            <ProfileImage
              src={profileImage || '/path/to/default-image.png'} // 변경된 이미지 또는 기본 이미지 사용
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
            />
            <FixedLabel>닉네임</FixedLabel>
          </InputWrapper>

          <InputWrapper>
            <TextArea
              value={formData.bio}
              name="bio"
              onChange={handleChange}
            />
            <FixedLabel>자기소개</FixedLabel>
          </InputWrapper>
        </StyledForm>

        <SaveButton onClick={handleSaveChanges}>회원 정보 수정</SaveButton>
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
  overflow-y: auto;
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
  gap: 12px;
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
  text-align: ${({ value }) => (value ? 'right' : 'left')};
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

const SaveButton = styled.button`
  background-color: #6c5dd3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 20px;
  &:hover {
    background-color: #5a4bc1;
  }
`;