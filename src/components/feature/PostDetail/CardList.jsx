import Card from './Card';
import styles from './CardList.module.css';

// 더미 리스트
const messages = [
  {
    id: 1,
    sender: '이유마',
    profileImageURL: 'https://picsum.photos/id/100/200/200',
    relationship: '가족',
    content:
      '1년의 한번 생일 정말 축하드립니다. 생일 진심으로 축하드립니다 이날은 애슐리님이 주인공입니다✌️',
    createdAt: '2023-08-14T03:42:11.182394Z',
  },
  {
    id: 2,
    sender: '노을',
    profileImageURL: 'https://picsum.photos/id/200/200/200',
    relationship: '동료',
    content:
      '그동안 함께 업무를 진행하면서 많은 도움을 받았습니다. 바쁜 상황에서도 늘 꼼꼼하게 챙겨주셔서 큰 어려움 없이 일할 수 있었습니다. 같이 일할 수 있어서 좋았고, 이곳에서의 시간이 좋은 경험으로 남을 것 같습니다. 앞으로의 새로운 시작도 응원하겠습니다.',
    createdAt: '2023-09-02T15:27:49.904512Z',
  },
  {
    id: 3,
    sender: '조은솔',
    profileImageURL: 'https://picsum.photos/id/900/200/200',
    relationship: '친구',
    content: '코로나가 또다시 기승을 부리는 요즘이네요. 건강, 체력 모두 조심 또 하세요!',
    createdAt: '2023-09-18T09:11:03.557821Z',
  },
  {
    id: 4,
    sender: '김주연',
    profileImageURL: 'https://picsum.photos/id/400/200/200',
    relationship: '지인',
    content: '각자 자리에서는 달라져도, 한 번쯤은 웃으면서 떠올릴 수 있는 시간이었으면 좋겠습니다.',
    createdAt: '2023-10-05T21:36:58.103774Z',
  },
  {
    id: 5,
    sender: '최민정',
    profileImageURL: 'https://picsum.photos/id/500/200/200',
    relationship: '가족',
    content: '여기서의 경험이 나중에 분명 도움이 될 순간이 올 거라 믿어요.',
    createdAt: '2023-10-19T06:54:26.889341Z',
  },
  {
    id: 6,
    sender: '윤희정',
    profileImageURL: 'https://picsum.photos/id/600/200/200',
    relationship: '동료',
    content:
      '함께 일하면서 크고 작은 일들을 많이 겪었는데, 돌아보면 배운 점이 참 많았던 시간이었습니다. 바쁜 일정 속에서도 항상 책임감 있게 일하시는 모습 덕분에 저도 제 역할을 더 잘 해낼 수 있었던 것 같습니다. 쉽지 않은 순간에도 차분하게 상황을 정리해 주셔서 여러모로 도움이 많이 됐습니다. 그동안 쌓아오신 경험과 노력이라면 어디에서든 충분히 잘 해내실 거라고 생각합니다. 새로운 환경에서도 지금처럼 본인만의 페이스를 잘 유지하시길 바라며, 그동안 정말 고생 많으셨고 진심으로 감사드립니다. 앞으로의 길에도 좋은 일만 가득하시길 응원하겠습니다.',
    createdAt: '2023-11-01T08:05:25.399056Z',
  },
];

/**
 * 생성된 롤링페이퍼 페이지의 메시지 카드 리스트 컴포넌트
 *
 * @return 추가 버튼 및 롤링페이퍼 메시지 카드 리스트 UI
 */
function CardList() {
  return (
    <ul className={styles.cardList}>
      <li>
        <Card simple />
      </li>
      {messages.map((message) => {
        const { id, profileImageURL, sender, relationship, content, createdAt } = message;
        return (
          <li key={id}>
            <Card
              profileImageURL={profileImageURL}
              sender={sender}
              relationship={relationship}
              content={content}
              createdAt={createdAt}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default CardList;
