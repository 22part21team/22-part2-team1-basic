import { createPortal } from 'react-dom';
import { DEFAULT_PROFILE_URL } from '@/constants/profileImage';
import { formatDate } from '@/utils/formatDate';
import { MountAnimation } from '@/components/common/MountAnimation/MountAnimation';
import Label from './Label';
import DOMPurify from 'dompurify';
import Button from '@/components/common/Button/Button';
import styles from './CardModal.module.css';

/**
 * API로부터 전달받은 폰트 이름을 CSS 적용 가능한 이름으로 변환
 * @param {string} apiFont - API 데이터의 폰트명
 * @returns {string} 실제 CSS 폰트 패밀리명
 */
const getFontFamily = (apiFont) => {
  const fontMap = {
    'Noto Sans': 'Noto Sans KR',
    Pretendard: 'Pretendard',
    나눔명조: 'Nanum Myeongjo',
    '나눔손글씨 손편지체': 'Nanum Pen Script',
  };
  return fontMap[apiFont] || 'Noto Sans KR';
};

/**
 * 메시지 카드의 상세 내용을 보여주는 모달 컴포넌트
 * - createPortal을 사용하여 modal-root 노드에 렌더링
 * - 배경(overlay) 클릭 시 닫기 기능 제공
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {function} onClose - 모달 닫기 핸들러 함수
 * @param {string} profileImageURL - 작성자 프로필 이미지 URL
 * @param {string} sender - 작성자 이름
 * @param {string} relationship - 수신자와의 관계 ( Label 컴포넌트에 전달 )
 * @param {string} content - 메시지 본문 (HTML 형식)
 * @param {string} font - 메시지 폰트
 * @param {string} createdAt - 메시지 생성 일자
 * @return {React.ReactPortal | null} modal-root에 렌더링되는 모달 UI 또는 null
 */
function CardModal({
  isOpen,
  onClose,
  profileImageURL,
  sender,
  relationship,
  content,
  font,
  createdAt,
}) {
  // ===== 포탈 타겟 설정 =====
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;
  // ===== 날짜 포매팅 =====
  const formattedDate = createdAt ? formatDate(createdAt) : '';

  /**
   * DOMPurify 옵션
   */
  const sanitizedContent = DOMPurify.sanitize(content, {
    FORBID_TAGS: ['a'],
  });

  return createPortal(
    <MountAnimation visible={isOpen}>
      <div className={styles.cardModalContainer}>
        {/* 모달 본문 : 클릭 시 닫히지 않도록 이벤트 전파 방지 */}
        <div className={styles.cardModal} onClick={(e) => e.stopPropagation()}>
          {/* 상단 : 프로필 정보 및 작성일 영역 */}
          <div className={styles.profile}>
            <div className={styles.user}>
              {profileImageURL &&
              profileImageURL !== DEFAULT_PROFILE_URL &&
              !profileImageURL.includes('default_avatar') ? (
                <img
                  src={profileImageURL}
                  alt={`${sender}님의 프로필`}
                  className={styles.userImg}
                />
              ) : (
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.userImg}
                >
                  <circle cx="28" cy="28" r="28" fill="#E3E3E3" />
                  <path
                    d="M28 28C31.3137 28 34 25.3137 34 22C34 18.6863 31.3137 16 28 16C24.6863 16 22 18.6863 22 22C22 25.3137 24.6863 28 28 28Z"
                    fill="#999999"
                  />
                  <path
                    d="M28 30C21.3726 30 16 35.3726 16 42H40C40 35.3726 34.6274 30 28 30Z"
                    fill="#999999"
                  />
                </svg>
              )}
              <div className={styles.userTextContainer}>
                <p className={styles.userText}>
                  From. <span>{sender}</span>
                </p>
                <p className={styles.label}>
                  <Label relationship={relationship} />
                </p>
              </div>
            </div>
            <p className={styles.date}>{formattedDate}</p>
          </div>
          {/* 하단 : 스크롤 가능한 메시지 본문 영역 */}
          <div className={styles.contentContainer}>
            <div
              className={styles.content}
              style={{ fontFamily: getFontFamily(font) }}
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />
            <div className={styles.closeButtonContainer}>
              <Button size="40" onClick={onClose} className={styles.closeButton}>
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* 배경 레이어 : 클릭 시 모달 닫힘 */}
      <div className={styles.overlay} onClick={onClose}></div>
    </MountAnimation>,
    modalRoot
  );
}

export default CardModal;
