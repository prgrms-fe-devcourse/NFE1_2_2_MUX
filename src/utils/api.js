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

// 로그아웃 API 호출 함수
export const logout = async () => {
  try {
    // 로그아웃 요청 보내기
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('로그아웃 실패');
    }

    return response;
  } catch (error) {
    console.error('로그아웃 중 오류 발생:', error);
    throw error;
  }
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
    const response = await axios.get(`/posts/${postId}`);
    const post = response.data;
    return {
      likes: post.likes.length,
      comments: post.comments.length,
    };
  } catch (error) {
    console.error('Error fetching post reactions:', error);
    throw error;
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

// 음원 업로드 API 호출
export const createTrack = async (formData, token) => {
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

// 특정 채널의 포스트 목록을 가져오는 API
export const getChannelPosts = async (
  channelId,
  offset = 0,
  limit = 10,
  token,
) => {
  try {
    const response = await axios.get(`/api/posts/channel/${channelId}`, {
      params: { offset, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching channel posts:', error);
    throw error;
  }
};

export const fetchPostsByChannel = async (channelId, offset, limit, token) => {
  try {
    const response = await axios.get(`/api/posts/channel/${channelId}`, {
      params: { offset, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

// 특정 포스트 상세 정보 가져오기
export const getPostDetails = async (postId, token) => {
  try {
    const response = await axios.get(`/api/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('포스트 상세 정보를 가져오는데 실패했습니다:', error);
    throw error;
  }
};

// 좋아요 추가
export const addLike = async (postId, token) => {
  try {
    const response = await axios.post(
      '/api/likes/create',
      { postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

// 좋아요 취소 API 호출
export const removeLike = async (likeId, token) => {
  try {
    const response = await axios.delete('/api/likes/delete', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: likeId }, // body로 likeId 전달
    });
    return response.data;
  } catch (error) {
    console.error('좋아요 취소 중 오류 발생:', error);
    throw error;
  }
};

// 댓글 추가 API 호출
export const addComment = async (postId, comment, token) => {
  try {
    const response = await axios.post(
      '/api/comments/create',
      { postId, comment },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data; // 서버에서 반환하는 댓글 데이터
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// 댓글 삭제 API 호출
export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete('/api/comments/delete', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: commentId }, // body에 commentId 전송
    });
    return response.data;
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    throw error;
  }
};

export const getAuthUserData = async (token) => {
  try {
    const response = await axios.get('/api/auth-user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const deletePost = async (postId, token) => {
  try {
    const response = await axios.delete('/api/posts/delete', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { id: postId },
    });
    return response.data;
  } catch (error) {
    console.warn('게시글 삭제 중 서버 오류 발생:', error);
    // 오류가 발생해도 상위로 전파하여 PostFeed에서 처리하도록 함
    throw error;
  }
};

// 유저의 포스트 목록을 가져오는 함수
export const fetchPostsByAuthor = async (authorId, offset = 0, limit = 10) => {
  try {
    const response = await axios.get(`/api/posts/author/${authorId}`, {
      params: {
        offset, // 페이징을 위한 offset 파라미터
        limit, // 페이징을 위한 limit 파라미터
      },
    });
    return response.data; // 포스트 목록 리턴
  } catch (error) {
    console.error('Error fetching posts by author:', error);
    throw error; // 에러가 발생하면 throw
  }
};

// 포스트 목록을 가져오는 API
export const getPosts = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get('/api/posts', {
      params: { offset, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// 알림 관련 api들
export const getNotifications = async (token) => {
  const response = await fetch('/api/notifications', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json', // JSON 형식으로 요청
    },
  });

  if (!response.ok) {
    const errorText = await response.text(); // 응답 텍스트 읽기
    console.error('Error fetching notifications:', errorText); // 에러 로그
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json(); // JSON으로 변환하여 반환
};

// 알림 읽음 처리
export const markNotificationsAsSeen = async (token) => {
  try {
    const response = await axios.put(
      '/api/notifications/seen', // 경로가 맞는지 확인
      {}, // 본문은 비어 있음
      {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 헤더에 포함
        },
      },
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error(
      'Error marking notifications as seen:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

// 알림 생성
export const createNotification = async (
  notificationType,
  notificationTypeId,
  userId,
  postId,
  token,
) => {
  try {
    const response = await axios.post(
      '/api/notifications/create',
      {
        notificationType,
        notificationTypeId,
        userId,
        postId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰을 헤더에 추가
        },
      },
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
    } else if (error.request) {
      console.error('Error Request:', error.request);
    }
  }
};

export const searchArtistPosts = async (
  query,
  token,
  offset = 0,
  limit = 10,
) => {
  const channelId = '66fb53f9ed2d3c14a64eb9ea'; // 추천 포스트 채널 ID
  try {
    const response = await axios.get(`/api/posts/channel/${channelId}`, {
      params: { offset, limit, query }, // query 파라미터 추가
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recommended posts:', error);
    throw error;
  }
};

export const searchRecommendedPosts = async (
  query,
  token,
  offset = 0,
  limit = 10,
) => {
  const channelId = '66fb541ced2d3c14a64eb9ee'; // 추천 포스트 채널 ID
  try {
    const response = await axios.get(`/api/posts/channel/${channelId}`, {
      params: { offset, limit, query }, // query 파라미터 추가
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching recommended posts:', error);
    throw error;
  }
};

export const searchUsers = async (query, token) => {
  try {
    const response = await axios.get(`/api/search/all/${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // (User | Post)[] 반환
  } catch (error) {
    console.error('Error performing search:', error);
    throw error;
  }
};
