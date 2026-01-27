import { useState } from 'react';
import styles from './LinkShare.module.css';

/**
 * 카카오톡 / URL 공유 드롭다운 컴포넌트
 * - 상태 ( active ) 에 따라 메뉴 노출 및 클래스 토글
 *
 * @return {JSX.Element} 공유 버튼과 드롭다운 메뉴 ( 카카오톡, URL ) 리스트
 */
function LinkShare() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  // active : true 드롭다운 메뉴 활성화 / false 드롭다운 메뉴 비활성화
  const linkMenuClass = active ? `${styles.linkMenu} ${styles.active}` : `${styles.linkMenu}`;

  return (
    <div className={styles.linkShareContainer}>
      <button
        style={{ width: '36px', height: '32px', border: '1px solid gray' }}
        onClick={handleClick}
      >
        공유
      </button>
      <ul className={linkMenuClass}>
        <li>
          <button className={styles.linkMenuButton}>카카오톡 공유</button>
        </li>
        <li>
          <button className={styles.linkMenuButton}>URL 공유</button>
        </li>
      </ul>
    </div>
  );
}

export default LinkShare;
