import { useState } from 'react';
import styles from './LinkShare.module.css';
import Toast from '@/components/common/Toast/Toast';

/**
 * 카카오톡 / URL 공유 드롭다운 컴포넌트
 * - 상태 ( active ) 에 따라 메뉴 노출 및 클래스 토글
 * - URL 공유 클릭 시 클립보드에 URL 복사 후 토스트 표시
 *
 * @return {JSX.Element} 공유 버튼과 드롭다운 메뉴 ( 카카오톡, URL ) 리스트
 */
function LinkShare() {
  const [active, setActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  const handleUrlShareClick = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setActive(false);
      setShowToast(true);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
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
          <button type="button" className={styles.linkMenuButton} onClick={handleUrlShareClick}>
            URL 공유
          </button>
        </li>
      </ul>
      {showToast && <Toast onClose={handleCloseToast} />}
    </div>
  );
}

export default LinkShare;
