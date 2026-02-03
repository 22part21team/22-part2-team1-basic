import { useState, useEffect, useRef } from 'react';

/**
 * API 이미지 로딩 커스텀 훅
 * @param {string} endpoint - API 엔드포인트
 * @param {Function} onError - 에러 발생 시 콜백 함수
 * @param {Function} onSuccess - 이미지 로드 성공 시 콜백 함수
 * @returns {Object} 이미지 목록과 로딩 상태
 */
export const useApiImages = (endpoint, onError, onSuccess) => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 콜백 함수를 ref로 저장하여 의존성 배열 문제 해결
  const onErrorRef = useRef(onError);
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onErrorRef.current = onError;
    onSuccessRef.current = onSuccess;
  }, [onError, onSuccess]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(endpoint);
        
        if (response.ok) {
          const data = await response.json();
          const imageUrls = data.imageUrls || [];
          setImages(imageUrls);
          onSuccessRef.current?.(imageUrls);
        } else {
          console.error('이미지 로드 실패:', response.status);
          onErrorRef.current?.('이미지를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('이미지 로드 에러:', error);
        onErrorRef.current?.('이미지를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [endpoint]);

  return { images, isLoading };
};
