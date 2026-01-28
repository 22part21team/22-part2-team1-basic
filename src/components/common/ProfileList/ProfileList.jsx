import styles from './ProfileList.module.css';

const MAX_PROFILE_COUNT = 3;

/**
 * 참여자 프로필 이미지 요약 리스트 컴포넌트
 * - 최대 3개의 최근 작성자 이미지를 중첩 표시, 초과분은 +N 형태로 노출
 *
 * @param {Array} recentMessages - 최근 작성자 정보 객체가 담긴 배열 ( API 제공 최대 3명 )
 * @param {number} authorCount - 롤링페이퍼를 작성한 총 인원수
 * @return {JSX.Element} 프로필 이미지 리스트 및 추가 인원 표시 UI
 */
function ProfileList({ recentMessages = [], authorCount }) {
  const restCount = authorCount > MAX_PROFILE_COUNT ? authorCount - MAX_PROFILE_COUNT : 0;

  return (
    <ul className={styles.profileList}>
      {recentMessages.length > 0 &&
        recentMessages.map((message) => (
          <li key={message.id}>
            <img src={message.profileImageURL} alt={message.sender} />
          </li>
        ))}
      {restCount > 0 && <li>+{restCount}</li>}
    </ul>
  );
}

export default ProfileList;
