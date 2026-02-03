import { Link } from 'react-router-dom';
import { DEFAULT_PROFILE_URL } from '@/constants/profileImage';
import { formatDate } from '@/utils/formatDate';
import { Outlined } from '@/components/common/Button';
import AddButton from '@/components/common/AddButton/AddButton';
import Label from './Label';
import trashIcon from '@/assets/images/common/icon-trashcan.svg';
import styles from './Card.module.css';

// API 폰트 이름을 CSS 폰트 이름으로 변환
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
 * 생성된 롤링페이퍼 페이지의 개별 메시지 카드 컴포넌트
 * - simple 여부에 따라 추가 버튼 혹은 메시지 출력 모드로 전환
 * - 전달받은 작성자 정보, 관계 ( Label ), 메시지 내용 및 날짜를 포맷팅하여 표시
 *
 * @param {boolean} simple - 추가 버튼 모드 활성화 여부 ( 기본값 : false )
 * @param {number} simpleId - 추가 버튼 모드에서 사용할 롤링페이퍼 id
 * @param {boolean} isEditMode - 편집 모드 활성화 여부
 * @param {string} profileImageURL - 작성자 프로필 이미지 URL
 * @param {string} sender - 작성자 이름
 * @param {string} relationship - 수신자와의 관계 ( Label 컴포넌트에 전달 )
 * @param {string} content - 메시지 본문 (HTML 형식)
 * @param {string} font - 메시지 폰트
 * @param {string} createdAt - 메시지 생성 일자
 * @param {Function} onMessageDeleteModal - 메시지 삭제 확인 모달 호출 함수
 * @return {JSX.Element} 메시지 카드 또는 추가 액션 카드 UI
 */
function Card({
  simple = false,
  simpleId,
  isEditMode,
  profileImageURL,
  sender,
  relationship,
  content,
  font,
  createdAt,
  onMessageDeleteModal,
}) {
  const data = createdAt ? formatDate(createdAt) : '';

  const cardStyle = simple ? `${styles.card} ${styles.simple}` : `${styles.card}`;

  return (
    <>
      {simple ? ( // 추가 버튼 모드
        <div className={cardStyle}>
          <Link to={`/post/${simpleId}/message`} className={styles.linkButton}>
            <AddButton />
          </Link>
        </div>
      ) : (
        // 메시지 출력 모드
        <div className={styles.cardButton}>
          <div className={cardStyle}>
            <div className={styles.profile}>
              {profileImageURL && profileImageURL !== DEFAULT_PROFILE_URL && !profileImageURL.includes('default_avatar') ? (
                <img src={profileImageURL} alt={sender} className={styles.profileImg} />
              ) : (
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.profileImg}
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
              <div className={styles.profileContainer}>
                <div className={styles.proflieTextContainer}>
                  <p className={styles.profileText}>
                    From. <span>{sender}</span>
                  </p>
                  <p className={styles.label}>
                    <Label relationship={relationship} />
                  </p>
                </div>
                {/* 편집 모드 */}
                {isEditMode && (
                  <Outlined
                    size="Trash"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMessageDeleteModal();
                    }}
                  >
                    <img src={trashIcon} alt="" />
                  </Outlined>
                )}
              </div>
            </div>
            <div className={styles.contentContainer}>
              <div
                className={styles.content}
                style={{ fontFamily: getFontFamily(font) }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <p className={styles.date}>{data}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
