import SpinnerIcon from './SpinnerIcon';
import styles from './Loading.module.css';

/**
 * 데이터 로딩 중임을 시각적으로 나타내는 스피너 컴포넌트
 *
 * @param {number} size - 스피너의 가로 크기 (기본값 80)
 * @param {string} color - 스피너의 컬러 코드 (기본값 #a64eff)
 * @param {string} className - 추가 클래스 주고 싶을 때 사용
 * @returns {JSX.Element} 중앙 정렬된 스피너 아이콘 레이아웃
 */
function Loading({ size = 80, color = '#a64eff', className = '' }) {
  const containerClasses = `${styles.spinnerContainer} ${className}`.trim();

  return (
    <div className={containerClasses}>
      <SpinnerIcon size={size} color={color} />
    </div>
  );
}

export default Loading;
