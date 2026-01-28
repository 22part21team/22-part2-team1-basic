import { Link } from 'react-router-dom';
import AddButton from '@/components/common/AddButton/AddButton';
import Label from './Label';
import styles from './Card.module.css';

/**
 * 생성된 롤링페이퍼 페이지의 개별 메시지 카드 컴포넌트
 * - simple 여부에 따라 추가 버튼 혹은 메시지 출력 모드로 전환
 * - 전달받은 작성자 정보, 관계 ( Label ), 메시지 내용 및 날짜를 포맷팅하여 표시
 *
 * @param {boolean} simple - 추가 버튼 모드 활성화 여부 ( 기본값 : false )
 * @param {string} profileImageURL - 작성자 프로필 이미지 URL
 * @param {string} sender - 작성자 이름
 * @param {string} relationship - 수신자와의 관계 ( Label 컴포넌트에 전달 )
 * @param {string} content - 메시지 본문
 * @param {string} createdAt - 메시지 생성 일자
 * @return {JSX.Element} 메시지 카드 또는 추가 액션 카드 UI
 */
function Card({ simple = false, profileImageURL, sender, relationship, content, createdAt }) {
  // createdAt을 디자인과 같은 형식으로 변환
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  }
  const data = createdAt ? formatDate(createdAt) : '';

  const cardStyle = simple ? `${styles.card} ${styles.simple}` : `${styles.card}`;

  return (
    <>
      {simple ? ( // 추가 버튼 모드
        <div className={cardStyle}>
          <Link to="/post/{id}/message" className={styles.linkButton}>
            <AddButton />
          </Link>
        </div>
      ) : (
        // 메시지 출력 모드
        <button className={styles.cardButton}>
          <div className={cardStyle}>
            <div className={styles.profile}>
              <img src={profileImageURL} alt={sender} className={styles.profileImg} />
              <div className={styles.proflieTextContainer}>
                <p className={styles.profileText}>
                  From. <span>{sender}</span>
                </p>
                <p className={styles.label}>
                  <Label relationship={relationship} />
                </p>
              </div>
            </div>
            <div className={styles.contentContainer}>
              <p className={styles.content}>{content}</p>
              <p className={styles.date}>{data}</p>
            </div>
          </div>
        </button>
      )}
    </>
  );
}

export default Card;
