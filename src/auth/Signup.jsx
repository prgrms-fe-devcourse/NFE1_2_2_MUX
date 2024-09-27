import React, { useState } from 'react';
import { signup } from '../utils/api'; 
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Signup = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용
  const [email, setEmail] = useState(''); // 이메일 상태 관리
  const [fullName, setFullName] = useState(''); // 이름 상태 관리
  const [password, setPassword] = useState(''); // 비밀번호 상태 관리
  const [nickName, setNickName] = useState(''); // 닉네임 상태 관리
  const [passwordConfirm, setPasswordConfirm] = useState(''); // 비밀번호 확인 상태 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 관리

  // 회원가입 처리 함수
  const handleSignup = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    
    // 비밀번호와 비밀번호 확인 값이 일치하지 않으면 에러 메시지 출력
    if (password !== passwordConfirm) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      // signup 함수 호출로 회원가입 처리
      const { token, user } = await signup(email, password, fullName, nickName);
      
      // 성공 시 토큰을 로컬 스토리지에 저장하고 콘솔에 회원 정보 출력
      localStorage.setItem('token', token);
      console.log('회원가입 성공:', user);
      
      // 회원가입 성공 후 로그인 페이지로 이동
      navigate('/login');
    } catch (error) {
      // 이미 사용 중인 이메일일 경우 에러 메시지 출력
      if (error.response && error.response.status === 400) {
        setErrorMessage('이미 사용 중인 이메일입니다.');
      } else {
        // 기타 오류 발생 시 에러 메시지 출력
        setErrorMessage('회원가입 중 오류가 발생했습니다.');
      }
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <SignupContainer>
      <Form onSubmit={handleSignup}>
        <Title>회원가입</Title>
        
        {/* 이메일 입력 필드 */}
        <Label>이메일</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* 이름 입력 필드 */}
        <Label>이름</Label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        
        {/* 닉네임 입력 필드 */}
        <Label>닉네임</Label>
        <Input
          type="text"
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
          required
        />
        
        {/* 비밀번호 입력 필드 */}
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        {/* 비밀번호 확인 입력 필드 */}
        <Label>비밀번호 확인</Label>
        <Input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        
        {/* 회원가입 완료 버튼 */}
        <Button type="submit">완료</Button>
        
        {/* 에러 메시지 출력 */}
        {errorMessage && (
          <ErrorMessage>{errorMessage}</ErrorMessage>
        )}  
      </Form>
    </SignupContainer>
  );
};

export default Signup;

// 스타일드 컴포넌트
const SignupContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 60px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333333;
`;

const Label = styled.label`
  margin-bottom: 3px;
  color: #333333;
  font-size: 14px;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 10px;
  width: 300px;
  margin-bottom: 10px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: #ffffff;
  color: #333333;
  
  &:focus {
    border-color: #BF94E4; 
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Button = styled.button`
  padding: 12px;
  background-color: #BF94E4;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 30px;
  font-weight: bold;

  &:hover {
    background-color: #D3D3D3;
  }
`;