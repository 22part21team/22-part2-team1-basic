import plusIcon from '@/assets/images/common/icon-plus.svg';
import styles from './AddButton.module.css';

/**
 * 추가 ( + ) 버튼 컴포넌트
 *
 * @param {boolean} disabled - 비활성화 여부
 * @param {function} onClick - 클릭 핸들러
 * @param {string} type - 버튼 타입
 * @return {JSX.Element} + 아이콘이 있는 Button 컴포넌트
 */
const AddButton = ({ disabled = false, onClick, type = 'button' }) => {
  return (
    <button type={type} className={styles.button} disabled={disabled} onClick={onClick}>
      <img src={plusIcon} alt="" />
    </button>
  );
};

export default AddButton;
