import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getNotifications, markNotificationsAsSeen } from '../../utils/api.js'; // API 호출을 위한 함수들을 가져옴

// NotificationModal 컴포넌트: 알림 모달을 렌더링하고 알림 데이터를 관리
const NotificationModal = ({ show, onClose }) => {
  const [notifications, setNotifications] = useState([]); // 알림 데이터를 저장하는 상태
  const [loading, setLoading] = useState(true); // 로딩 상태를 관리하는 상태
  const [error, setError] = useState(''); // 오류 메시지를 저장하는 상태

  // 알림 데이터를 서버에서 불러오는 함수
  const fetchNotifications = async () => {
    setLoading(true); // 로딩 상태를 true로 설정하여 로딩 중임을 표시
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옴
    try {
      const fetchedNotifications = await getNotifications(token); // API를 통해 알림 데이터를 가져옴
      console.log('Fetched Notifications:', fetchedNotifications);
      setNotifications(fetchedNotifications); // 알림 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching notifications:', error); // 에러 발생 시 콘솔에 에러를 출력
      setError('알림을 불러오는 데 실패했습니다.'); // 사용자에게 표시할 오류 메시지 설정
    } finally {
      setLoading(false); // 데이터를 모두 불러온 후 로딩 상태를 false로 설정
    }
  };

  // 모달이 열릴 때 알림 데이터를 불러오기 위해 useEffect 사용
  useEffect(() => {
    if (show) {
      fetchNotifications(); // 모달이 열리면 알림을 불러옴
    }
  }, [show]); // show 값이 변경될 때마다 실행됨

// NotificationModal.js
const handleNotificationClick = async (notificationId) => {
  const token = localStorage.getItem('token');
  
  // token이 null인 경우 처리
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    // API 호출 - 토큰만 보내기
    await markNotificationsAsSeen(token); 

    // 클릭한 알림을 '본 것으로' 처리하여 UI 업데이트
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification._id === notificationId ? { ...notification, seen: true } : notification
      )
    );
  } catch (error) {
    console.error('Error marking notification as seen:', error);
  }
};

// 알림 작성자의 이름을 가져오는 함수 (닉네임이 없을 경우 전체 이름 또는 'Unknown'을 반환)
const getAuthorName = (author) => {
  if (author && typeof author === 'object') {
    try {
      // fullName을 JSON 파싱
      const parsedFullName = JSON.parse(author.fullName); 
      // 닉네임이 있으면 닉네임 반환, 없으면 전체 이름 반환
      return parsedFullName.nickName || parsedFullName.fullName || 'Unknown';
    } catch (error) {
      console.error('Error parsing fullName:', error);
      return 'Unknown'; // 파싱 실패 시 'Unknown' 반환
    }
  }
  return 'Unknown'; // 작성자가 없거나 타입이 맞지 않으면 'Unknown' 반환
};

  return (
    <ModalBackground show={show} onClick={onClose}> {/* 모달이 열려 있는지 여부에 따라 백그라운드가 보임 */}
      <ModalContainer onClick={(e) => e.stopPropagation()}> {/* 모달을 클릭할 때 이벤트 버블링을 막음 */}
        <h2>알림 목록</h2>
        {loading ? ( // 로딩 중일 때 '로딩 중...' 메시지를 표시
          <p>로딩 중...</p>
        ) : (
          <>
<NotificationList>
              {notifications.length === 0 ? (
                <p>알림이 없습니다.</p>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification._id}
                    seen={notification.seen}
                    onClick={() => handleNotificationClick(notification._id)}
                  >
                    {notification.comment ? (
                      `${getAuthorName(notification.author)} 님이 내 포스트에 댓글을 남겼습니다.`
                    ) : notification.like ? (
                      `${getAuthorName(notification.author)} 님이 내 포스트에 좋아요를 눌렀습니다.`
                    ) : (
                      '알림이 도착했습니다.'
                    )}
                  </NotificationItem>
                ))
              )}
            </NotificationList>
          </>
        )}
        <button onClick={onClose}>X</button> {/* 모달 닫기 버튼 */}
      </ModalContainer>
    </ModalBackground>
  );
};

export default NotificationModal;

// 모달의 백그라운드 스타일링
const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent;// 반투명 검정색 배경
  display: ${({ show }) => (show ? 'block' : 'none')}; // show가 true일 때만 모달을 표시
  z-index: 999; /* 모달 백그라운드도 다른 요소보다 위에 나타나도록 설정 */
`;

// 모달 컨테이너 스타일링 (고정된 크기 + 스크롤 추가)
const ModalContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background-color: #313131;
  color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  max-height: 300px; /* 모달 최대 높이 지정 */
  overflow-y: auto; /* 내용이 많으면 스크롤 추가 */
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* 다른 요소보다 위에 나타나도록 z-index 설정 */

  h2{
    font-size: 20px;
    font-weight: 400;
    margin-left: 10px;
  }

  button{
    color: white;
    background-color: transparent;
    border: none;
    right: 20px;
    padding: 15px;
    font-size: 20px;
    position: absolute;
  }
`;
const NotificationList = styled.ul`
  padding: 0;
  list-style: none;
`;

// 각각의 알림 아이템 스타일링
const NotificationItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #444;
  cursor: pointer;
  color: ${({ seen }) => (seen ? '#888' : 'white')}; /* seen 상태에 따라 글씨 색상 변경 */
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

