import { useState, useCallback } from 'react';

/**
 * 토스트 메시지 관리 커스텀 훅
 * @returns {Object} 토스트 상태와 표시 함수
 */
export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  }, []);

  return { toast, showToast };
};
