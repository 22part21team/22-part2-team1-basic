import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '../../components/common/TextField/TextField';
import Toggle from '../../components/common/Toggle/Toggle';
import Option from '../../components/common/Option/Option';
import Button from '../../components/common/Button/Button';
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
  const [selectedImage, setSelectedImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 배경 색상 옵션
  const colorOptions = ['beige', 'purple', 'blue', 'green'];

  // 배경 이미지 옵션 (실제 프로젝트에서는 assets에서 가져옴)
  const imageOptions = [
    '/assets/images/post/bg-01.jpg',
    '/assets/images/post/bg-02.jpg',
    '/assets/images/post/bg-03.jpg',
    '/assets/images/post/bg-04.jpg',
  ];

  /**
   * 컴포넌트 마운트 시 이미지 기본값 설정
   */
  useEffect(() => {
    // 이미지 옵션의 첫 번째 항목을 기본값으로 설정
    setSelectedImage(imageOptions[0]);
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
   * 배경 타입 토글 핸들러
   *
   * @param {string} type - 선택된 배경 타입 ("left" | "right")
   */
  const handleBackgroundToggle = (type) => {
    setBackgroundType(type);
  };

  /**
   * 배경색 선택 핸들러
   *
   * @param {string} color - 선택된 색상
   */
  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  /**
   * 배경 이미지 선택 핸들러
   *
   * @param {string} image - 선택된 이미지 URL
   */
  const handleImageSelect = (image) => {
    setSelectedImage(image);
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
        backgroundImageURL: backgroundType === 'right' ? selectedImage : null,
      };

      // API 호출
      const response = await fetch('https://rolling-api.vercel.app/22-1/recipients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('롤링페이퍼 생성에 실패했습니다.');
      }

      const data = await response.json();

      // 생성된 롤링페이퍼 페이지로 이동
      navigate(`/post/${data.id}`);
    } catch (error) {
      console.error('롤링페이퍼 생성 오류:', error);
      alert('롤링페이퍼 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 생성하기 버튼 활성화 조건
  // const isFormValid = recipientName.trim() && !nameError;

  return (
    <>
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
              ) : (
                <Option
                  type="image"
                  options={imageOptions}
                  selected={selectedImage}
                  onSelect={handleImageSelect}
                />
              )}
            </div>
          </div>

          <div className={styles.buttonWrapper}>
          <Button size="large" disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? '생성 중...' : '생성하기'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCreate;