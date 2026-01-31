import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import styles from './LoadingModal.module.css';
import Loading from '../Loading/Loading';

/**
 * 앱 전체를 덮어 사용자 상호작용을 차단하는 풀스크린 로딩 모달
 *
 * @returns {React.ReactPortal | null} 포털을 통해 최상위 레이어에 렌더링되는 모달 UI ( 컨테이너 부재 시 null을 반환 )
 */
function LoadingModal() {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const node = document.getElementById('modal-root');
    if (node) {
      // eslint-disable-next-line
      setContainer(node);
    }
  }, []);

  if (!container) return null;

  return createPortal(
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <Loading />
        <p>LOADING</p>
      </div>
    </div>,
    container
  );
}

export default LoadingModal;
