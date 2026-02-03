import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../components/common/TextField/TextField';
import { Toggle } from '../../components/common/Button';
import Option from '../../components/common/Option/Option';
import Button from '../../components/common/Button/Button';
import Toast from '../../components/common/Toast/Toast';
import { useToast } from '../../hooks/useToast';
import { useNameValidation } from '../../hooks/useNameValidation';
import { useApiImages } from '../../hooks/useApiImages';
import { post } from '../../utils/apiClient';
import { COLOR_OPTIONS } from '../../constants/form';
import { API_ENDPOINTS } from '../../constants/api';
import styles from './PostCreate.module.css';

/**
 * 롤링페이퍼 만들기 페이지 컴포넌트
 * 받는 사람 이름, 배경색 또는 배경 이미지를 선택하여 롤링페이퍼를 생성
 *
 * @return {JSX.Element} PostCreate 페이지 컴포넌트
 */
const PostCreate = () => {
  const navigate = useNavigate();

  // 커스텀 훅
  const { toast, showToast } = useToast();
  const { name: recipientName, nameError, handleNameChange, handleNameBlur, validateName } = useNameValidation();
  const { images: backgroundImages, isLoading: isLoadingImages } = useApiImages(
    API_ENDPOINTS.BACKGROUND_IMAGES,
    showToast,
    (images) => {
      // 첫 번째 이미지를 기본값으로 설정
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
    }
  );

  // 폼 상태 관리
  const [backgroundType, setBackgroundType] = useState('left'); // 'left' = 컬러, 'right' = 이미지
  const [selectedColor, setSelectedColor] = useState('beige');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


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
   * 롤링페이퍼 생성 핸들러
   * API를 호출하여 새 롤링페이퍼를 생성하고 해당 페이지로 이동
   */
  const handleSubmit = async () => {
    // 유효성 검사
    if (!validateName()) {
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
      const data = await post('/recipients/', requestData, '롤링페이퍼 생성');
      
      // 생성된 롤링페이퍼 페이지로 이동
      navigate(`/post/${data.id}`);
    } catch (error) {
      console.error('롤링페이퍼 생성 에러:', error);

      // 네트워크 에러 - 에러 페이지로 이동
      if (error.isNetworkError) {
        navigate('/error', {
          state: {
            type: 'network',
            message: error.message,
          },
        });
        return;
      }

      // 400번대 클라이언트 에러 - UI에 메시지 표시
      if (error.status >= 400 && error.status < 500) {
        showToast(error.message);
        return;
      }

      // 500번대 서버 에러 - 에러 페이지로 이동
      if (error.status >= 500) {
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
    } finally {
      setIsSubmitting(false);
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
                  options={COLOR_OPTIONS}
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