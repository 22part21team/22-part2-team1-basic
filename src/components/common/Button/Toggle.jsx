import { useState } from 'react';
import styles from './Toggle.module.css';

/**
 * Toggle 버튼 컴포넌트
 *
 * @param {string} leftOption - 왼쪽 옵션 텍스트
 * @param {string} rightOption - 오른쪽 옵션 텍스트
 * @param {string} selected - 선택된 옵션 ("left" | "right")
 * @param {function} onToggle - 토글 변경 핸들러
 * @param {string} className - 추가 클래스명
 * @return {JSX.Element} Toggle 컴포넌트
 */
const Toggle = ({ leftOption, rightOption, selected, onToggle, className = '' }) => {
  /**
   * 왼쪽 옵션 클릭 핸들러
   */
  const handleLeftClick = () => {
    onToggle('left');
  };

  /**
   * 오른쪽 옵션 클릭 핸들러
   */
  const handleRightClick = () => {
    onToggle('right');
  };

  return (
    <div className={`${styles.container} ${className}`.trim()}>
      <button
        type="button"
        className={`${styles.option} ${selected === 'left' ? styles.selected : ''}`}
        onClick={handleLeftClick}
      >
        {leftOption}
      </button>
      <button
        type="button"
        className={`${styles.option} ${selected === 'right' ? styles.selected : ''}`}
        onClick={handleRightClick}
      >
        {rightOption}
      </button>
    </div>
  );
};

export default Toggle;
