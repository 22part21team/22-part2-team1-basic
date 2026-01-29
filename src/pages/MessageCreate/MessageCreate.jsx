import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TextField from '../../components/common/TextField/TextField';
import Button from '../../components/common/Button/Button';
import styles from './MessageCreate.module.css';

// 프로필 이미지 import
import profileImage1 from '@/assets/images/message/message-profilechoice-01.jpg';
import profileImage2 from '@/assets/images/message/message-profilechoice-02.jpg';
import profileImage3 from '@/assets/images/message/message-profilechoice-03.jpg';
import profileImage4 from '@/assets/images/message/message-profilechoice-04.jpg';
import profileImage5 from '@/assets/images/message/message-profilechoice-05.jpg';
import profileImage6 from '@/assets/images/message/message-profilechoice-06.jpg';
import profileImage7 from '@/assets/images/message/message-profilechoice-07.jpg';
import profileImage8 from '@/assets/images/message/message-profilechoice-08.jpg';

// 프로필 이미지 옵션 (컴포넌트 외부에 선언)
// NOTE: 현재는 로컬 이미지 사용 (Vite의 import를 통해 번들링)
// TODO: 추후 사용자 파일 업로드 기능 추가 시, 업로드된 이미지 URL로 교체
const PROFILE_IMAGE_OPTIONS = [
  profileImage1,
  profileImage2,
  profileImage3,
  profileImage4,
  profileImage5,
  profileImage6,
  profileImage7,
  profileImage8,
];

// 기본 프로필 이미지
const DEFAULT_PROFILE_IMAGE = profileImage1;

/**
 * 롤링페이퍼 메시지 작성 페이지 컴포넌트
 * 특정 롤링페이퍼에 메시지를 작성하고 전송
 *
 * @return {JSX.Element} MessageCreate 페이지 컴포넌트
 */
const MessageCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 롤링페이퍼 ID

  // 폼 상태 관리
  const [senderName, setSenderName] = useState('');
  const [nameError, setNameError] = useState('');
  const [selectedProfileImage, setSelectedProfileImage] = useState('');
  const [relationship, setRelationship] = useState('지인');
  const [content, setContent] = useState('');
  const [font, setFont] = useState('Noto Sans');
  const [recipientInfo, setRecipientInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 관계 옵션
  const relationshipOptions = ['친구', '지인', '동료', '가족'];

  // 폰트 옵션
  const fontOptions = ['Noto Sans', 'Pretendard', '나눔명조', '나눔손글씨 손편지체'];

  /**
   * 롤링페이퍼 정보 조회
   * 페이지 로드 시 recipient 정보를 가져옴
   */
  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        const response = await fetch(`https://rolling-api.vercel.app/22-1/recipients/${id}/`);

        if (!response.ok) {
          throw new Error('롤링페이퍼 정보를 가져올 수 없습니다.');
        }

        const data = await response.json();
        setRecipientInfo(data);
      } catch (error) {
        console.error('롤링페이퍼 정보 조회 오류:', error);
        alert('롤링페이퍼를 찾을 수 없습니다.');
        navigate('/list');
      }
    };

    fetchRecipientInfo();
  }, [id, navigate]);

  /**
   * 보내는 사람 이름 입력 핸들러
   *
   * @param {Event} e - Input change 이벤트
   */
  const handleNameChange = (e) => {
    setSenderName(e.target.value);
    if (nameError) {
      setNameError('');
    }
  };

  /**
   * 보내는 사람 이름 focus out 핸들러
   */
  const handleNameBlur = () => {
    if (!senderName.trim()) {
      setNameError('값을 입력해 주세요');
    }
  };

  /**
   * 프로필 이미지 선택 핸들러
   *
   * @param {string} imageUrl - 선택된 이미지 URL
   */
  const handleProfileImageSelect = (imageUrl) => {
    setSelectedProfileImage(imageUrl);
  };

  /**
   * 사용자 파일 업로드 핸들러 (추후 구현 예정)
   * TODO: 파일 업로드 기능 구현
   * - 이미지 파일 선택 (input type="file")
   * - 이미지 업로드 (아마 클라우드 스토리지 사용 예정)
   * - 업로드된 이미지 URL을 selectedProfileImage에 설정
   * 
   * @param {Event} e - File input change 이벤트
   */
  // const handleFileUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //
  //   // 파일 타입 검증
  //   if (!file.type.startsWith('image/')) {
  //     alert('이미지 파일만 업로드 가능합니다.');
  //     return;
  //   }
  //
  //   // 파일 크기 검증 (예: 5MB 제한)
  //   if (file.size > 5 * 1024 * 1024) {
  //     alert('파일 크기는 5MB 이하여야 합니다.');
  //     return;
  //   }
  //
  //   try {
  //     // TODO: 실제 업로드 API 호출
  //     // const formData = new FormData();
  //     // formData.append('image', file);
  //     // const response = await fetch('YOUR_UPLOAD_API_URL', {
  //     //   method: 'POST',
  //     //   body: formData,
  //     // });
  //     // const data = await response.json();
  //     // setSelectedProfileImage(data.imageUrl);
  //   } catch (error) {
  //     console.error('이미지 업로드 실패:', error);
  //     alert('이미지 업로드에 실패했습니다.');
  //   }
  // };

  /**
   * 관계 선택 핸들러
   *
   * @param {Event} e - Select change 이벤트
   */
  const handleRelationshipChange = (e) => {
    setRelationship(e.target.value);
  };

  /**
   * 메시지 내용 입력 핸들러
   *
   * @param {Event} e - Textarea change 이벤트
   */
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  /**
   * 폰트 선택 핸들러
   *
   * @param {Event} e - Select change 이벤트
   */
  const handleFontChange = (e) => {
    setFont(e.target.value);
  };

  /**
   * 메시지 전송 핸들러
   * API를 호출하여 메시지를 생성하고 롤링페이퍼 페이지로 이동
   */
  const handleSubmit = async () => {
    // 유효성 검사
    if (!senderName.trim()) {
      setNameError('값을 입력해 주세요');
      return;
    }

    if (!content.trim()) {
      alert('메시지 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 프로필 이미지가 선택되지 않았으면 기본 이미지 사용
      const finalProfileImage = selectedProfileImage || DEFAULT_PROFILE_IMAGE;

      // API 요청 데이터 구성
      const requestData = {
        sender: senderName,
        profileImageURL: finalProfileImage,
        relationship: relationship,
        content: content,
        font: font,
      };

      // API 호출
      const response = await fetch(
        `https://rolling-api.vercel.app/22-1/recipients/${id}/messages/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error('메시지 전송에 실패했습니다.');
      }

      // 롤링페이퍼 페이지로 이동
      navigate(`/post/${id}`);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      alert('메시지 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 생성하기 버튼 활성화 조건
  const isFormValid = senderName.trim() && content.trim() && !nameError;

  if (!recipientInfo) {
    return (
      <div className={styles.loadingContainer}>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
          <TextField
            label="From."
            name="senderName"
            value={senderName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            placeholder="이름을 입력해 주세요"
            error={nameError}
          />

          <div className={styles.fieldGroup}>
            <label className={styles.label}>프로필 이미지</label>
            <div className={styles.profileSection}>
              <div className={styles.defaultProfileIcon}>
                {selectedProfileImage ? (
                  <img
                    src={selectedProfileImage}
                    alt="선택된 프로필"
                    className={styles.defaultProfileImage}
                  />
                ) : (
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 20C23.3137 20 26 17.3137 26 14C26 10.6863 23.3137 8 20 8C16.6863 8 14 10.6863 14 14C14 17.3137 16.6863 20 20 20Z"
                      fill="#999999"
                    />
                    <path
                      d="M20 22C13.3726 22 8 27.3726 8 34H32C32 27.3726 26.6274 22 20 22Z"
                      fill="#999999"
                    />
                  </svg>
                )}
              </div>
              <div className={styles.profileContent}>
                <p className={styles.description}>프로필 이미지를 선택해주세요!</p>
                <div className={styles.profileImageGrid}>
                  {PROFILE_IMAGE_OPTIONS.map((imageUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleProfileImageSelect(imageUrl)}
                      className={`${styles.profileImageButton} ${
                        selectedProfileImage === imageUrl ? styles.selected : ''
                      }`}
                    >
                      <img
                        src={imageUrl}
                        alt={`프로필 ${index + 1}`}
                        className={styles.profileImage}
                      />
                    </button>
                  ))}
                </div>

                {/* 파일 업로드 기능 추가 시 활성화 할 코드 */}
                {/* 
                <div className={styles.uploadSection}>
                  <label htmlFor="profile-upload" className={styles.uploadButton}>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className={styles.fileInput}
                    />
                    <span>내 기기에서 업로드</span>
                  </label>
                </div>
                */}
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="relationship" className={styles.label}>
              상대와의 관계
            </label>
            <select
              id="relationship"
              value={relationship}
              onChange={handleRelationshipChange}
              className={styles.select}
            >
              {relationshipOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="content" className={styles.label}>
              내용을 입력해 주세요
            </label>
            <div className={styles.editorContainer}>
              <div className={styles.editorToolbar}>
                <button type="button" className={styles.toolbarButton} title="Bold">
                  <strong>B</strong>
                </button>
                <button type="button" className={styles.toolbarButton} title="Italic">
                  <em>I</em>
                </button>
                <button type="button" className={styles.toolbarButton} title="Underline">
                  <u>U</u>
                </button>
                <div className={styles.toolbarDivider}></div>
                <button type="button" className={styles.toolbarButton} title="Align Left">
                  ≡
                </button>
                <button type="button" className={styles.toolbarButton} title="Align Center">
                  ≡
                </button>
                <button type="button" className={styles.toolbarButton} title="Align Right">
                  ≡
                </button>
                <div className={styles.toolbarDivider}></div>
                <button type="button" className={styles.toolbarButton} title="Ordered List">
                  ⋮
                </button>
                <button type="button" className={styles.toolbarButton} title="Bullet List">
                  •
                </button>
                <div className={styles.toolbarDivider}></div>
                <button type="button" className={styles.toolbarButton} title="Link">
                  🔗
                </button>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder="I am your reach text editor."
                className={styles.textarea}
                style={{ fontFamily: font }}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="font" className={styles.label}>
              폰트 선택
            </label>
            <select id="font" value={font} onChange={handleFontChange} className={styles.select}>
              {fontOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.buttonWrapper}>
            <Button size="Large" disabled={!isFormValid || isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? '전송 중...' : '생성하기'}
            </Button>
          </div>
        </div>
    </div>
  );
};

export default MessageCreate;