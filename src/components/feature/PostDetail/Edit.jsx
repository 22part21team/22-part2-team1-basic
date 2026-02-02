import Button from '@/components/common/Button';
import styles from './Edit.module.css';

/**
 * 롤링페이퍼 상세 페이지의 편집 모드 전용 컨트롤러 컴포넌트
 * - 편집 모드(isEditMode) 활성화 시 화면에 노출
 *
 * * @returns {JSX.Element} 편집 기능 버튼을 포함한 레이아웃 컨테이너
 */
function Edit({ onDelete }) {
  return (
    <div className={styles.editContainer}>
      <Button size="40" className={styles.editButton} onClick={onDelete}>
        삭제하기
      </Button>
    </div>
  );
}

export default Edit;
