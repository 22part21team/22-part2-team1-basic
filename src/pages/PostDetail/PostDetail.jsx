import { useEffect, useState } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '@/api/api';
import PostHeader from '@/components/feature/PostDetail/PostHeader';
import CardList from '@/components/feature/PostDetail/CardList';
import LoadingModal from '@/components/common/LoadingModal/LoadingModal';
import Edit from '@/components/feature/PostDetail/Edit';
import styles from './PostDetail.module.css';

const BACKGROUND_COLORS = {
  beige: 'var(--color-beige-200)',
  purple: 'var(--color-purple-200)',
  blue: 'var(--color-blue-200)',
  green: 'var(--color-green-200)',
};

/**
 * 생성된 롤링페이퍼 페이지 컴포넌트 (Route: /post/{id} 및 /post/{id}/edit)
 * - URL 파라미터 ( id ) 를 통해 수신자가 설정한 배경색 or 이미지로 변경
 * - 전용 헤더 및 메시지 카드 리스트 렌더링
 * - URL 경로에 '/edit' 포함 여부에 따라 편집 모드 UI를 활성화
 *
 * @return {JSX.Element} PostDetail 페이지 레이아웃
 */
function PostDetail() {
  const { id } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // 편집 모드 여부 확인
  const isEditMode = Boolean(useMatch('/post/:id/edit'));
  const cardListContainerStyle = isEditMode
    ? `${styles.cardListContainer} ${styles.editMode}`
    : styles.cardListContainer;

  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        setIsLoading(true);
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
        alert('롤링페이퍼를 찾을 수 없습니다.');
        navigate('/list');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipientInfo();

    return () => {
      document.body.classList.remove(styles.withImageBackground);
      document.body.style.backgroundColor = '';
      document.body.style.backgroundImage = '';
    };
  }, [id, navigate]);

  if (isLoading) {
    return <LoadingModal />;
  }

  if (!recipient) {
    return null;
  }

  return (
    <>
      <PostHeader id={id} recipient={recipient} />
      <div className={cardListContainerStyle}>
        {isEditMode && <Edit />}
        <CardList id={id} isEditMode={isEditMode} />
      </div>
    </>
  );
}

export default PostDetail;
