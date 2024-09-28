// src/api.js
import axios from 'axios';

// 회원가입 API 호출
export const signup = async (email, password, fullName, nickName) => {
  const userInfo = {
    fullName: fullName,
    nickName: nickName,
  };

  const response = await axios.post('/api/signup', {
    email,
    password,
    fullName: JSON.stringify(userInfo),
  });

  return response.data; 
};

// 로그인 API 호출
export const login = async (email, password) => {
  const response = await axios.post('/api/login', {
    email,
    password,
  });

  return response.data; 
};

// 사용자 정보 가져오기 API 호출
export const getUserData = async (userId, token) => {
  const response = await axios.get(`/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // 토큰을 헤더로 전송
    },
  });

  return response.data;
};

// 프로필 이미지 업로드 API 호출
export const uploadProfileImage = async (formData, token) => {
  try {
    const response = await axios.post('/api/users/upload-photo', formData, {
      headers: {
        Authorization: `Bearer ${token}`,  // 토큰을 헤더로 전송
        'Content-Type': 'multipart/form-data',  // 파일 업로드 시 필요한 헤더
      },
    });
    console.log("Profile image upload response:", response.data); // 서버 응답 확인
    return response.data;  // 여기에 profileImage URL이 있어야 함.
  } catch (error) {
    console.error('프로필 이미지를 업로드할 수 없습니다.', error);
    throw error;
  }
};


// 사용자 정보 업데이트 API 호출
export const updateUser = async (userId, token, updatedData) => {
  try {
    const response = await axios.put(`/api/settings/update-user`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더로 전송
      },
    });
    return response.data;  // 성공적으로 업데이트한 사용자 정보 반환
  } catch (error) {
    console.error('사용자 정보를 업데이트할 수 없습니다.', error);
    throw error;
  }
};



