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
 * 슬라이드 관련 상수
 * - PC 캐러셀(버튼+transform)에서 "페이지 단위 이동" 기준이 됨
 * 카드당 표시할 개수, 카드 너비, 카드 간격, 슬라이드 오프셋 계산
 */
const CARDS_PER_PAGE = 4;
const CARD_WIDTH = 275;
const GAP = 20;
const SLIDE_OFFSET_PER_PAGE = (CARD_WIDTH + GAP) * CARDS_PER_PAGE; // 1180px

/**
 * recipients 목록 조회 API 호출
 * 
 * @param {Object} options - 조회 옵션
 * @param {string} options.sort - 정렬 기준 (예: 'like' 등)
 * @param {number} options.limit - 한 번에 조회할 항목 수 (기본값: 8)
 * @param {number} options.offset - 조회 시작 위치 (기본값: 0)
 * @return {Promise<Object>} - API 응답 데이터 (recipients 목록 응답(JSON))
 * @throws {Error} - 네트워크 오류/ 서버 오류/ 클라이언트 오류 등 apiClient에서 throw한 에러
 */
async function getRecipients({ sort, limit = 8, offset = 0 }) {
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  if (sort) params.append('sort', sort);

  return get(`/recipients/?${params.toString()}`, '롤링페이퍼 리스트 조회');
}

/**
 * API 응답의 next URL로 다음 페이지 조회
 * 
 * @param {string} nextUrl - API 응답에서 제공된 다음 페이지 URL
 * @return {Promise<Object>} - 다음 페이지 응답 (JSON)
 * @throws {Error} - 네트워크/ 서버/ 클라이언트 오류
 */
async function getByNextUrl(nextUrl) {
  return get(nextUrl, '롤링페이퍼 리스트 조회');
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
        // 키보드 접근성: 카드에 포커스가 있을 Enter/Space 키로도 이동 가능하게 처리
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // 스페이스는 기본 스크롤 동작이 있을 수 있어 방지
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
  const location = useLocation();
  const { toast, showToast } = useToast();

  // ====== Best(인기) 상태
  const [bestPaperItems, setBestPaperItems] = useState([]);
  const [bestNext, setBestNext] = useState(null);
  const [isBestLoadingMore, setIsBestLoadingMore] = useState(false);

  // ====== Recent(최신) 상태
  const [recentPaperItems, setRecentPaperItems] = useState([]);
  const [recentNext, setRecentNext] = useState(null);
  const [isRecentLoadingMore, setIsRecentLoadingMore] = useState(false);

  // ====== PC 캐러셀 "페이지 인덱스"
  // - transform 기반으로 한 페이지(4장)씩 넘기는 데 쓰임
  const [bestSlideIndex, setBestSlideIndex] = useState(0);
  const [recentSlideIndex, setRecentSlideIndex] = useState(0);

  const [status, setStatus] = useState('loading'); // loading | ok

  /**
   * 최초 진입 시 Best/Recent 1페이지 로딩
   * - Best: like 정렬 우선 시도, 실패 시 기본 정렬로 재시도
   * - 에러 시 네트워크/서버 에러는 에러 페이지, 그 외는 토스트 알림
   * 
   * @return {void}
   * @thorws {Error} - 내부에서 throw되면 catch에서 공통 에러 처리
   */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setStatus('loading');

    // like 정렬 실패(주로 4xx)만 fallback, 그 외는 진짜 에러로 처리
    let bestRes;
      try {
        bestRes = await getRecipients({ sort: 'like', limit: 8, offset: 0 });
      } catch (e) {
        // sort 미지원(보통 4xx)만 fallback
        if (e?.status >= 400 && e?.status < 500) {
          bestRes = await getRecipients({ limit: 8, offset: 0 });
        } else {
          throw e; // 네트워크/ 서버 오류는 숨기지 않고 상위 catch로 보냄
        }
      }

      // recent: 기본 목록 1페이지
      const recentRes = await getRecipients({ limit: 8, offset: 0 });

      setBestPaperItems(bestRes?.results ?? []);
      setBestNext(bestRes?.next ?? null);
      setBestSlideIndex(0); // 데이터 리셋되면 캐러셀도 첫 페이지로

      setRecentPaperItems(recentRes?.results ?? []);
      setRecentNext(recentRes?.next ?? null);
      setRecentSlideIndex(0);

      setStatus('ok');
      } catch (error) {
        console.error('롤링 페이퍼 리스트 조회 에러: ', error);

        // 네트워크 에러: 에러 페이지 이동
        if (error?.isNetworkError) {
          navigate('/error', {
            state: {
              type: 'network',
              message: error.message
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
        // - 일부 페이지는 빈 화면 방지를 위해 "ok" 상태로 둬 레이아웃 유지
        showToast(error?.message || '목록을 불러오는 중 문제가 발생했습니다.');

        setStatus('ok');
      }
    };

    fetchAll();
  }, [navigate, showToast]);

     /**
     * 다른 페이지에서 navigate로 넘어dhau location.state.message가 있을 경우 토스트로 노출
     * - 노출 후에는 history state 초기화, 새로고침/ 뒤로가기에서 반복 노출 방지
     * 
     * @return {void}
     */
  useEffect(() => {
    if (location.state?.message) {
      showToast(location.state.message);
      window.history.replaceState({}, document.title); // 같은 메시지 재노출 방지
    }
  }, [location, showToast]);

   /**
   * 카드 클릭 시 상세 페이지 이동
   *
   * @param {number|string} id - recipients id
   * @return {void}
   * @throws {Error} - 없음
   */
  const handleCardClick = (id) => navigate(`/post/${id}`);

  // ===== Best 캐러셀 계산
  const bestTotalCards = bestPaperItems.length;
  const bestTotalPages = Math.ceil(bestTotalCards / CARDS_PER_PAGE) || 1;
  const bestHasMoreSlides = bestSlideIndex < bestTotalPages - 1;
  const bestShowLeftButton = bestSlideIndex > 0;
  // next가 있으면 "마지막 페이지여도" 우측 버튼 보여야 함
  const bestShowRightButton = bestHasMoreSlides || !!bestNext;
  const bestSlideOffsetPx = -bestSlideIndex * SLIDE_OFFSET_PER_PAGE;

  // ===== Recent 캐러셀 계산
  const recentTotalCards = recentPaperItems.length;
  const recentTotalPages = Math.ceil(recentTotalCards / CARDS_PER_PAGE) || 1;
  const recentHasMoreSlides = recentSlideIndex < recentTotalPages - 1; // "이미 로드된 카드" 안에서 더 넘길 페이지가 있는지 
  const recentShowLeftButton = recentSlideIndex > 0;
  const recentShowRightButton = recentHasMoreSlides || !!recentNext; // nexyt가 있으면 마지막 페이지여도 우측 버튼 보여야 함
  const recentSlideOffsetPx = -recentSlideIndex * SLIDE_OFFSET_PER_PAGE;

  /**
   * 이전 버튼: 단순히 slideIndex만 감소
   * - 데이터 추가 로드와는 무관(이미 로드된 범위 내에서만 뒤로 감)
   *
   * @return {void}
   * @throws {Error} - 없음
   */
  const handlePrevBest = () => setBestSlideIndex((i) => Math.max(0, i - 1));
  const handlePrevRecent = () => setRecentSlideIndex((i) => Math.max(0, i - 1));

  /**
   * PC 버튼용: "한 번 클릭 = 다음 페이지로"
   * - 다음 페이지를 보여주려면 최소 (currentIndex+2)*4 개 카드가 필요
   * - 부족하면 next로 먼저 로드하고 나서 index 증가
   * 
   * @return {Promise<void>}
   * @throws {Error} - 네트워크/서버 오류 시 throw된 에러를 catch에서 처리
   */
  const ensureBestNextPageThenMove = async () => {
    if (isBestLoadingMore) return; // 중복 호출 방지

    const nextPageIndex = bestSlideIndex + 1;
    const neededCount = (nextPageIndex + 1) * CARDS_PER_PAGE; // "다음 페이지"까지 채워야하는 최소 카드 수

   // 이미 로드된 카드만으로 다음 페이지 가능 → 이동
    if (bestPaperItems.length >= neededCount) {
      setBestSlideIndex(nextPageIndex);
      return;
    }

    // 부족한데 next도 없음 → 못 감
    if (!bestNext) return;

    try {
      setIsBestLoadingMore(true);

      // 필요한 수량을 채울 때까지 next를 여러번 당겨올 수 있게 while 사용
      // - 한 번의 next가 4개보다 적게 올 수도 있음(서버 페이지 사이즈/필터에 따라)
      let nextUrl = bestNext;
      let items = bestPaperItems;
      let safeGuard = 0; // 무한 루프 방지

       while (items.length < neededCount && nextUrl && safeGuard < 10) {
        safeGuard += 1;
        const res = await getByNextUrl(nextUrl);
        const newItems = res?.results ?? [];
        nextUrl = res?.next ?? null;
        items = [...items, ...newItems];

        // 데이터가 안 늘어나면 탈출 (비정상 응답: next만 있고 result가 빈 경우 방어)
        if (newItems.length === 0) break;
      }

      setBestPaperItems(items);
      setBestNext(nextUrl);

      // 춘분히 채워졌으면 다음 페이지 이동
      if (items.length >= neededCount) {
        setBestSlideIndex(nextPageIndex);
      }
    } catch (error) {
      console.error('Best 추가 로드 에러:', error);

      if (error?.isNetworkError) {
        navigate('/error', { state: { type: 'network', message: error.message } });
        return;
      }

      if (error?.status >= 500) {
        navigate('/error', {
          state: { type: 'server', message: '서버에 일시적인 문제가 발생했습니다.' },
        });
        return;
      }

      showToast(error?.message || '목록을 더 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsBestLoadingMore(false);
    }
  }; 

  /**
   * (Recent) PC 버튼용: "한 번 클릭 = 다음 페이지로"
   * - Best와 동일한 원리: 필요한 카드 수가 부족하면 next를 먼저 여러 번 호출해서 채움
   *
   * @return {Promise<void>}
   * @throws {Error} - 네트워크/서버 오류 시 throw된 에러를 catch에서 처리
   */  
  const ensureRecentNextPageThenMove = async () => {
    if (isRecentLoadingMore) return;

    const nextPageIndex = recentSlideIndex + 1;
    const neededCount = (nextPageIndex + 1) * CARDS_PER_PAGE;

    if (recentPaperItems.length >= neededCount) {
      setRecentSlideIndex(nextPageIndex);
      return;
    }

    if (!recentNext) return;

    try {
      setIsRecentLoadingMore(true);

      let nextUrl = recentNext;
      let items = recentPaperItems;
      let safeGuard = 0;

      while (items.length < neededCount && nextUrl && safeGuard < 10) {
        safeGuard += 1;
        const res = await getByNextUrl(nextUrl);
        const newItems = res?.results ?? [];
        nextUrl = res?.next ?? null;
        items = [...items, ...newItems];

        if (newItems.length === 0) break;
      }

      setRecentPaperItems(items);
      setRecentNext(nextUrl);

      if (items.length >= neededCount) {
        setRecentSlideIndex(nextPageIndex);
      }
    } catch (error) {
      console.error('Recent 추가 로드 에러:', error);

      if (error?.isNetworkError) {
        navigate('/error', { state: { type: 'network', message: error.message } });
        return;
      }

      if (error?.status >= 500) {
        navigate('/error', {
          state: { type: 'server', message: '서버에 일시적인 문제가 발생했습니다.' },
        });
        return;
      }

      showToast(error?.message || '목록을 더 불러오는 중 문제가 발생했습니다.');
    } finally {
      setIsRecentLoadingMore(false);
    }
  };

  /**
   * (Best) 모바일/태블릿용: 가로 스크롤이 끝 근처면 자동 로드
   * remaining(px)이 작아지면 "끝 근처"라고 판단
   * 
   * @param {React.UIEvent<HTMLDivElement>} e - 스크롤 이벤트
   * @return {Promise<void>}
   * @throws {Error} - next 호출 실패 시 catch에서 토스트 처리
   */
  const handleBestHorizontalScroll = async (e) => {
    if (isBestLoadingMore || !bestNext) return; // 중복 로드/ 더 이상 로드 없음 방지 

    const el = e.currentTarget;
    const remaining = el.scrollWidth - (el.scrollLeft + el.clientWidth); // 현재 스크롤 위치에서 "끝까지 남은거리"

    // 끝에서 120px 이내로 오면 로드
    if (remaining <= 120) {
      try {
        setIsBestLoadingMore(true);
        const res = await getByNextUrl(bestNext);
        const newItems = res?.results ?? [];
        setBestPaperItems((prev) => [...prev, ...newItems]); // 기존 카드 뒤에 누적
        setBestNext(res?.next ?? null); // next 갱신(없으면 null)
      } catch (error) {
        console.error('Best 스크롤 추가 로드 에러:', error);
        showToast(error?.message || '목록을 더 불러오는 중 문제가 발생했습니다.');
      } finally {
        setIsBestLoadingMore(false);
      }
    }
  };

  /**
   * (Recent) 모바일/태블릿용: 가로 스크롤 끝 근처에서 next 자동 로드
   *
   * @param {React.UIEvent<HTMLDivElement>} e - 스크롤 이벤트
   * @return {Promise<void>}
   * @throws {Error} - next 호출 실패 시 catch에서 토스트 처리
   */
  const handleRecentHorizontalScroll = async (e) => {
    if (isRecentLoadingMore || !recentNext) return;

    const el = e.currentTarget;
    const remaining = el.scrollWidth - (el.scrollLeft + el.clientWidth);

    if (remaining <= 120) {
      try {
        setIsRecentLoadingMore(true);
        const res = await getByNextUrl(recentNext);
        const newItems = res?.results ?? [];
        setRecentPaperItems((prev) => [...prev, ...newItems]);
        setRecentNext(res?.next ?? null);
      } catch (error) {
        console.error('Recent 스크롤 추가 로드 에러:', error);
        showToast(error?.message || '목록을 더 불러오는 중 문제가 발생했습니다.');
      } finally {
        setIsRecentLoadingMore(false);
      }
    }
  };

  if (status === 'loading') return <LoadingModal />;

  return (
    <>
      {toast.show && <Toast message={toast.message} />}
     
      {/* ===== BEST ===== */}
      <div className={styles.contents}>
        <div className={`${styles.slidePaper} ${styles.slidePaperBest} ${styles.dropDown1}`}>
          <h2 className={styles.slidePaperTitle}>인기 롤링 페이퍼 🔥</h2>
          
          {/* onScroll로 모바일/태블릿 로드 트리거 */}
          <div className={styles.slidePaperListHidden} onScroll={handleBestHorizontalScroll}>
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
         
          {/* PC에서는 좌/우 버튼으로 4장씩 페이지 이동 */}
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
                onClick={ensureBestNextPageThenMove}
                aria-label="다음"
              >
                <img src={listArrowRight} alt="" />
              </button>
            )}
          </div>
        </div>
       
        {/* ===== RECENT ===== */}
        <div className={`${styles.slidePaper} ${styles.slidePaperCurrent} ${styles.dropDown2}`}>
          <h2 className={styles.slidePaperTitle}>최근에 만든 롤링 페이퍼 ⭐️</h2>

          <div className={styles.slidePaperListHidden} onScroll={handleRecentHorizontalScroll}>
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
                onClick={ensureRecentNextPageThenMove}
                aria-label="다음"
              >
                <img src={listArrowRight} alt="" />
              </button>
            )}
          </div>
        </div>

        <div className={`${styles.btnView} ${styles.dropDown3}`}>
          <Link to="/post" className={styles.linkButton}>
            나도 만들어보기
          </Link>
        </div>
      </div>
    </>
  );
}

export default PostList;
