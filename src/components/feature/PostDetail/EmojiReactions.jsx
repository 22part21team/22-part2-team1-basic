import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchApi } from '@/api/api';
import { Outlined } from '@/components/common/Button';
import EmojiPicker from 'emoji-picker-react';
import EmojiButton from '@/components/common/EmojiButton/EmojiButton';
import emojiIcon from '@/assets/images/common/icon-smileplus.svg';
import arrowDown from '@/assets/images/common/icon-arrow-down.svg';
import styles from './EmojiReactions.module.css';

/**
 * 게시글 반응(이모지) 관리 및 표시 컨테이너 컴포넌트
 * 주요 기능 :
 * - 수신자 ID 기반 서버의 이모지 데이터 실시간 동기화
 * - 상위 3개 주요 반응 표시 및 상위 8개 반응 드롭다운 노출
 * - 이모지 피커 및 기존 이모지 버튼 클릭 시 이모지 반응 추가
 *
 * @param {number} id - 롤링페이퍼 수신자의 고유 식별 ID
 * @return {JSX.Element} 상위 이모지 목록, 리스트 드롭다운, 이모지 추가 버튼 및 피커 UI
 */
function EmojiReactions({ id }) {
  const [listActive, setListActive] = useState(false);
  const [emojiActive, setEmojiActive] = useState(false);
  const [reactionData, setReactionData] = useState([]);
  const listRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    const fetchReaction = async () => {
      try {
        const data = await fetchApi(`recipients/${id}/reactions`);
        setReactionData(data.results);
      } catch (error) {
        console.error('롤링페이퍼 정보 조회 오류:', error);
      }
    };

    fetchReaction();
  }, [id]);

  // 모달 밖 클릭 이벤트
  useEffect(() => {
    const outSideClick = (e) => {
      if (listActive && listRef.current && !listRef.current.contains(e.target)) {
        setListActive(false);
      }
      if (emojiActive && emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiActive(false);
      }
    };
    document.addEventListener('mousedown', outSideClick);
    return () => {
      document.removeEventListener('mousedown', outSideClick);
    };
  }, [listActive, emojiActive]);

  // reaction 정보 다시 불러오는 이벤트
  const handleLoad = useCallback(async () => {
    try {
      const data = await fetchApi(`recipients/${id}/reactions`);
      setReactionData(data.results);
    } catch (error) {
      console.error('롤링페이퍼 정보 조회 오류:', error);
    }
  }, [id]);

  // 이모지 추가 이벤트 ver 이모지 버튼
  const handleEmojiAdd = async (emoji) => {
    await fetchApi(`recipients/${id}/reactions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        emoji,
        type: 'increase',
      }),
    });
    handleLoad();
  };

  // 이모지 추가 이벤트 ver 이모지 피커
  const handleNewEmojiAdd = (emojiObject) => {
    const newEmoji = emojiObject.emoji;
    handleEmojiAdd(newEmoji);
    setEmojiActive(false);
  };

  // 드롭다운 메뉴 오픈 ver 이모지 리스트
  const handleListClick = () => {
    setEmojiActive(false);
    setListActive(!listActive);
  };

  // 드롭다운 메뉴 오픈 ver 이모지 피커
  const handleEmojiClick = () => {
    setListActive(false);
    setEmojiActive(!emojiActive);
  };

  return (
    <div className={styles.emojiContainer}>
      <div className={styles.emojiButtonContainer}>
        <ul className={styles.emojiButtonList}>
          {/* reaction 개수가 0개 이상일 경우 최대 3개 출력 */}
          {reactionData.length > 0 &&
            reactionData.slice(0, 3).map((reaction) => {
              return (
                <li key={reaction.id}>
                  <EmojiButton
                    emoji={reaction.emoji}
                    count={reaction.count}
                    onClick={() => handleEmojiAdd(reaction.emoji)}
                  />
                </li>
              );
            })}
        </ul>
        {/* reaction 개수가 3개 이상일 경우 최대 8개 보여주는 리스트 생성 */}
        {reactionData.length > 3 && (
          <div className={styles.emojiDetailContainer}>
            <button className={styles.emojiArrowDown} onClick={handleListClick}>
              <img src={arrowDown} alt="" />
            </button>
            {/* arrowDown 버튼 클릭하면 드롭다운 메뉴 보여주기 */}
            {listActive && (
              <ul className={styles.emojiDetailList} ref={listRef}>
                {reactionData.map((reaction) => {
                  return (
                    <li key={reaction.id}>
                      <EmojiButton
                        emoji={reaction.emoji}
                        count={reaction.count}
                        onClick={() => handleEmojiAdd(reaction.emoji)}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className={styles.addButtonContainer} ref={emojiRef}>
        <Outlined size="36" className={styles.addButton} onClick={handleEmojiClick}>
          <img src={emojiIcon} alt="" /> 추가
        </Outlined>
        {/* 추가 버튼 클릭하면 드롭다운 메뉴 보여주기 */}
        {emojiActive && (
          <div className={styles.addEmojiContainer}>
            <EmojiPicker
              className={styles.addEmoji}
              onEmojiClick={(emojiObject) => handleNewEmojiAdd(emojiObject)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default EmojiReactions;
