import { useState } from 'react';
import styles from './PostList.module.css';
import Button from '@/components/common/Button/Button';
import ProfileList from '@/components/common/ProfileList/ProfileList';
import EmojiButton from '@/components/common/EmojiButton/EmojiButton';
import arrowLeft from '@/assets/images/post/arrow-left.svg';
import arrowRight from '@/assets/images/post/arrow-right.svg';
/**
 * 롤링 페이퍼 리스트 페이지 컴포넌트
 * 
 * 롤링 페이퍼 서비스의 리스트 페이지를 렌더링합니다.
 *
 * 
 * @return {JSX.Element} 홈 페이지 JSX 요소
 */



function PostList() {
  return <>
    <div className={styles.container}>
      <section className={styles.contents}>

        <div className={`${styles.slidePaper} ${styles.slidePaperBest}`}>
          <h2 className={styles.slidePaperTitle}>인기 롤링 페이퍼 🔥</h2>
          <div className={styles.slidePaperList}>
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem01}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem02}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem03}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem04}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem05}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
          </div>
          <div className={styles.slidePaperArrow}>
            <button className={styles.slidePaperArrowBtnLeft}>
              <img src={arrowLeft} alt="이전" />
            </button>
            <button className={styles.slidePaperArrowBtnRight}>
              <img src={arrowRight} alt="다음" />
            </button>
          </div>
        </div>

        <div className={`${styles.slidePaper} ${styles.slidePaperCurrent}`}>
          <h2 className={styles.slidePaperTitle}>최근에 만든 롤링 페이퍼 ⭐️️</h2>
          <div className={styles.slidePaperList}>
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem05}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon Sowon Kim</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem02}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem06}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
            <div className={`${styles.slidePaperItem} ${styles.slidePaperItem04}`}>
              <p className={styles.slidePaperItemTitle}>To. Sowon</p>
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
          </div>
        </div>


        <div className={styles.btnView}>
          <Button size="large" className={styles.btnLargeFull}>
            나도 만들어보기
          </Button>
        </div>
      </section>
    </div>



  </>;
}

export default PostList;
