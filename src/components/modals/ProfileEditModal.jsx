import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getUserData, updateUserProfile, uploadProfileImage } from '../../utils/api';

const ProfileEditModal = ({userId, token}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const modalBackground = useRef();

    //모달 열기/닫기
    const openModalHandler = () => {
        setIsOpen(!isOpen);
    };

    const closeModalHandler = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            const fetchUserData = async () => {
                try {
                    const data = await getUserData(userId, token);
                    setProfileImage(data.profileImage); 
                } catch (error) {
                    console.error("사용자 정보를 불러올 수 없습니다.", error);
                }
            };
            fetchUserData();
        }
    }, [isOpen, userId, token]);

    //프로필 이미지 변경
    const handleImageChange = async (e) => {
        const imageFile = e.target.files[0]
        const formDatam = new FormData();
        formDatam.append('image', imageFile);
        formDatam.append('isCover', false);

        try {
            const updateUser = await uploadProfileImage(formData, token);
            setProfileImage(updateUser.profileImage);    
        } catch (error) {
            console.error("프로필 이미지를 변경할 수 없습니다.", error);
        }
    };



    return(
        <ModalContainer>
            <ModalBtn onClick={openModalHandler}>회원 정보 수정</ModalBtn>
            {isOpen && (
                <ModalOverlay>
                    <ModalContent ref={modalBackground}>
                        <Header>
                            <ProfileImage src={profileImage} alt="프로필이미지" />
                            <input type="file" onChange={handleImageChange} />
                            <CloseBtn onClick={closeModalHandler}></CloseBtn>
                        </Header>
                    </ModalContent>
                </ModalOverlay>
            )}
        </ModalContainer>
    );
};

export default ProfileEditModal;

// 스타일 컴포넌트
const ModalBtn = styled.button`
    padding: 10px 20px;
    background-color: #6C5DD3;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

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