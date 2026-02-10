import styles from './Button.module.css';

/**
 * Primary 버튼 컴포넌트
 *
 * @param {string} size - 버튼 크기 ("56" | "40" | "round")
 * @param {boolean} disabled - 비활성화 여부
 * @param {function} onClick - 클릭 핸들러
 * @param {ReactNode} children - 버튼 내용
 * @param {string} type - 버튼 타입
 * @param {string} className - 추가 클래스명
 * @return {JSX.Element} Primary Button 컴포넌트
 */
const Button = ({
  size = '40',
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}) => {
  const buttonClass = `${styles.button} ${styles.primary} ${styles[`size${size}`] || ''} ${className}`.trim();

  return (
    <button type={type} className={buttonClass} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
