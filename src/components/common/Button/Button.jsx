import styles from './Button.module.css';

/**
 * 공용 버튼 컴포넌트
 *
 * @param {string} size - 버튼 크기 ("large" | "medium" | "small")
 * @param {boolean} disabled - 비활성화 여부
 * @param {function} onClick - 클릭 핸들러
 * @param {ReactNode} children - 버튼 내용
 * @param {string} type - 버튼 타입
 * @return {JSX.Element} Button 컴포넌트
 */
const Button = ({ size = 'medium', disabled = false, onClick, children, type = 'button' }) => {
  const buttonClass = `${styles.button} ${styles[size] || ''}`;

  return (
    <button type={type} className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;