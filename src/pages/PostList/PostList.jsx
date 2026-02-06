import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { get } from '@/utils/apiClient';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast/Toast';
import LoadingModal from '@/components/common/LoadingModal/LoadingModal';
import styles from './PostList.module.css';

import ProfileList from '@/components/common/ProfileList/ProfileList';
import EmojiButton from '@/components/common/EmojiButton/EmojiButton';

import listArrowLeft from '@/assets/images/list/list-arrow-left.svg';
import listArrowRight from '@/assets/images/list/list-arrow-right.svg';

const BACKGROUND_COLORS = {
  beige: 'var(--color-beige-200)',
  purple: 'var(--color-purple-200)',
  blue: 'var(--color-blue-200)',
  green: 'var(--color-green-200)',
};

/**
 * 롤링 페이퍼 리스트 페이지 컴포넌트
 *
 * 인기 롤링 페이퍼와 최근에 생성된 롤링 페이퍼를
 * 가로 슬라이드 형태의 카드 리스트로 보여주며,
 * 좌우 화살표 버튼을 통해 페이지 단위로 이동할 수 있습니다.
 *
 *
 * @param {string} patternClass - 카드 배경에 적용될 패턴 클래스명
 * @param {string} title - 카드 상단에 표시될 제목 텍스트
 * @param {Function} onClick - 카드 클릭 시 실행되는 이벤트 핸들러
 * @returns {JSX.Element} - 롤링 페이퍼 리스트 페이지 JSX 요소
 */

/**
 * 슬라이드 관련 상수 정의
 * 카드당 표시할 개수, 카드 너비, 카드 간격, 슬라이드 오프셋 계산
 */
const CARDS_PER_PAGE = 4;
const CARD_WIDTH = 275;
const GAP = 20;
const SLIDE_OFFSET_PER_PAGE = (CARD_WIDTH + GAP) * CARDS_PER_PAGE; // 1180px

async function getRecipients({ sort, limit = 8, offset = 0 }) {
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  if (sort) params.append('sort', sort);

  return get(`/recipients/?${params.toString()}`, '롤링페이퍼 리스트 조회');
}

function SlidePaperCard({ recipient, onClick }) {
  const {
    id,
    name,
    messageCount = 0,
    recentMessages = [],
    topReactions = [],
    backgroundColor,
    backgroundImageURL,
  } = recipient;

  const backgroundStyle = backgroundImageURL
    ? {
        backgroundImage: `url(${backgroundImageURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { backgroundColor: BACKGROUND_COLORS[backgroundColor] ?? BACKGROUND_COLORS.beige };

  return (
    // 카드 배경이 이미지일 경우 hasimageBg 클래스 추가
    <div
      className={`${styles.slidePaperItem} ${backgroundImageURL ? styles.hasImageBg : ''}`}
      style={backgroundStyle}
      role="button"
      tabIndex={0}
      onClick={() => onClick(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      <p className={styles.slidePaperItemTitle}>To. {name}</p>

      <div className={styles.slidePaperItemPhotoCount}>
        <ProfileList recentMessages={recentMessages} authorCount={messageCount} />
      </div>

      <p className={styles.slidePaperItemTotal}>
        <span>{messageCount}</span>명이 작성했어요!
      </p>

      <div className={styles.slidePaperItemBadge}>
        {topReactions.slice(0, 3).map((r) => (
          <EmojiButton key={r.id} emoji={r.emoji} count={r.count} />
        ))}
      </div>
    </div>
  );
}

function PostList() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const [bestPaperItems, setBestPaperItems] = useState([]);
  const [recentPaperItems, setRecentPaperItems] = useState([]);

  const [bestSlideIndex, setBestSlideIndex] = useState(0);
  const [recentSlideIndex, setRecentSlideIndex] = useState(0);

  const [status, setStatus] = useState('loading'); // loading | ok | error
  const location = useLocation();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setStatus('loading');

        const [bestRes, recentRes] = await Promise.all([
          // sort=like 지원 안 하면 여기서 error 날 수 있음 → 그때는 catch로 recent를 재사용
          getRecipients({ sort: 'like', limit: 8, offset: 0 }).catch(() =>
            getRecipients({ limit: 8, offset: 0 })
          ),
          getRecipients({ limit: 8, offset: 0 }),
        ]);

        setBestPaperItems(bestRes?.results ?? []);
        setRecentPaperItems(recentRes?.results ?? []);
        setBestSlideIndex(0);
        setRecentSlideIndex(0);

        setStatus('ok');
      } catch (error) {
        console.error('롤링 페이퍼 리스트 조회 에러: ', error);

        // 네트워크 에러: 에러 페이지 이동
        if (error?.isNetworkError) {
          navigate('/error', {
            state: {
              type: 'network',
              message: error.message,
            },
          });
          return;
        }

        // 500번대 서버 에러: 에러 페이지 이동
        if (error?.status >= 500) {
          navigate('/error', {
            state: {
              type: 'server',
              message: '서버에 일시적인 문제가 발생했습니다.',
            },
          });
          return;
        }

        // 400번대, 기타 에러: 에러 페이지 이동
        showToast(error?.message || '목록을 불러오는 중 문제가 발생했습니다.');

        setStatus('ok'); // 빈 화면 처리 위해 ok로 변경
      }
    };

    fetchAll();
  }, [navigate, showToast]);

  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location, showToast]);

  const handleCardClick = (id) => navigate(`/post/${id}`); // 요구사항 4

  // ===== PC 슬라이드 계산 (Best)
  const bestTotalCards = bestPaperItems.length;
  const bestTotalPages = Math.ceil(bestTotalCards / CARDS_PER_PAGE);
  const bestShowArrows = bestTotalCards > CARDS_PER_PAGE; // 요구사항 8
  const bestShowLeftButton = bestShowArrows && bestSlideIndex > 0; // 요구사항 7
  const bestShowRightButton = bestShowArrows && bestSlideIndex < bestTotalPages - 1; // 요구사항 7
  const bestSlideOffsetPx = -bestSlideIndex * SLIDE_OFFSET_PER_PAGE; // 요구사항 6

  // ===== PC 슬라이드 계산 (Recent)
  const recentTotalCards = recentPaperItems.length;
  const recentTotalPages = Math.ceil(recentTotalCards / CARDS_PER_PAGE);
  const recentShowArrows = recentTotalCards > CARDS_PER_PAGE; // 요구사항 8
  const recentShowLeftButton = recentShowArrows && recentSlideIndex > 0; // 요구사항 7
  const recentShowRightButton = recentShowArrows && recentSlideIndex < recentTotalPages - 1; // 요구사항 7
  const recentSlideOffsetPx = -recentSlideIndex * SLIDE_OFFSET_PER_PAGE; // 요구사항 6

  const handlePrevBest = () => setBestSlideIndex((i) => Math.max(0, i - 1));
  const handleNextBest = () => setBestSlideIndex((i) => Math.min(bestTotalPages - 1, i + 1));
  const handlePrevRecent = () => setRecentSlideIndex((i) => Math.max(0, i - 1));
  const handleNextRecent = () => setRecentSlideIndex((i) => Math.min(recentTotalPages - 1, i + 1));

  if (status === 'loading') return <LoadingModal />;

  return (
    <>
      {toast.show && <Toast message={toast.message} />}

      <div className={styles.contents}>
        <div className={`${styles.slidePaper} ${styles.slidePaperBest} ${styles.dropDown}`}>
          <h2 className={styles.slidePaperTitle}>인기 롤링 페이퍼 🔥</h2>

          <div className={styles.slidePaperListHidden}>
            <div
              className={styles.slidePaperList}
              style={{ '--slide-offset': `${bestSlideOffsetPx}px` }}
            >
              {bestPaperItems.map((recipient) => (
                <SlidePaperCard
                  key={recipient.id}
                  recipient={recipient}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          <div className={styles.slidePaperArrow}>
            {bestShowLeftButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnLeft}
                onClick={handlePrevBest}
                aria-label="이전"
              >
                <img src={listArrowLeft} alt="" />
              </button>
            )}

            {bestShowRightButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnRight}
                onClick={handleNextBest}
                aria-label="다음"
              >
                <img src={listArrowRight} alt="" />
              </button>
            )}
          </div>
        </div>

        <div className={`${styles.slidePaper} ${styles.slidePaperCurrent} ${styles.dropDown}`}>
          <h2 className={styles.slidePaperTitle}>최근에 만든 롤링 페이퍼 ⭐️</h2>

          <div className={styles.slidePaperListHidden}>
            <div
              className={styles.slidePaperList}
              style={{ '--slide-offset': `${recentSlideOffsetPx}px` }}
            >
              {recentPaperItems.map((recipient) => (
                <SlidePaperCard
                  key={recipient.id}
                  recipient={recipient}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </div>

          <div className={styles.slidePaperArrow}>
            {recentShowLeftButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnLeft}
                onClick={handlePrevRecent}
                aria-label="이전"
              >
                <img src={listArrowLeft} alt="" />
              </button>
            )}

            {recentShowRightButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnRight}
                onClick={handleNextRecent}
                aria-label="다음"
              >
                <img src={listArrowRight} alt="" />
              </button>
            )}
          </div>
        </div>

        <div className={`${styles.btnView} ${styles.dropDown}`}>
          <Link to="/post" className={styles.linkButton}>
            나도 만들어보기
          </Link>
        </div>
      </div>
    </>
  );
}

export default PostList;
