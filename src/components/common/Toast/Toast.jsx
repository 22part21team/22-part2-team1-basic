import checkIcon from '@/assets/images/common/icon-check.svg';
import closeIcon from '@/assets/images/common/icon-close.svg';
import styles from './Toast.module.css';

/**
 * URL 공유 클릭에 대한 피드백을 표시하는 토스트 메시지 컴포넌트
 *
 * @return {JSX.Element} URL 복사 성공 메시지와 닫기 버튼을 포함한 토스트 UI
 */
function Toast() {
  return (
    <div className={styles.toastContainer}>
      <div className={styles.toast}>
        <div className={styles.toastText}>
          <img src={checkIcon} alt="" />
          <p>URL이 복사 되었습니다.</p>
        </div>
        <button className={styles.toastCloseButton}>
          <img src={closeIcon} alt="" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
