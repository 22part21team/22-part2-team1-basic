import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import styles from './Edit.module.css';

/**
 * 롤링페이퍼 상세 페이지의 편집 모드 전용 컨트롤러 컴포넌트
 * - 편집 모드(isEditMode) 활성화 시 화면에 노출
 *
 * @param {boolean} isOpen - 삭제 확인 모달 표시 여부
 * @param {Function} onRecipientDeleteModal - 삭제 확인 모달 토글 핸들러 함수
 * @param {Function} onRecipientDelete - 롤링페이퍼 삭제 API 요청 함수
 * @returns {JSX.Element} 삭제 버튼 및 확인 모달을 포함한 UI
 */
function Edit({ isOpen, onRecipientDeleteModal, onRecipientDelete }) {
  return (
    <>
      <div className={styles.editContainer}>
        <Button size="40" className={styles.editButton} onClick={onRecipientDeleteModal}>
          삭제하기
        </Button>
      </div>
      <ConfirmModal isOpen={isOpen} onClose={onRecipientDeleteModal} onConfirm={onRecipientDelete}>
        <p>
          롤링페이퍼를 <span className={styles.deleteMessage}>삭제</span>하시겠습니까?
        </p>
      </ConfirmModal>
    </>
  );
}

export default Edit;
