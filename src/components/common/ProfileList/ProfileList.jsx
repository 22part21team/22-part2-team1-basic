import styles from './ProfileList.module.css';
import profile01 from '@/assets/images/common/profile-01.png';
import profile02 from '@/assets/images/common/profile-02.png';
import profile03 from '@/assets/images/common/profile-03.png';

/**
 * 참여자 프로필 이미지 요약 리스트 컴포넌트
 * - 최대 3개의 이미지를 중첩 표시하며, 초과분은 +N 형태로 노출
 *
 * @param {number} authorCount - 표시된 3명 외의 추가 참여자 수
 * @return {JSX.Element} 프로필 이미지 리스트 및 추가 인원 표시 UI
 */
function ProfileList({ authorCount }) {
  return (
    <ul className={styles.profileList}>
      <li>
        <img src={profile01} alt="" />
      </li>
      <li>
        <img src={profile02} alt="" />
      </li>
      <li>
        <img src={profile03} alt="" />
      </li>
      <li>+{authorCount}</li>
    </ul>
  );
}

export default ProfileList;
