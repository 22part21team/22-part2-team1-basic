/**
 * 게시글에 달린 반응 ( 이모지 ) 들을 관리하고 표시하는 컨테이너 컴포넌트
 *
 * 주요 기능 :
 * - 반응 수가 가장 많은 이모지 3개 표시
 * - arrowDown 버튼 클릭 시, 나머지 반응 이모지 리스트를 추가로 노출
 * - 추가 버튼 클릭 시, 새로운 이모지 추가
 *
 * @return 상위 이모지 리스트와 이모지 추가 버튼 UI
 */

import EmojiButton from '@/components/common/EmojiButton/EmojiButton';
import styles from './EmojiReactions.module.css';
import arrowDown from '@/assets/images/common/icon-arrow-down.svg';
import { useState } from 'react';

function EmojiReactions() {
  const [active, setActive] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  // active : true 드롭다운 메뉴 활성화 / false 드롭다운 메뉴 비활성화
  const emojiListClass = active
    ? `${styles.emojiDetailList} ${styles.active}`
    : `${styles.emojiDetailList}`;

  return (
    <div className={styles.emojiContainer}>
      <div className={styles.emojiButtonContainer}>
        <ul className={styles.emojiButtonList}>
          <li>
            <EmojiButton emoji="👍" count={24} />
          </li>
          <li>
            <EmojiButton emoji="😍" count={16} />
          </li>
          <li>
            <EmojiButton emoji="🎉" count={10} />
          </li>
        </ul>
        <div className={styles.emojiDetailContainer}>
          <button className={styles.emojiArrowDown} onClick={handleClick}>
            <img src={arrowDown} alt="" />
          </button>
          <ul className={emojiListClass}>
            <li>
              <EmojiButton emoji="👍" count={10} />
            </li>
            <li>
              <EmojiButton emoji="😍" count={8} />
            </li>
            <li>
              <EmojiButton emoji="🎉" count={24} />
            </li>
            <li>
              <EmojiButton emoji="😂" count={2} />
            </li>
            <li>
              <EmojiButton emoji="👍" count={10} />
            </li>
            <li>
              <EmojiButton emoji="😍" count={8} />
            </li>
            <li>
              <EmojiButton emoji="😍" count={24} />
            </li>
            <li>
              <EmojiButton emoji="😍" count={2} />
            </li>
          </ul>
        </div>
      </div>
      <button style={{ width: '36px', height: '32px', border: '1px solid gray' }}>추가</button>
    </div>
  );
}

export default EmojiReactions;
