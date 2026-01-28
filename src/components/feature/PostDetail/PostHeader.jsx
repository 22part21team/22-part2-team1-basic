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
 * @param {Object} recipient - 수신자 데이터 객체
 * @param {string} recipient.name - 수신자 이름
 * @param {number} recipient.messageCount - 전체 메시지 작성자 수
 * @param {Array} recipient.recentMessages - 최근 메시지를 작성한 유저 리스트 (프로필 이미지 포함)
 * @return {JSX.Element} 상단 헤더 UI
 */
function PostHeader({ recipient }) {
  const { name, messageCount, recentMessages } = recipient;

  return (
    <div className={styles.postHeader}>
      <div className={styles.postHeaderContainer}>
        <h2 className={styles.h2Title}>To. {name}</h2>
        <div className={styles.postHeaderActions}>
          <div className={styles.postInfo}>
            <ProfileList recentMessages={recentMessages} authorCount={messageCount} />
            <p>
              <span>{messageCount}</span>명이 작성했어요!
            </p>
          </div>
          <div className={styles.postEmoji}>
            <EmojiReactions />
          </div>
          <div className={styles.postShare}>
            <LinkShare />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostHeader;
