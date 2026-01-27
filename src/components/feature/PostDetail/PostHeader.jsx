/**
 * 롤링페이퍼 상세 페이지 ( post/{id} ) 에서 사용하는 헤더 컴포넌트
 *
 * 주요 포함 요소 :
 * - 롤링페이퍼 유저 이름
 * - 참여자 리스트 ( ProfileList )
 * - 이모지 반응 ( EmojiReactions )
 * - 공유 버튼
 *
 * @return 롤링페이퍼 상세 페이지 헤더 UI
 */

import ProfileList from '@/components/common/ProfileList/ProfileList';
import EmojiReactions from './EmojiReactions';
import styles from './PostHeader.module.css';

function PostHeader() {
  return (
    <div className={styles.postHeader}>
      <div className={styles.postHeaderContainer}>
        <h2 className={styles.h2Title}>To. Ashley Kim</h2>
        <div className={styles.postHeaderActions}>
          <div className={styles.postInfo}>
            <ProfileList authorCount={6} />
            <p>
              <span>23</span>명이 작성했어요!
            </p>
          </div>
          <div className={styles.postEmoji}>
            <EmojiReactions />
          </div>
          <div className={styles.postShare}>
            <button style={{ width: '36px', height: '32px', border: '1px solid gray' }}>
              공유
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
