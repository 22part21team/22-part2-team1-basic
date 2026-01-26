import styles from './Toggle.module.css';

/**
 * 토글 버튼 컴포넌트
 * 두 가지 옵션 중 하나를 선택할 수 있는 토글 스위치
 *
 * @param {string} leftOption - 왼쪽 옵션 텍스트
 * @param {string} rightOption - 오른쪽 옵션 텍스트
 * @param {string} selected - 현재 선택된 옵션 ("left" | "right")
 * @param {function} onToggle - 토글 클릭 시 호출되는 핸들러 함수
 * @return {JSX.Element} Toggle 컴포넌트
 */
const Toggle = ({ leftOption, rightOption, selected, onToggle }) => {
  /**
   * 왼쪽 옵션 클릭 핸들러
   */
  const handleLeftClick = () => {
    if (selected !== 'left') {
      onToggle('left');
    }
  };

  /**
   * 오른쪽 옵션 클릭 핸들러
   */
  const handleRightClick = () => {
    if (selected !== 'right') {
      onToggle('right');
    }
  };

  return (
    <div className={styles.toggleContainer}>
      <button
        type="button"
        onClick={handleLeftClick}
        className={`${styles.toggleButton} ${selected === 'left' ? styles.active : ''}`}
      >
        {leftOption}
      </button>
      <button
        type="button"
        onClick={handleRightClick}
        className={`${styles.toggleButton} ${selected === 'right' ? styles.active : ''}`}
      >
        {rightOption}
      </button>
    </div>
  );
};

export default Toggle;