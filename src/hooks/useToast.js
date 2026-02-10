import { useState, useCallback, useRef } from 'react';

/**
 * 토스트 메시지 관리 커스텀 훅
 * @returns {Object} 토스트 상태와 표시 함수
 */
export const useToast = () => {
  const [toast, setToast] = useState({ show: false, message: '' });
  const timerRef = useRef(null);

  const showToast = useCallback((message) => {
    // 이미 실행 중인 토스트가 있는 경우, 진행 중이던 타이머 취소
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    // 이미 실행 중인 토스트가 있는 경우를 방지하기 위한 상태 초기화
    setToast({ show: false, message });

    // 토스트 동작 실행
    setTimeout(() => {
      setToast({ show: true, message });

      // 3초 뒤에 꺼지도록 설정
      timerRef.current = setTimeout(() => {
        setToast({ show: false, message: '' });
        timerRef.current = null;
      }, 3000);
    }, 10);
  }, []);

  return { toast, showToast };
};
