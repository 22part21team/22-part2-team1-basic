import { createPortal } from 'react-dom';
import Button, { Outlined } from '../Button';
import { MountAnimation } from '../MountAnimation/MountAnimation';
import styles from './ConfirmModal.module.css';

/**
 * 삭제 동작 전 사용자의 최종 의사를 확인하는 모달 컴포넌트
 * - '취소' 클릭 : 모달을 닫고 삭제하지 않음
 * - '확인' 클릭 : 삭제 API 요청을 실행
 *
 * @param {boolean} isOpen - 모달의 표시 여부를 결정하는 상태 값
 * @param {Function} onClose - 모달을 닫는 핸들러 함수 (취소)
 * @param {Function} onConfirm - 실제 삭제 동작을 수행하는 핸들러 함수 (확인)
 * @param {React.ReactNode} children - 모달 내부에 표시될 메시지 텍스트
 * @returns {JSX.Element|null} 삭제 확인창 및 배경 오버레이 UI
 */
function ConfirmModal({ isOpen, onClose, onConfirm, children }) {
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <MountAnimation visible={isOpen}>
      <div className={styles.confirmContainer} onClick={(e) => e.stopPropagation()}>
        {children}
        <div className={styles.buttonContainer}>
          <Outlined size="40" className={styles.confirmButton} onClick={onClose}>
            취소
          </Outlined>
          <Button size="40" className={styles.confirmButton} onClick={onConfirm}>
            확인
          </Button>
        </div>
      </div>
      <div className={styles.overlay} onClick={onClose}></div>
    </MountAnimation>,
    modalRoot
  );
}

export default ConfirmModal;
