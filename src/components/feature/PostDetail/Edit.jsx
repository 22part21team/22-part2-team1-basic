import Button from '@/components/common/Button';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import styles from './Edit.module.css';

/**
 * 롤링페이퍼 상세 페이지의 편집 모드 전용 컨트롤러 컴포넌트
 * - 편집 모드(isEditMode) 활성화 시 화면에 노출
 *
 * @param {boolean} isDelete - 삭제 확인 모달 표시 여부
 * @param {Function} onDeleteModal - 삭제 확인 모달 토글 핸들러 함수
 * @param {Function} onDeleteEvent - 롤링페이퍼 삭제 API 요청 이벤트
 * @returns {JSX.Element} 삭제 버튼 및 확인 모달을 포함한 UI
 */
function Edit({ isDelete, onDeleteModal, onDeleteEvent }) {
  return (
    <>
      <div className={styles.editContainer}>
        <Button size="40" className={styles.editButton} onClick={onDeleteModal}>
          삭제하기
        </Button>
      </div>
      <ConfirmModal
        isDelete={isDelete}
        onDeleteModal={onDeleteModal}
        onDeleteEvent={onDeleteEvent}
      ></ConfirmModal>
    </>
  );
}

export default Edit;
