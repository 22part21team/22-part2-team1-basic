
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styles from './PostList.module.css';
import Button from '@/components/common/Button/Button';
import ProfileList from '@/components/common/ProfileList/ProfileList';
import EmojiButton from '@/components/common/EmojiButton/EmojiButton';
import listArrowLeft from '@/assets/images/list/list-arrow-left.svg';
import listArrowRight from '@/assets/images/list/list-arrow-right.svg';

/**
 * 롤링 페이퍼 리스트 페이지 컴포넌트
 *
 * 인기 롤링 페이퍼와 최근에 생성된 롤링 페이퍼를
 * 가로 슬라이드 형태의 카드 리스트로 보여주며,
 * 좌우 화살표 버튼을 통해 페이지 단위로 이동할 수 있습니다.
 *
 * @returns {JSX.Element} 롤링 페이퍼 리스트 페이지 JSX 요소
 */

const CARDS_PER_PAGE = 4;
const CARD_WIDTH = 275;
const GAP = 20;
const SLIDE_OFFSET_PER_PAGE = CARD_WIDTH * CARDS_PER_PAGE + GAP * (CARDS_PER_PAGE - 1); // 1160px

const bestPaperItems = [
  { id: 1, patternClass: 'slidePaperItem01' },
  { id: 2, patternClass: 'slidePaperItem02' },
  { id: 3, patternClass: 'slidePaperItem03' },
  { id: 4, patternClass: 'slidePaperItem04' },
  { id: 5, patternClass: 'slidePaperItem05' },
];

const recentPaperItems = [
  { id: 1, patternClass: 'slidePaperItem05', title: 'To. Sowon Sowon Kim' },
  { id: 2, patternClass: 'slidePaperItem02', title: 'To. Sowon' },
  { id: 3, patternClass: 'slidePaperItem06', title: 'To. Sowon' },
  { id: 4, patternClass: 'slidePaperItem04', title: 'To. Sowon' },
  { id: 5, patternClass: 'slidePaperItem04', title: 'To. Sowon' },
  { id: 6, patternClass: 'slidePaperItem05', title: 'To. Sowon Sowon Kim' },
];

function SlidePaperCard({ patternClass, title = 'To. Sowon', onClick }) {
  return (
    <div className={`${styles.slidePaperItem} ${styles[patternClass]}`}
      onClick={onClick}
      role="button"
      >
      <p className={styles.slidePaperItemTitle}>{title}</p>
      <p className={styles.slidePaperItemPhotoCount}>
        <ProfileList authorCount={27} />
      </p>
      <p className={styles.slidePaperItemTotal}><span>30</span>명이 작성했어요!</p>
      <p className={styles.slidePaperItemBadge}>
        <EmojiButton emoji="👍" count={20} />
        <EmojiButton emoji="😍" count={12} />
        <EmojiButton emoji="😢" count={7} />
      </p>
    </div>
  );
}


function PostList() {

  const navigate = useNavigate();
  const handleCreatePost = () => {navigate('/post');}; 
  const handleCardClick = (id) => { navigate(`/post/${id}`); };

  const [bestSlideIndex, setBestSlideIndex] = useState(0);
  const [recentSlideIndex, setRecentSlideIndex] = useState(0);

  

  const bestTotalCards = bestPaperItems.length;
  const bestTotalPages = Math.ceil(bestTotalCards / CARDS_PER_PAGE);
  const bestShowArrows = bestTotalCards > CARDS_PER_PAGE;
  const bestShowLeftButton = bestShowArrows && bestSlideIndex > 0;
  const bestShowRightButton = bestShowArrows && bestSlideIndex < bestTotalPages - 1;
  const bestSlideOffsetPx = -bestSlideIndex * SLIDE_OFFSET_PER_PAGE;

  const recentTotalCards = recentPaperItems.length;
  const recentTotalPages = Math.ceil(recentTotalCards / CARDS_PER_PAGE);
  const recentShowArrows = recentTotalCards > CARDS_PER_PAGE;
  const recentShowLeftButton = recentShowArrows && recentSlideIndex > 0;
  const recentShowRightButton = recentShowArrows && recentSlideIndex < recentTotalPages - 1;
  const recentSlideOffsetPx = -recentSlideIndex * SLIDE_OFFSET_PER_PAGE;

  const goPrevBest = () => {
    setBestSlideIndex((i) => Math.max(0, i - 1));
  };

  const goNextBest = () => {
    setBestSlideIndex((i) => Math.min(bestTotalPages - 1, i + 1));
  };

  const goPrevRecent = () => {
    setRecentSlideIndex((i) => Math.max(0, i - 1));
  };

  const goNextRecent = () => {
    setRecentSlideIndex((i) => Math.min(recentTotalPages - 1, i + 1));
  };

  return <>
    <div className={styles.container}>
      <section className={styles.contents}>

        <div className={`${styles.slidePaper} ${styles.slidePaperBest}`}>
          <h2 className={styles.slidePaperTitle}>인기 롤링 페이퍼 🔥</h2>
          <div className={styles.slidePaperListHidden}>
            <div
              className={styles.slidePaperList}
              style={{ '--slide-offset': `${bestSlideOffsetPx}px` }}
            >
              {bestPaperItems.map((item) => (
                <SlidePaperCard
                  key={item.id}
                  id={item.id}
                  patternClass={item.patternClass}
                  onClick={() => handleCardClick(item.id)}
                />
              ))}
            </div>
          </div>
          <div className={styles.slidePaperArrow}>
            {bestShowLeftButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnLeft}
                onClick={goPrevBest}
                aria-label="이전"
              >
                <img src={listArrowLeft} alt="" />
              </button>
            )}
            {bestShowRightButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnRight}
                onClick={goNextBest}
                aria-label="다음"
              >
                <img src={listArrowRight} alt="" />
              </button>
            )}
          </div>
        </div>

        <div className={`${styles.slidePaper} ${styles.slidePaperCurrent}`}>
          <h2 className={styles.slidePaperTitle}>최근에 만든 롤링 페이퍼 ⭐️️</h2>
          <div className={styles.slidePaperListHidden}>
            <div
              className={styles.slidePaperList}
              style={{ '--slide-offset': `${recentSlideOffsetPx}px` }}
            >
              {recentPaperItems.map((item) => (
                <SlidePaperCard
                  key={item.id}
                  id={item.id}
                  patternClass={item.patternClass}
                  title={item.title}
                  onClick={() => handleCardClick(item.id)}
                />
              ))}
            </div>
          </div>
          <div className={styles.slidePaperArrow}>
            {recentShowLeftButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnLeft}
                onClick={goPrevRecent}
                aria-label="이전"
              >
                <img src={listArrowLeft} alt="" />
              </button>
            )}
            {recentShowRightButton && (
              <button
                type="button"
                className={styles.slidePaperArrowBtnRight}
                onClick={goNextRecent}
                aria-label="다음"
              >
                <img src={listArrowRight} alt="" />
              </button>
            )}
          </div>
        </div>

        <div className={styles.btnView}>
          <Button size="56" className={styles.btnLargeFull} onClick={handleCreatePost}>
            나도 만들어보기
          </Button>
        </div>
      </section>
    </div>
  </>;
}

export default PostList;