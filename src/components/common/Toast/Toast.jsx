import { useState, useEffect, useRef } from 'react';
import checkIcon from '@/assets/images/common/icon-check.svg';
import closeIcon from '@/assets/images/common/icon-close.svg';
import styles from './Toast.module.css';

const AUTO_CLOSE_MS = 5000;
const FADE_DURATION_MS = 300;

/**
 * URL 공유 클릭에 대한 피드백을 표시하는 토스트 메시지 컴포넌트
 * 5초 후 자동으로 사라지며, 등장/퇴장 시 스무스한 페이드 애니메이션 적용
 *
 * @param {Object} props
 * @param {() => void} [props.onClose] - 닫기 버튼 클릭 시 호출되는 콜백
 * @return {JSX.Element} URL 복사 성공 메시지와 닫기 버튼을 포함한 토스트 UI
 */
function Toast({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const autoCloseTimerRef = useRef(null);
  const exitTimerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const showTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
    return () => cancelAnimationFrame(showTimer);
  }, []);

  const handleClose = () => {
    if (isExiting) return;
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    setIsExiting(true);
    exitTimerRef.current = setTimeout(() => {
      onCloseRef.current?.();
    }, FADE_DURATION_MS);
  };

  useEffect(() => {
    if (!isVisible) return;
    autoCloseTimerRef.current = setTimeout(handleClose, AUTO_CLOSE_MS);
    return () => {
      if (autoCloseTimerRef.current) clearTimeout(autoCloseTimerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- handleClose 의존 시 5초 타이머가 매 렌더마다 리셋됨
  }, [isVisible]);

  const containerClass = [
    styles.toastContainer,
    isVisible && !isExiting && styles.visible,
    isExiting && styles.exiting,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClass}>
      <div className={styles.toast}>
        <div className={styles.toastText}>
          <img src={checkIcon} alt="" />
          <p>URL이 복사 되었습니다.</p>
        </div>
        <button type="button" className={styles.toastCloseButton} onClick={handleClose} aria-label="닫기">
          <img src={closeIcon} alt="" />
        </button>
      </div>
    </div>
  );
}

export default Toast;
