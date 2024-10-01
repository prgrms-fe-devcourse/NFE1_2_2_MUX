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
  if (!userId) {
    throw new Error('User ID is required');
  }
  try {
    const response = await axios.get(`/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get user data:', error);
    throw error;
  }
};

// 사용자 목록을 가져오는 API
export const getUsers = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get(`/api/users/get-users`, {
      params: { offset, limit },
    });
    return response.data; // 사용자 목록 반환
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // 에러 발생 시 호출한 곳으로 던짐
  }
};

// 프로필 이미지 업로드 API 호출
export const uploadProfileImage = async (formData, token) => {
  try {
    const response = await axios.post('/api/users/upload-photo', formData, {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 헤더로 전송
        'Content-Type': 'multipart/form-data', // 파일 업로드 시 필요한 헤더
      },
    });
    console.log('Profile image upload response:', response.data); // 서버 응답 확인
    return response.data; // 여기에 profileImage URL이 있어야 함.
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
    return response.data; // 성공적으로 업데이트한 사용자 정보 반환
  } catch (error) {
    console.error('사용자 정보를 업데이트할 수 없습니다.', error);
    throw error;
  }
};

// 포스트의 좋아요 및 댓글 수를 가져오는 API
export const fetchPostReactions = async (postId) => {
  try {
    const response = await axios.get(`${API_HOST}/posts/${postId}`);
    return response.data; // 실제로 필요한 데이터 반환
  } catch (error) {
    console.error('Error fetching post reactions:', error);
    throw error; // 에러를 호출한 곳에서 처리할 수 있도록 throw
  }
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

// 비밀번호 업데이트 함수
export const updatePassword = async (newPassword, token) => {
  try {
    const response = await axios.put(
      `/api/settings/update-password`,
      { password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 추가
        },
      },
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error('Error updating password:', error);
    throw error; // 에러 던지기
  }
};
