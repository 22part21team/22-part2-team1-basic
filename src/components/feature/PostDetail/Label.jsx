import styles from './Label.module.css';

// ===== 스타일 매핑 설정 =====
const LABEL_STYLES = {
  지인: styles.beige,
  동료: styles.purple,
  가족: styles.green,
  친구: styles.blue,
};

/**
 * 작성자와 수신자의 관계를 표시하는 라벨 컴포넌트
 * - 관계에 따라 각기 다른 배경색 스타일 적용
 *
 * @param {string} relationship - 수신자와의 관계 ( 지인, 동료, 가족, 친구 )
 * @return {JSX.Element} 관계 명칭이 포함된 컬러 라벨 UI
 */
function Label({ relationship }) {
  // ===== 스타일 설정 =====
  const labelStyle = `${styles.label} ${LABEL_STYLES[relationship] || ''}`;

  return <span className={labelStyle}>{relationship}</span>;
}

export default Label;
