/*
 * 특정 이모지에 대한 반응 수를 표시하는 버튼 컴포넌트
 * 이모지 아이콘과 해당 이모지의 반응 수를 함께 노출
 *
 * @param emoji - 표시할 이모지 문자
 * @param count - 해당 이모지에 누적된 반응 수
 * @return 이모지와 반응 수가 조합된 버튼 UI
 */

import styles from './EmojiButton.module.css';

function EmojiButton({ emoji, count }) {
  return (
    <button className={styles.emoji}>
      <span>{emoji}</span>
      <span>{count}</span>
    </button>
  );
}

export default EmojiButton;
