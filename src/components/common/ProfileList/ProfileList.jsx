/**
 * 게시글에 참여한 사용자의 프로필 이미지를 요약해서 보여주는 컴포넌트
 *
 * 주요 기능 :
 * - 최대 3개의 프로필 이미지를 표시
 * - 초과 인원은 "+N" 형태의 배지로 노출
 *
 * @param {number} authorCount - 3명을 제외한 표시되지 않은 전체 참여 인원 수
 * @return 프로필 이미지 리스트 및 초과 인원 수 표시 UI
 */

import styles from './ProfileList.module.css';
import profile01 from '@/assets/images/common/profile-01.png';
import profile02 from '@/assets/images/common/profile-02.png';
import profile03 from '@/assets/images/common/profile-03.png';

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
