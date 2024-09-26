import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getUserData, uploadProfileImage } from '../../utils/api';

const ProfileEditModal = ({ userId, token, onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        nickname: '',
        bio: ''
    });

    const [profileImage, setProfileImage] = useState(null);
    const modalBackground = useRef();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUserData(userId, token);
                setFormData({
                    fullName: data.fullName,
                    email: data.email,
                    password: '',  // 비밀번호는 공란으로 남겨둠
                    nickname: data.username,
                    bio: data.bio || ''
                });
                setProfileImage(data.profileImage); 
            } catch (error) {
                console.error('사용자 정보를 불러올 수 없습니다.', error);
            } 
        };
        fetchUserData();
    }, [userId, token]);

    const handleImageChange = async (e) => {
        const imageFile = e.target.files[0]
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('isCover', false);

        try {
            const updateUser = await uploadProfileImage(formData, token);
            setProfileImage(updateUser.profileImage);    
        } catch (error) {
            console.error('프로필 이미지를 변경할 수 없습니다.', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (
        <ModalOverlay>
            <ModalContent ref={modalBackground}>
                <Header>
                    <ProfileImage src={profileImage} alt='프로필이미지' />
                    <input type='file' onChange={handleImageChange} />
                    <CloseBtn onClick={onClose}>X</CloseBtn>  {/* 모달 닫기 */}
                </Header>

                <SectionTitle>기본 정보</SectionTitle>
                <StyledForm>
                    <InputLabel>이름</InputLabel>
                    <InputField
                        type='text'
                        value={formData.fullName}
                        name='fullName'
                        disabled
                    />

                    <InputLabel>이메일</InputLabel>
                    <InputField 
                        type='email'
                        value={formData.email}
                        name='email'
                        disabled
                    />

                    <InputLabel>비밀번호</InputLabel>
                    <InputField
                        type='password'
                        value={formData.password}
                        name='password'
                        placeholder="비밀번호 변경"
                    />
                </StyledForm>

                <SectionTitle>추가 정보</SectionTitle>
                <StyledForm>
                    <InputLabel>닉네임</InputLabel>
                    <InputField
                        type='text'
                        value={formData.nickname}
                        name='nickname'
                        onChange={handleChange}
                    />

                    <InputLabel>자기소개</InputLabel>
                    <TextArea
                        value={formData.bio}
                        name='bio'
                        onChange={handleChange}
                    />
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
    background-color: #D5C4FF;
    width: 500px;
    padding: 20px;
    border-radius: 10px;
    position: relative;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const ProfileImage = styled.img`
    border-radius: 50%;
    width: 60px;
    height: 60px;
`;

const CloseBtn = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
`;

const SectionTitle = styled.h3`
    margin-top: 20px;
    color: #6C5DD3;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const InputLabel = styled.label`
    font-size: 14px;
    color: #4A4A4A;
`;

const InputField = styled.input`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 14px;
`;

const TextArea = styled.textarea`
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 14px;
    height: 80px;
`;
