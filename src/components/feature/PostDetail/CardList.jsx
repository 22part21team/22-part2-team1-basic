import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchApi } from '@/api/api';
import Card from './Card';
import CardModal from './CardModal';
import Loading from '@/components/common/Loading/Loading';
import styles from './CardList.module.css';

/**
 * 생성된 롤링페이퍼 페이지의 메시지 카드 리스트 컴포넌트
 * - 일반 모드 : 롤링페이퍼 추가 버튼 + 롤링페이퍼 5개 데이터 구성으로 시작
 * - 편집 모드 : 롤링페이퍼 6개 데이터 구성으로 시작
 *
 * @param {number} id - 롤링페이퍼 수신자의 고유 식별 ID
 * @param {boolean} isEditMode - 편집 모드 활성화 여부
 * @return 추가 버튼 및 롤링페이퍼 메시지 카드 리스트 UI
 */
function CardList({ id, isEditMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [messages, setMessages] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddLoading, setIsAddLoading] = useState(false);

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const fetchRecipientInfo = async () => {
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

    fetchRecipientInfo();
  }, [id, isEditMode]);

  // 추가 데이터 로드 함수
  const loadMoreMessages = useCallback(async () => {
    if (isAddLoading || !nextPage) return;

    try {
      setIsAddLoading(true);
      const res = await fetch(nextPage.replace('limit=5', 'limit=6'));
      const data = await res.json();

      if (!res.ok) {
        throw new Error('데이터를 불러오는데 실패했습니다.');
      }

      setMessages((prev) => [...prev, ...data.results]);
      setNextPage(data.next);
    } catch (error) {
      console.error('롤링페이퍼 정보 조회 오류:', error);
    } finally {
      setIsAddLoading(false);
    }
  }, [isAddLoading, nextPage]);

  // Intersection Observer 설정
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
        - !isLoading: 현재 로딩 중이 아님
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

  // 모달 여는 이벤트
  const handleClick = (e) => {
    const clickedId = Number(e.currentTarget.id);
    const clickedMessage = messages.find((message) => message.id === clickedId);
    if (clickedMessage) {
      setSelectedMessage(clickedMessage);
      setIsOpen(true);
    }
  };

  // 모달 닫는 이벤트
  const handleClose = () => {
    setIsOpen(false);
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
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
      <CardModal isOpen={isOpen} onClose={handleClose} {...selectedMessage} />
    </>
  );
}

export default CardList;
