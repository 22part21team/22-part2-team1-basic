import { useEffect, useState } from 'react';
import { fetchApi } from '@/api/api';
import Card from './Card';
import CardModal from './CardModal';
import styles from './CardList.module.css';

/**
 * 생성된 롤링페이퍼 페이지의 메시지 카드 리스트 컴포넌트
 *
 * @param {number} id - 롤링페이퍼 수신자의 고유 식별 ID
 * @return 추가 버튼 및 롤링페이퍼 메시지 카드 리스트 UI
 */
function CardList({ id }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchRecipientInfo = async () => {
      try {
        const data = await fetchApi(`recipients/${id}/messages`);
        const dataResult = data.results;
        setMessages(dataResult);
      } catch (error) {
        console.error('롤링페이퍼 정보 조회 오류:', error);
      }
    };

    fetchRecipientInfo();
  }, [id]);

  const handleClick = (e) => {
    const clickedId = Number(e.currentTarget.id);
    const clickedMessage = messages.find((message) => message.id === clickedId);
    if (clickedMessage) {
      setSelectedMessage(clickedMessage);
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ul className={styles.cardList}>
        <li>
          <Card simple simpleId={id} />
        </li>
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
      <CardModal isOpen={isOpen} onClose={handleClose} {...selectedMessage} />
    </>
  );
}

export default CardList;
