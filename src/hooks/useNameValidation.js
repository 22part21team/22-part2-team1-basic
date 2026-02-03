import { useState } from 'react';

/**
 * 이름 입력 및 검증 관리 커스텀 훅
 * @returns {Object} 이름 상태와 핸들러 함수들
 */
export const useNameValidation = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (nameError) {
      setNameError('');
    }
  };

  const handleNameBlur = () => {
    if (!name.trim()) {
      setNameError('값을 입력해 주세요');
    }
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError('값을 입력해 주세요');
      return false;
    }
    return true;
  };

  return {
    name,
    nameError,
    handleNameChange,
    handleNameBlur,
    validateName,
  };
};
