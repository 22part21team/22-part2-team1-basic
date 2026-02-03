import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../components/common/TextField/TextField';
import { Toggle } from '../../components/common/Button';
import Option from '../../components/common/Option/Option';
import Button from '../../components/common/Button/Button';
import Toast from '../../components/common/Toast/Toast';
import styles from './PostCreate.module.css';

/**
 * 롤링페이퍼 만들기 페이지 컴포넌트
 * 받는 사람 이름, 배경색 또는 배경 이미지를 선택하여 롤링페이퍼를 생성
 *
 * @return {JSX.Element} PostCreate 페이지 컴포넌트
 */
const PostCreate = () => {
  const navigate = useNavigate();

  // 폼 상태 관리
  const [recipientName, setRecipientName] = useState('');
  const [nameError, setNameError] = useState('');
  const [backgroundType, setBackgroundType] = useState('left'); // 'left' = 컬러, 'right' = 이미지
  const [selectedColor, setSelectedColor] = useState('beige');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 배경 이미지 목록 상태
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  
  // 토스트 메시지 상태
  const [toast, setToast] = useState({ show: false, message: '' });

  // 배경 색상 옵션
  const colorOptions = ['beige', 'purple', 'blue', 'green'];

  /**
   * 배경 이미지 목록 조회
   */
  useEffect(() => {
    const fetchBackgroundImages = async () => {
      try {
        const response = await fetch('https://rolling-api.vercel.app/background-images/');
        
        if (response.ok) {
          const data = await response.json();
          setBackgroundImages(data.imageUrls || []);
          // 첫 번째 이미지를 기본값으로 설정
          if (data.imageUrls && data.imageUrls.length > 0) {
            setSelectedImage(data.imageUrls[0]);
          }
        } else {
          console.error('배경 이미지 로드 실패:', response.status);
          showToast('배경 이미지를 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('배경 이미지 로드 에러:', error);
        showToast('배경 이미지를 불러올 수 없습니다.');
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchBackgroundImages();
  }, []);

  /**
   * 받는 사람 이름 입력 핸들러
   *
   * @param {Event} e - Input change 이벤트
   */
  const handleNameChange = (e) => {
    setRecipientName(e.target.value);
    // 입력 시 에러 메시지 제거
    if (nameError) {
      setNameError('');
    }
  };

/**
 * 받는 사람 이름 focus out 핸들러
 * 값이 없으면 에러 메시지 표시
 */
const handleNameBlur = () => {
  if (!recipientName.trim()) {
    setNameError('값을 입력해 주세요');
  }
};

  /**
   * 이름 필드 검증 헬퍼 함수
   * 배경 선택 등 다른 액션 시에도 이름 검증을 수행
   */
  const validateName = () => {
    if (!recipientName.trim()) {
      setNameError('값을 입력해 주세요');
    }
  };

  /**
   * 배경 타입 토글 핸들러
   *
   * @param {string} type - 선택된 배경 타입 ("left" | "right")
   */
  const handleBackgroundToggle = (type) => {
    validateName();
    setBackgroundType(type);
  };

  /**
   * 배경색 선택 핸들러
   *
   * @param {string} color - 선택된 색상
   */
  const handleColorSelect = (color) => {
    validateName();
    setSelectedColor(color);
  };

  /**
   * 배경 이미지 선택 핸들러
   *
   * @param {string} imageUrl - 선택된 이미지 URL
   */
  const handleImageSelect = (imageUrl) => {
    validateName();
    setSelectedImage(imageUrl);
  };

  /**
   * 토스트 메시지 표시
   */
  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  /**
   * 롤링페이퍼 생성 핸들러
   * API를 호출하여 새 롤링페이퍼를 생성하고 해당 페이지로 이동
   */
  const handleSubmit = async () => {
    // 유효성 검사
    if (!recipientName.trim()) {
      setNameError('값을 입력해 주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      // API 요청 데이터 구성
      const requestData = {
        name: recipientName,
        backgroundColor: backgroundType === 'left' ? selectedColor : 'beige',
        backgroundImageURL: backgroundType === 'right' && selectedImage ? selectedImage : null,
      };

      // API 호출
      const response = await fetch('https://rolling-api.vercel.app/22-1/recipients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      // 성공 응답 처리
      if (response.ok) {
        const data = await response.json();
        // 생성된 롤링페이퍼 페이지로 이동
        navigate(`/post/${data.id}`);
        return;
      }

      // 에러 응답 처리
      const status = response.status;
      let errorData;
      
      try {
        errorData = await response.json();
      } catch {
        errorData = {};
      }

      // 400번대 클라이언트 에러 - UI에 메시지 표시
      if (status >= 400 && status < 500) {
        const errorMessage = errorData.message || getClientErrorMessage(status);
        showToast(errorMessage);
        console.error('롤링페이퍼 생성 클라이언트 에러:', { status, errorData });
        return;
      }

      // 500번대 서버 에러 - 에러 페이지로 이동
      if (status >= 500) {
        navigate('/error', {
          state: {
            type: 'server',
            message: '서버에 일시적인 문제가 발생했습니다.',
          },
        });
        return;
      }

      // 기타 에러
      showToast('요청 처리 중 문제가 발생했습니다.');
      
    } catch (error) {
      // 네트워크 에러 - 에러 페이지로 이동
      console.error('롤링페이퍼 생성 네트워크 에러:', error);
      navigate('/error', {
        state: {
          type: 'network',
          message: '네트워크 연결을 확인해주세요.',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 클라이언트 에러 메시지 생성
   */
  const getClientErrorMessage = (status) => {
    switch (status) {
      case 400:
        return '잘못된 요청입니다. 입력 내용을 확인해주세요.';
      case 404:
        return '요청하신 데이터를 찾을 수 없습니다.';
      case 409:
        return '이미 존재하는 롤링페이퍼입니다.';
      case 422:
        return '입력 형식이 올바르지 않습니다.';
      default:
        return '롤링페이퍼 생성 중 오류가 발생했습니다.';
    }
  };

  // 생성하기 버튼 활성화 조건
  const isFormValid = recipientName.trim() && !nameError;

  return (
    <>
      {toast.show && <Toast message={toast.message} />}
      <div className={styles.container}>
        <div className={styles.content}>
          <TextField
            label="To."
            name="recipientName"
            value={recipientName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="받는 사람 이름을 입력해 주세요"
            error={nameError}
          />

          <div className={styles.backgroundSection}>
            <h2 className={styles.sectionTitle}>배경화면을 선택해 주세요.</h2>
            <p className={styles.sectionDescription}>
              컬러를 선택하거나, 이미지를 선택할 수 있습니다.
            </p>

            <div className={styles.toggleWrapper}>
              <Toggle
                leftOption="컬러"
                rightOption="이미지"
                selected={backgroundType}
                onToggle={handleBackgroundToggle}
              />
            </div>

            <div className={styles.optionWrapper}>
              {backgroundType === 'left' ? (
                <Option
                  type="color"
                  options={colorOptions}
                  selected={selectedColor}
                  onSelect={handleColorSelect}
                />
              ) : isLoadingImages ? (
                <p>이미지를 불러오는 중...</p>
              ) : (
                <Option
                  type="image"
                  options={backgroundImages}
                  selected={selectedImage}
                  onSelect={handleImageSelect}
                />
              )}
            </div>
          </div>

          <div className={styles.buttonWrapper}>
          <Button size="Large" disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? '생성 중...' : '생성하기'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCreate;