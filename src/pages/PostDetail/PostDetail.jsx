import { useEffect } from 'react';
import PostHeader from '@/components/feature/PostDetail/PostHeader';
import CardList from '@/components/feature/PostDetail/CardList';
import styles from './PostDetail.module.css';

/**
 * 생성된 롤링페이퍼 페이지 컴포넌트 (Route: /post/{id})
 *
 * @return {JSX.Element} PostDetail 페이지 컴포넌트
 */
function PostDetail() {
  useEffect(() => {
    document.body.style.backgroundColor = 'var(--color-beige-200)';

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <>
      <PostHeader />
      <div className={styles.cardListContainer}>
        <CardList />
      </div>
    </>
  );
}

export default PostDetail;
