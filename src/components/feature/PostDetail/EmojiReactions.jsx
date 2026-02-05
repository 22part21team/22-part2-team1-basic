import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { get, post } from '@/utils/apiClient';
import { Outlined } from '@/components/common/Button';
import EmojiPicker from 'emoji-picker-react';
import EmojiButton from '@/components/common/EmojiButton/EmojiButton';
import Toast from '@/components/common/Toast/Toast';
import emojiIcon from '@/assets/images/common/icon-smileplus.svg';
import arrowDown from '@/assets/images/common/icon-arrow-down.svg';
import styles from './EmojiReactions.module.css';

// ===== 불러올 이모지 리액션 개수 =====
const TOP_EMOJI_COUNT = 3;
const DROPDOWN_EMOJI_COUNT = 8;
const TOTAL_LIMIT = TOP_EMOJI_COUNT + DROPDOWN_EMOJI_COUNT;

/**
 * 게시글 이모지 리액션 관리 및 표시 컨테이너 컴포넌트
 * 주요 기능 :
 * - 수신자 ID 기반 서버의 이모지 데이터 실시간 동기화
 * - 가장 많이 받은 이모지 리액션 표시 및 나머지 리액션 목록 드롭다운으로 표시 ( 최대 표시 개수 : DROPDOWN_EMOJI_COUNT )
 * - 이모지 피커 및 기존 이모지 버튼 클릭 시 이모지 반응 추가
 *
 * @param {number} id - 롤링페이퍼 수신자의 고유 식별 ID
 * @return {JSX.Element} 상위 이모지 목록, 리스트 드롭다운, 이모지 추가 버튼 및 피커 UI
 */
function EmojiReactions({ id }) {
  // ===== 커스텀 훅 =====
  const { toast, showToast } = useToast();
  // ===== Reaction 조회 State =====
  const [reactionData, setReactionData] = useState([]);
  // ===== UI 상태 제어 (드롭다운, 피커) State =====
  const [listActive, setListActive] = useState(false);
  const [emojiActive, setEmojiActive] = useState(false);
  const [emojiPickerActive, setEmojiPickerActive] = useState(false);
  // ===== DOM 참조 (외부 클릭 감지용) =====
  const listRef = useRef(null);
  const emojiRef = useRef(null);

  /**
   * Reaction 조회 이벤트
   * * 상위 이모지와 더보기용 이모지를 로드하여 상태에 저장
   * * 상위 이모지 최대 개수 : TOP_EMOJI_COUNT
   * * 더보기용 이모지 최대 개수 : DROPDOWN_EMOJI_COUNT
   * @throws {Other} 토스트 알림
   */
  const handleReactionReload = useCallback(async () => {
    try {
      const data = await get(`/recipients/${id}/reactions/?limit=${TOTAL_LIMIT}`);
      setReactionData(data.results);
    } catch (error) {
      console.error('리액션 정보 조회 오류:', error);
      showToast('받은 리액션을 불러오지 못했습니다. 다시 시도해주세요.');
    }
  }, [id, showToast]);

  /**
   * 이모지 리액션 데이터 초기 로드
   */
  useEffect(() => {
    // eslint-disable-next-line
    handleReactionReload();
  }, [handleReactionReload]);

  /**
   * 이모지 리액션 추가 이벤트
   * * 클릭 시 서버 API로 이모지 리액션을 전송
   * @param {string} emoji - 전송할 이모지 문자열
   * @throws {Other} 토스트 알림
   */
  const handleEmojiAdd = async (emoji) => {
    try {
      const emojiData = {
        emoji,
        type: 'increase',
      };
      await post(`/recipients/${id}/reactions/`, emojiData, '이모지 전송');
      await handleReactionReload();
    } catch (error) {
      console.error('리액션 전송 오류:', error);
      showToast('리액션 전송에 실패했습니다.');
    }
  };

  /**
   * 이모지 리액션 추가 이벤트 ( 이모지 피커 )
   * * 클릭 시 이모지 전송 함수 handleEmojiAdd 실행
   * * 성공 시 피커 드롭다운 닫음
   * @param {Object} emojiObject - 전송할 이모지 정보 객체
   */
  const handleEmojiAddPicker = (emojiObject) => {
    const emoji = emojiObject.emoji;
    handleEmojiAdd(emoji);
    setEmojiActive(false);
  };

  /**
   * 드롭다운 메뉴 오픈 ( 리액션 리스트 )
   */
  const handleListClick = () => {
    setListActive(!listActive);
  };

  /**
   * 드롭다운 메뉴 오픈 ( 이모지 피커 )
   */
  const handleEmojiClick = () => {
    if (!emojiActive) {
      setEmojiPickerActive(true);
      setTimeout(() => setEmojiActive(true), 200);
    } else {
      setEmojiActive(false);
      setTimeout(() => setEmojiPickerActive(false), 200);
    }
  };

  /**
   * 드롭다운 및 피커 외부 클릭 시 닫힘 처리
   */
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

  return (
    <>
      {/* 토스트 */}
      {toast.show && <Toast message={toast.message} />}
      <div className={styles.emojiContainer}>
        <div className={styles.emojiButtonContainer}>
          <ul className={styles.emojiButtonList}>
            {/* reaction 개수가 0개 이상일 경우, 가장 반응 많은 이모지를 최대 3개 출력 */}
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
          {/* reaction 개수가 3개 이상일 경우, 가장 반응 많은 이모지 중 최상위 3개를 제외한 나머지 8개를 인기순으로 보여주는 리스트 생성 */}
          {reactionData.length > 3 && (
            <div className={styles.emojiDetailContainer} ref={listRef}>
              <button className={styles.emojiArrowDown} onClick={handleListClick}>
                <img src={arrowDown} alt="" />
              </button>
              {/* arrowDown 버튼 클릭하면 드롭다운 메뉴 보여주기 */}
              <ul
                className={
                  listActive ? `${styles.emojiDetailList} ${styles.active}` : styles.emojiDetailList
                }
              >
                {reactionData.slice(3).map((reaction) => {
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
            </div>
          )}
        </div>
        <div className={styles.addButtonContainer} ref={emojiRef}>
          <Outlined size="36" className={styles.addButton} onClick={handleEmojiClick}>
            <img src={emojiIcon} alt="" />
            <span className={styles.addButtonText}> 추가</span>
          </Outlined>
          {/* 추가 버튼 클릭하면 드롭다운 메뉴 보여주기 */}
          <div
            className={
              emojiActive
                ? `${styles.emojiPickerContainer} ${styles.active}`
                : styles.emojiPickerContainer
            }
          >
            {emojiPickerActive && (
              <EmojiPicker
                className={styles.emojiPicker}
                onEmojiClick={(emojiObject) => handleEmojiAddPicker(emojiObject)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EmojiReactions;
