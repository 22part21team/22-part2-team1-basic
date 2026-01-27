import styles from './EmojiButton.module.css';

/**
 * 이모지와 반응 수를 표시하는 버튼 컴포넌트
 *
 * @param {string} emoji - 표시할 이모지 문자
 * @param {number} count - 해당 이모지에 누적된 반응 수
 * @return {JSX.Element} 이모지와 숫자가 조합된 버튼 UI
 */
function EmojiButton({ emoji, count }) {
  return (
    <button className={styles.emoji}>
      <span>{emoji}</span>
      <span>{count}</span>
    </button>
  );
}

export default EmojiButton;
