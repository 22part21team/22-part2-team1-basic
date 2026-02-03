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
 * - 수신자 정보 및 메시지 리스트 상태 관리 및 삭제 로직 수행
 * - URL 경로에 '/edit' 포함 여부에 따라 편집 모드 UI를 활성화
 *
 * @return {JSX.Element} PostDetail 페이지 레이아웃
 */
function PostDetail() {
  const { id } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // messages state
  const [messages, setMessages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  // 삭제 관련 state
  const [isDeleteRecipientOpen, setIsDeleteRecipientOpen] = useState(false);
  const [isDeleteMessageOpen, setIsDeleteMessageOpen] = useState(false);
  const [messageId, setMessageId] = useState(null);
  // 편집 모드 확인 state
  const isEditMode = Boolean(useMatch('/post/:id/edit'));
  const cardListContainerStyle = isEditMode
    ? `${styles.cardListContainer} ${styles.editMode}`
    : styles.cardListContainer;

  // recipients 조회
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

  // messages 조회
  useEffect(() => {
    const fetchMessageInfo = async () => {
      try {
        setIsLoading(true);
        const data = await fetchApi(
          `recipients/${id}/messages`,
          {},
          isEditMode ? '?limit=6' : '?limit=5'
        );
        setMessages(data.results);
        setNextPage(data.next);
      } catch (error) {
        console.error('롤링페이퍼 정보 조회 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessageInfo();
  }, [id, isEditMode]);

  // 롤링페이퍼 삭제 이벤트 1 : 모달 토글
  const handleRecipientDeleteModal = () => {
    setIsDeleteRecipientOpen(!isDeleteRecipientOpen);
  };

  // 롤링페이퍼 삭제 이벤트 2 : 모달에서 확인 클릭 시 삭제 실행
  const handleRecipientDelete = async () => {
    try {
      await fetchApi(`recipients/${id}`, { method: 'DELETE' });
      navigate('/list');
    } catch (error) {
      console.error('삭제 중 오류:', error);
    }
  };

  // 메시지 삭제 함수 1 : 모달 토글 & 삭제할 메시지 ID 저장
  const handleMessageDeleteModal = (targetMessageId) => {
    if (isDeleteMessageOpen) {
      setIsDeleteMessageOpen(false);
      setMessageId(null);
    } else {
      setIsDeleteMessageOpen(true);
      setMessageId(targetMessageId);
    }
  };

  // 메시지 삭제 함수 2 : 모달에서 확인 클릭 시 삭제 실행
  const handleMessageDelete = async () => {
    try {
      await fetchApi(`messages/${messageId}`, { method: 'DELETE' });
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
      const data = await fetchApi(`recipients/${id}`);
      setRecipient(data);
    } catch (error) {
      console.error('메시지 삭제 오류:', error);
      alert('메시지 삭제에 실패했습니다.');
    } finally {
      setIsDeleteMessageOpen(false);
    }
  };

  if (isLoading) {
    return <LoadingModal />;
  }

  if (!recipient) {
    return null;
  }

  return (
    <>
      <PostHeader id={id} recipient={recipient} isEditMode={isEditMode} />
      <div className={cardListContainerStyle}>
        {isEditMode && (
          <Edit
            isOpen={isDeleteRecipientOpen}
            onRecipientDeleteModal={handleRecipientDeleteModal}
            onRecipientDelete={handleRecipientDelete}
          />
        )}
        <CardList
          id={id}
          isEditMode={isEditMode}
          messages={messages}
          setMessages={setMessages}
          nextPage={nextPage}
          setNextPage={setNextPage}
          isDeleteMessageOpen={isDeleteMessageOpen}
          onMessageDeleteModal={handleMessageDeleteModal}
          onMessageDelete={handleMessageDelete}
        />
      </div>
    </>
  );
}

export default PostDetail;
