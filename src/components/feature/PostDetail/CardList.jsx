import { useCallback, useEffect, useRef, useState } from 'react';
import { get } from '@/utils/apiClient';
import { useToast } from '@/hooks/useToast';
import Card from './Card';
import CardModal from './CardModal';
import Loading from '@/components/common/Loading/Loading';
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal';
import Toast from '@/components/common/Toast/Toast';
import styles from './CardList.module.css';

/**
 * 생성된 롤링페이퍼 페이지의 메시지 카드 리스트 컴포넌트
 * - 일반 모드 : 롤링페이퍼 추가 버튼 + 롤링페이퍼 5개 데이터 구성으로 시작
 * - 편집 모드 : 롤링페이퍼 6개 데이터 구성으로 시작
 * - 무한 스크롤을 통한 메시지 추가 로드 처리
 *
 * @param {number} id - 롤링페이퍼 수신자의 고유 식별 ID
 * @param {boolean} isEditMode - 편집 모드 활성화 여부
 * @param {Array} messages - 렌더링할 메시지 리스트 데이터
 * @param {Function} setMessages - 메시지 리스트 상태 업데이트 함수
 * @param {string} nextPage - 다음 페이지 데이터를 가져올 API URL
 * @param {Function} setNextPage - 다음 페이지 상태 업데이트 함수
 * @param {boolean} isDeleteMessageOpen - 메시지 삭제 확인 모달 오픈 상태
 * @param {Function} onMessageDeleteModal - 메시지 삭제 모달 토글 및 ID 저장 함수
 * @param {Function} onMessageDelete - 메시지 삭제 실행 함수
 * @param {string} deleteSender - 삭제 이벤트 실행 시, 삭제 확인 모달에 표시될 발신자 이름
 * @return 추가 버튼 및 롤링페이퍼 메시지 카드 리스트 UI
 */
function CardList({
  id,
  isEditMode,
  messages,
  setMessages,
  nextPage,
  setNextPage,
  isDeleteMessageOpen,
  onMessageDeleteModal,
  onMessageDelete,
  deleteSender,
}) {
  // ===== 커스텀 훅 =====
  const { toast, showToast } = useToast();
  // ===== 메시지 상세 모달 State =====
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  // ===== 무한 스크롤 (추가 로드) State =====
  const [isAddLoading, setIsAddLoading] = useState(false);
  // ===== DOM 참조 (무한 스크롤용) =====
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  /**
   * 데이터 추가 로드 함수
   * * 다음 페이지 데이터 로드 시 디자인 UI에 맞게 6개씩 로드하도록 URL 치환 후 호출
   * * 성공 시 기존 메시지 리스트에 데이터 추가
   * @throws {Other} 토스트 알림
   */
  const loadMoreMessages = useCallback(async () => {
    if (isAddLoading || !nextPage) return;

    try {
      setIsAddLoading(true);
      const endpointUrl = nextPage.replace('limit=5', 'limit=6');
      const data = await get(endpointUrl, '롤링페이퍼 메시지 조회');
      setMessages((prev) => [...prev, ...data.results]);
      setNextPage(data.next);
    } catch (error) {
      console.error('롤링페이퍼 메시지 조회 에러:', error);
      showToast('롤링페이퍼 메시지를 추가로 불러올 수 없습니다.');
    } finally {
      setIsAddLoading(false);
    }
  }, [isAddLoading, nextPage, setMessages, setNextPage, showToast]);

  /**
   * 무한 스크롤 ( Intersection Observer ) 설정
   * * loadMoreRef가 화면에 감지되면 loadMoreMessages 실행
   */
  useEffect(() => {
    const options = {
      /* 
        관찰 기준 요소 지정
        - null ( 기본 값 ): 뷰포트 ( 브라우저 화면 ) 기준 관찰
        - 특정 DOM 요소 지정 시: 그 요소 내부에서만 관찰
          예) const containerRef = useRef(null);
              root: containerRef.current
      */
      root: null,
      /*
        관찰 영역 여백
        - 0px: 요소가 정확히 보일 때 감지
        - 100px: 요소가 보이기 100px 전에 미리 감지
      */
      rootMargin: '0px',
      /*
        콜백 실행 시점 (요소가 얼마나 보여야 하는가)
        - 0.0 ~ 1.0 사이 값
        - 0.5: 관찰 대상 요소가 50% 보일 때 콜백 실행
        - 1.0: 관찰 대상 요소가 100% 보일 때 콜백 실행
      */
      threshold: 0.5,
    };

    /* 
      IntersectionObserver 인스턴스 생성 후 observerRef.current에 할당
      - observerRef는 { current: IntersectionObserver 인스턴스 } 형태
      - entries: observe()로 등록된 관찰 대상 요소들의 배열
      - 콜백 함수: 관찰 대상이 threshold 조건을 만족할 때 실행됨
     */
    observerRef.current = new IntersectionObserver((entries) => {
      // 관찰 대상이 1개뿐이므로 첫 번째 요소만 사용
      const target = entries[0];
      /* 
        추가 데이터 로드 조건:
        - target.isIntersecting: 관찰 대상이 화면에 보임 (threshold 조건 만족)
        - nextPage: 다음 페이지 URL이 존재함
        - !isAddLoading: 현재 로딩 중이 아님
      */
      if (target.isIntersecting && nextPage && !isAddLoading) {
        loadMoreMessages();
      }
    }, options);

    /* 
      관찰 시작
      - loadMoreRef.current (JSX의 <div ref={loadMoreRef}>)를 관찰 대상으로 등록
      - cleanup 함수에서 사용하기 위해 별도 변수에 저장
    */
    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observerRef.current.observe(currentLoadMoreRef);
    }

    /* 
      cleanup 함수 (컴포넌트 언마운트 또는 의존성 변경 시 실행)
      - 관찰 중단하여 메모리 누수 방지
      - 의존성이 변경되면 기존 Observer를 정리하고 새로 생성
    */
    return () => {
      if (currentLoadMoreRef && observerRef.current) {
        observerRef.current.unobserve(currentLoadMoreRef);
      }
    };
    /* 
      의존성 배열:
      - 아래 3가지 값이 변경될 때마다 useEffect 재실행
      - 재실행 과정: cleanup 함수 실행 → 새 Observer 생성 및 관찰 시작
      - 최신 상태값으로 콜백 함수가 동작하도록 보장
    */
  }, [isAddLoading, loadMoreMessages, nextPage]);

  /**
   * 메시지 상세 모달을 여는 이벤트
   */
  const handleClick = (e) => {
    const clickedId = Number(e.currentTarget.id);
    const clickedMessage = messages.find((message) => message.id === clickedId);
    if (clickedMessage) {
      setSelectedMessage(clickedMessage);
      setIsOpen(true);
    }
  };

  /**
   * 메시지 상세 모달을 닫는 이벤트
   */
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 토스트 */}
      {toast.show && <Toast message={toast.message} />}
      <ul className={styles.cardList}>
        {!isEditMode && (
          <li>
            <Card simple simpleId={id} />
          </li>
        )}
        {messages.map((message) => {
          const {
            id: messageId,
            profileImageURL,
            sender,
            relationship,
            content,
            font,
            createdAt,
          } = message;
          return (
            <li key={messageId} id={messageId} onClick={handleClick}>
              <Card
                isEditMode={isEditMode}
                profileImageURL={profileImageURL}
                sender={sender}
                relationship={relationship}
                content={content}
                font={font}
                createdAt={createdAt}
                onMessageDeleteModal={() => onMessageDeleteModal(messageId, sender)}
              />
            </li>
          );
        })}
      </ul>
      {/* 무한 스크롤 트리거 요소 */}
      {nextPage && messages.length > 0 && (
        <div ref={loadMoreRef} className={styles.loadMoreTrigger}>
          {isAddLoading && <Loading />}
        </div>
      )}
      {/* 삭제 확인 모달 호출 */}
      <ConfirmModal
        isOpen={isDeleteMessageOpen}
        onClose={onMessageDeleteModal}
        onConfirm={() => onMessageDelete()}
      >
        <p>
          <span className={styles.deleteSender}>{deleteSender}</span>님의 메시지를{' '}
          <span className={styles.deleteMessage}>삭제</span>하시겠습니까?
        </p>
      </ConfirmModal>
      {/* 메시지 상세보기 모달 */}
      <CardModal isOpen={isOpen} onClose={handleClose} {...selectedMessage} />
    </>
  );
}

export default CardList;
