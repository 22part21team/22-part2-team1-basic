import { Link } from 'react-router-dom';
import { Outlined } from '@/components/common/Button';
import ProfileList from '@/components/common/ProfileList/ProfileList';
import EmojiReactions from './EmojiReactions';
import LinkShare from './LinkShare';
import styles from './PostHeader.module.css';

/**
 * 생성된 롤링페이퍼 페이지용 상단 헤더 컴포넌트
 * 주요 포함 요소 :
 * - 수신자 이름
 * - 참여자 리스트 ( ProfileList )
 * - 이모지 반응 ( EmojiReactions )
 * - 공유 버튼 ( LinkShare )
 *
 * @param {number} id - 롤링페이퍼 수신자의 고유 식별 ID
 * @param {Object} recipient - 수신자 데이터 객체
 * @param {string} recipient.name - 수신자 이름
 * @param {number} recipient.messageCount - 전체 메시지 작성자 수
 * @param {Array} recipient.recentMessages - 최근 작성자 정보 객체가 담긴 배열 ( API 제공 최대 3명 )
 * @param {boolean} isEditMode - 편집 모드 활성화 여부
 * @return {JSX.Element} 상단 헤더 UI
 */
function PostHeader({ id, recipient, isEditMode }) {
  // ===== 데이터 구조 분해 할당 =====
  const { name, messageCount, recentMessages } = recipient;

  return (
    <header className={styles.postHeader}>
      <div className={styles.postHeaderContainer}>
        {/* 좌측 영역: 수신자 이름 및 홈 이동 버튼(모바일) */}
        <div className={styles.postHeaderTitle}>
          <h2 className={styles.h2Title}>
            <Link to={isEditMode ? `/post/${id}/` : `/post/${id}/edit/`}>To. {name}</Link>
          </h2>
          <Outlined size="36" className={styles.prevButton}>
            <Link to="/list">이전으로</Link>
          </Outlined>
        </div>

        {/* 우측 영역: 리액션 통계 및 인터랙션 액션 바 */}
        <nav className={styles.postHeaderActions}>
          {/* 작성자 통계 및 프로필 목록 */}
          <div className={styles.postInfo}>
            <ProfileList recentMessages={recentMessages} authorCount={messageCount} />
            <p>
              <span>{messageCount}</span>명이 작성했어요!
            </p>
          </div>
          <hr className={styles.dividerLine}></hr>
          <div className={styles.reactionGroup}>
            {/* 이모지 리액션 */}
            <div className={styles.postEmoji}>
              <EmojiReactions id={id} />
            </div>
            <hr className={styles.dividerLine}></hr>
            {/* 카카오톡 / URL 공유 드롭다운 */}
            <div className={styles.postShare}>
              <LinkShare recipient={recipient} />
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default PostHeader;
