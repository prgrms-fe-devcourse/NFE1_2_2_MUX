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

  return response.data; // 응답 데이터 반환
};

// 로그인 API 호출
export const login = async (email, password) => {
  const response = await axios.post('/api/login', {
    email,
    password,
  });

  return response.data; // 응답 데이터 반환
};

// 사용자 정보 가져오기 API 호출
export const getUserData = async (userId, token) => {
  const response = await axios.get(`/api/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // 토큰을 헤더로 전송
    },
  });

  return response.data; // 응답 데이터 반환
};

// 포스트 작성 API 호출
export const createPost = async (formData, token) => {
  try {
    const response = await axios.post('/api/posts/create', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
