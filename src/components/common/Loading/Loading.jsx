import spinner from '@/assets/images/common/icon-spinner.svg';
import styles from './Loading.module.css';

/**
 * 데이터 로딩 중임을 시각적으로 나타내는 스피너 컴포넌트
 *
 * @returns {JSX.Element} 중앙 정렬된 스피너 아이콘 레이아웃
 */
function Loading() {
  return (
    <div className={styles.spinnerContainer}>
      <img src={spinner} alt="" />
    </div>
  );
}

export default Loading;
