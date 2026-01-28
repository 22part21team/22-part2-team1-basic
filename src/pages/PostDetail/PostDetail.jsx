import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApi } from '@/api/api';
import PostHeader from '@/components/feature/PostDetail/PostHeader';
import CardList from '@/components/feature/PostDetail/CardList';
import styles from './PostDetail.module.css';

const BACKGROUND_COLORS = {
  beige: 'var(--color-beige-200)',
  purple: 'var(--color-purple-200)',
  blue: 'var(--color-blue-200)',
  green: 'var(--color-green-200)',
};

/**
 * 생성된 롤링페이퍼 페이지 컴포넌트 (Route: /post/{id})
 * - URL 파라미터 ( id ) 를 통해 수신자가 설정한 배경색 or 이미지로 변경
 * - 전용 헤더 및 메시지 카드 리스트 렌더링
 *
 * @return {JSX.Element} PostDetail 페이지 레이아웃
 */
function PostDetail() {
  const { id } = useParams();
  const [recipient, setRecipient] = useState({});

  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        const data = await fetchApi(`recipients/${id}`);
        setRecipient(data);

        // 백그라운드 이미지 or 컬러 변경
        if (data.backgroundImageURL) {
          const bgImg = data.backgroundImageURL;
          document.body.classList.add(styles.withImageBackground);
          document.body.style.backgroundImage = `url(${bgImg})`;
        } else {
          const bgColor = BACKGROUND_COLORS[data.backgroundColor] || BACKGROUND_COLORS.beige;
          document.body.style.backgroundColor = bgColor;
        }
      } catch (error) {
        console.error('롤링페이퍼 정보 조회 오류:', error);
      }
    };

    fetchRecipientInfo();

    return () => {
      document.body.classList.remove(styles.withImageBackground);
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, [id]);

  return (
    <>
      <PostHeader recipient={recipient} />
      <div className={styles.cardListContainer}>
        <CardList />
      </div>
    </>
  );
}

export default PostDetail;
