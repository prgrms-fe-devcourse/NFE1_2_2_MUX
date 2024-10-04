import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? 'block' : 'none')};
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -20%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
`;

const NotificationButton = styled.button`
  position: relative;
  background-color: lavender;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
`;

const NotificationModal = ({ show, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  // 알림 목록을 불러오는 함수
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchNotifications();
    }
  }, [show]);

  return (
    <ModalBackground show={show} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <h2>알림 목록</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
        <button onClick={onClose}>닫기</button>
      </ModalContainer>
    </ModalBackground>
  );
};

export default NotificationModal;