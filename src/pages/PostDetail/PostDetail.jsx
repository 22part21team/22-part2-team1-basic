import { useEffect, useState } from 'react';
import { useMatch, useNavigate, useParams } from 'react-router-dom';
import { del, get } from '@/utils/apiClient';
import { useToast } from '@/hooks/useToast';
import PostHeader from '@/components/feature/PostDetail/PostHeader';
import CardList from '@/components/feature/PostDetail/CardList';
import LoadingModal from '@/components/common/LoadingModal/LoadingModal';
import Edit from '@/components/feature/PostDetail/Edit';
import Toast from '@/components/common/Toast/Toast';
import styles from './PostDetail.module.css';

// ===== 백그라운드 컬러 매핑 설정 =====
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
  // ===== 라우터 =====
  const { id } = useParams();
  const navigate = useNavigate();
  // ===== 커스텀 훅 =====
  const { toast, showToast } = useToast();
  // ===== Recipients 조회 State =====
  const [isLoading, setIsLoading] = useState(true);
  const [recipient, setRecipient] = useState(null);
  // ===== Messages 조회 State =====
  const [messages, setMessages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  // ===== 롤링페이퍼 삭제 State =====
  const [isDeleteRecipientOpen, setIsDeleteRecipientOpen] = useState(false);
  // ===== 메시지 삭제 State =====
  const [isDeleteMessageOpen, setIsDeleteMessageOpen] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [deleteSender, setDeleteSender] = useState(null);
  // ===== 기타 변수 =====
  const isEditMode = Boolean(useMatch('/post/:id/edit'));
  const cardListContainerStyle = isEditMode // isEditMode 값에 따라 cardListContainer의 스타일 변경
    ? `${styles.cardListContainer} ${styles.editMode}`
    : styles.cardListContainer;

  /**
   * Recipients 조회
   * * 수신자 데이터를 저장하고 배경색/이미지 적용
   * @throws {NetworkError, 500s} 에러 페이지('/error')로 이동
   * @throws {404, 400s} 목록 페이지('/list')로 이동
   * @throws {Other} 토스트 알림
   */
  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        setIsLoading(true);
        const data = await get(`/recipients/${id}/`, '롤링페이퍼 조회');
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
        console.error('롤링페이퍼 정보 조회 에러:', error);
        // 네트워크 에러 - 에러 페이지로 이동
        if (error.isNetworkError) {
          navigate('/error', {
            state: {
              type: 'network',
              message: error.message,
            },
          });
          return;
        }
        // 404 에러 - 목록 페이지로 이동
        if (error.status === 404) {
          navigate('/list', {
            state: { message: error.message },
          });
          return;
        }
        // 400번대 클라이언트 에러 - 목록 페이지로 이동
        if (error.status >= 400 && error.status < 500) {
          navigate('/list', {
            state: { message: '롤링페이퍼 조회 중 문제가 발생했습니다.' },
          });
          return;
        }
        // 500번대 서버 에러 - 에러 페이지로 이동
        if (error.status >= 500) {
          navigate('/error', {
            state: {
              type: 'server',
              message: '서버에 일시적인 문제가 발생했습니다.',
            },
          });
          return;
        }
        // 기타 에러
        showToast('요청 처리 중 문제가 발생했습니다.');
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
  }, [id, navigate, showToast]);

  /**
   * Messages 조회
   * * 편집 모드 여부 (isEditMode)에 따라 데이터 로드 개수 조절하여 저장
   * @throws {Other} 토스트 알림
   */
  useEffect(() => {
    const fetchMessageInfo = async () => {
      try {
        // 메시지 레이아웃에 맞춰서, 짝수 (/${id}/edit/) or 홀수 (/id/) 로 로드
        const data = await get(
          `/recipients/${id}/messages/${isEditMode ? '?limit=6' : '?limit=5'}`,
          '롤링페이퍼 메시지 조회'
        );
        setMessages(data.results);
        setNextPage(data.next);
      } catch (error) {
        console.error('롤링페이퍼 메시지 조회 에러:', error);
        showToast('롤링페이퍼 메시지를 불러올 수 없습니다.');
      }
    };

    fetchMessageInfo();
  }, [id, isEditMode, showToast]);

  /**
   * 롤링페이퍼 삭제 확인 모달 제어
   * * 삭제 여부를 묻는 모달의 표시 상태를 토글
   */
  const handleRecipientDeleteModal = () => {
    setIsDeleteRecipientOpen(!isDeleteRecipientOpen);
  };

  /**
   * 롤링페이퍼 삭제 실행
   * * '확인' 클릭 시, 서버 API를 호출하여 데이터 삭제
   * * 성공 시 목록 페이지('/list')로 이동
   * @throws {NetworkError, 400s, 500s, Other} 토스트 알림
   * @throws {404} 목록 페이지로 이동
   */
  const handleRecipientDelete = async () => {
    try {
      await del(`/recipients/${id}/`, '롤링페이퍼 삭제');
      navigate('/list');
    } catch (error) {
      console.error('롤링페이퍼 삭제 에러:', error);
      // 네트워크 에러 - 토스트 알림
      if (error.isNetworkError) {
        showToast(error.message);
        return;
      }
      // 404 에러 - 목록 페이지로 이동
      if (error.status === 404) {
        navigate('/list');
        return;
      }
      // 400번대 클라이언트 에러 - 토스트 알림
      if (error.status >= 400 && error.status < 500) {
        showToast('삭제 요청 중 문제가 발생했습니다.');
        return;
      }
      // 500번대 서버 에러 - 토스트 알림
      if (error.status >= 500) {
        showToast('서버 일시적 오류로 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      // 기타 에러
      showToast('삭제 중 알 수 없는 문제가 발생했습니다.');
    }
  };

  /**
   * 메시지 삭제 확인 모달 제어
   * * 삭제 여부를 묻는 모달의 표시 상태를 토글
   * * 삭제 할 메시지의 정보 ( ID, 발신자명 ) 저장
   * @param {number} targetMessageId - 삭제 할 메시지의 ID
   * @param {string} targetSender - 삭제 할 메시지의 발신자 이름
   */
  const handleMessageDeleteModal = (targetMessageId, targetSender) => {
    if (isDeleteMessageOpen) {
      setIsDeleteMessageOpen(false);
      setDeleteMessageId(null);
    } else {
      setIsDeleteMessageOpen(true);
      setDeleteMessageId(targetMessageId);
      setDeleteSender(targetSender);
    }
  };

  /**
   * 메시지 삭제 실행
   * * '확인' 클릭 시, 서버 API를 호출하여 데이터 삭제
   * * 성공 시 토스트 알림 후 리스트 재조회
   * @throws {NetworkError, 400s, 500s, Other} 토스트 알림
   * @throws {404} 토스트 알림 및 리스트 재조회
   */
  const handleMessageDelete = async () => {
    try {
      await del(`/messages/${deleteMessageId}/`, '메시지 삭제');
      // 1. 메시지 리스트에서 제거 후 반영
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== deleteMessageId)
      );
      // 2. 전체 데이터 ( 메시지 개수 등 ) 갱신
      const data = await get(`/recipients/${id}/`, '메시지 조회');
      setRecipient(data);
      // 성공 알림
      showToast('메시지가 삭제되었습니다.');
    } catch (error) {
      console.error('롤링페이퍼 메시지 삭제 에러:', error);
      // 네트워크 에러 - 토스트 알림
      if (error.isNetworkError) {
        showToast(error.message);
        return;
      }
      // 404 에러 - 토스트 알림 및 리스트 재조회
      if (error.status === 404) {
        showToast('이미 삭제되었거나 존재하지 않는 메시지입니다.');
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== deleteMessageId)
        );
        return;
      }
      // 400번대 클라이언트 에러 - 토스트 알림
      if (error.status >= 400 && error.status < 500) {
        showToast('삭제 요청 중 문제가 발생했습니다.');
        return;
      }
      // 500번대 서버 에러 - 토스트 알림
      if (error.status >= 500) {
        showToast('서버 일시적 오류로 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      // 기타 에러
      showToast('삭제 중 알 수 없는 문제가 발생했습니다.');
    } finally {
      setIsDeleteMessageOpen(false);
    }
  };

  // 로딩 중에는 로딩 화면 출력
  if (isLoading) {
    return <LoadingModal />;
  }

  // 해당 id의 롤링페이퍼 ( recipient ) 가 없으면 빈 화면 출력
  if (!recipient) {
    return null;
  }

  return (
    <>
      {/* 토스트 */}
      {toast.show && <Toast message={toast.message} />}
      {/* 롤링페이퍼 상세페이지용 헤더 */}
      <PostHeader id={id} recipient={recipient} isEditMode={isEditMode} />
      {/* 롤링페이퍼 메시지 리스트 */}
      <div className={cardListContainerStyle}>
        {/* URL이 (/${id}/edit/) 이면 편집 모드 UI 활성화 */}
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
          deleteSender={deleteSender}
        />
      </div>
    </>
  );
}

export default PostDetail;
