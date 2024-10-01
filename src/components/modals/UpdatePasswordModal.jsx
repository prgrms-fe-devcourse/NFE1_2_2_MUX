import React, { useState } from "react";
import styled from "styled-components";
import { updatePassword } from "../../utils/api"; // 분리된 API 파일 임포트

const UpdatePasswordModal = ({ isOpen, onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    const token = localStorage.getItem("token"); // token 가져오기

    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      // 비밀번호 변경 API 호출
      await updatePassword(newPassword, token);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      onClose(); // 모달 닫기
    } catch (err) {
      setError(err.message || "비밀번호 변경 실패");
    }
  };

  // 모달이 열리지 않으면 null을 반환
  if (!isOpen) return null;

  // 모달 클릭 처리 함수
  const handleModalClick = (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={handleModalClick}>
        <h2>비밀번호 변경</h2>
        <Input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          type="password"
          placeholder="새 비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button onClick={handlePasswordChange}>변경하기</Button>
        <Button onClick={onClose} secondary>
          취소
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UpdatePasswordModal;

// styled-components 스타일링
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #dac9f8; /* 라벤더 색상 */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;

  h2 {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #333;
  }
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  background: ${(props) => (props.secondary ? "#d3d3d3" : "#b89ae2")}; /* 라벤더 색상 */
  color: ${(props) => (props.secondary ? "#333" : "#fff")};
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  cursor: pointer;
  margin: 10px;
  font-size: 1rem;
  width: 100px;

  &:hover {
    background: ${(props) => (props.secondary ? "#bbb" : "#b89ae2")}; /* 더 진한 라벤더 색상 */
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 10px;
`;