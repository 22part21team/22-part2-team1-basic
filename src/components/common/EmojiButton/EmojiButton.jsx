import { formatCount } from '@/utils/formatCount';
import styles from './EmojiButton.module.css';

/**
 * 이모지와 반응 수를 표시하는 버튼 컴포넌트
 *
 * @param {string} emoji - 표시할 이모지 문자
 * @param {number} count - 해당 이모지에 누적된 반응 수
 * @param {function} onClick - 버튼 클릭 시 실행될 핸들러 함수
 * @return {JSX.Element} 이모지와 숫자가 조합된 버튼 UI
 */
function EmojiButton({ emoji, count, onClick }) {
  return (
    <button className={styles.emoji} onClick={onClick}>
      <span>{emoji}</span>
      <span>{formatCount(count)}</span>
    </button>
  );
}

export default EmojiButton;
