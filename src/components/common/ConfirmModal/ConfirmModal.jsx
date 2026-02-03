import { createPortal } from 'react-dom';
import Button, { Outlined } from '../Button';
import styles from './ConfirmModal.module.css';

/**
 * 삭제 동작 전 사용자의 최종 의사를 확인하는 모달 컴포넌트
 * - '취소' 클릭 : 모달을 닫고 삭제하지 않음
 * - '확인' 클릭 : 실제 삭제 API 요청(onDeleteEvent)을 실행
 *
 * @param {boolean} isDelete - 모달의 표시 여부를 결정하는 상태 값
 * @param {Function} onDeleteModal - 모달을 닫거나 상태를 토글하는 핸들러 함수 (취소 시 사용)
 * @param {Function} onDeleteEvent - 삭제를 확정하고 실제 API 호출을 수행하는 핸들러 함수
 * @returns {JSX.Element} 삭제 확인창 및 배경 오버레이 UI
 */
function ConfirmModal({ isDelete, onDeleteModal, onDeleteEvent }) {
  if (!isDelete) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const overlayStyle = isDelete ? `${styles.overlay} ${styles.visible}` : styles.overlay;
  const confirmStyle = isDelete
    ? `${styles.confirmContainer} ${styles.visible}`
    : styles.confirmContainer;

  return createPortal(
    <>
      <div className={confirmStyle} onClick={(e) => e.stopPropagation()}>
        <p>롤링페이퍼를 삭제하시겠습니까?</p>
        <div className={styles.buttonContainer}>
          <Outlined size="40" className={styles.confirmButton} onClick={onDeleteModal}>
            취소
          </Outlined>
          <Button size="40" className={styles.confirmButton} onClick={onDeleteEvent}>
            확인
          </Button>
        </div>
      </div>
      <div className={overlayStyle} onClick={onDeleteModal}></div>
    </>,
    modalRoot
  );
}

export default ConfirmModal;
