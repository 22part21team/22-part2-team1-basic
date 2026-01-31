import { useEffect, useState } from 'react';
import styles from './LinkShare.module.css';
import Toast from '@/components/common/Toast/Toast';

// 카카오 공유용 기본 이미지 (외부 접근 가능 URL)
const DEFAULT_SHARE_IMAGE =
  'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg';

/**
 * 카카오톡 / URL 공유 드롭다운 컴포넌트
 * - 상태 ( active ) 에 따라 메뉴 노출 및 클래스 토글
 * - 카카오톡 공유 클릭 시 Kakao Talk Share API 호출
 * - URL 공유 클릭 시 클립보드에 URL 복사 후 토스트 표시
 *
 * @param {Object} props
 * @param {Object} [props.recipient] - 수신자 정보 { name, messageCount }
 * @return {JSX.Element} 공유 버튼과 드롭다운 메뉴 ( 카카오톡, URL ) 리스트
 */
function LinkShare({ recipient }) {
  const [active, setActive] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 카카오 JavaScript SDK 초기화에 사용할 앱 키 (.env.local에 설정)
  const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

  // 카카오 SDK가 로드된 후 한 번만 초기화 (중복 초기화 방지)
  useEffect(() => {
    if (kakaoKey && typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  }, [kakaoKey]);

  const handleClick = () => {
    setActive(!active);
  };

  // 카카오톡 공유 버튼 클릭 시 호출 - 기본 피드 템플릿으로 공유
  const handleKakaoShareClick = () => {
    // Share API 미로드 시 안내 (SDK 스크립트 및 앱 키 설정 필요)
    if (!window.Kakao?.Share) {
      alert('카카오톡 공유를 사용하려면 카카오 개발자 콘솔에서 JavaScript 키를 발급받아 .env.local에 VITE_KAKAO_JAVASCRIPT_KEY를 설정해주세요.');
      setActive(false);
      return;
    }

    const url = window.location.href;
    const title = recipient?.name ? `To. ${recipient.name} 롤링페이퍼` : '롤링페이퍼';
    const description = recipient?.messageCount
      ? `${recipient.messageCount}명이 작성했어요!`
      : '나만의 롤링페이퍼를 확인해보세요.';

    try {
      // 카카오 기본 피드 공유 API - 링크 탭에 표시될 메타 정보 전달
      window.Kakao.Share.sendDefault({
        objectType: 'feed', // 피드형 공유 (타임라인/채팅에 표시되는 카드 형태)
        content: {
          title,
          description,
          imageUrl: DEFAULT_SHARE_IMAGE, // 카드 썸네일 (외부 접근 가능 URL 필수)
          link: {
            mobileWebUrl: url, // 모바일 웹 링크
            webUrl: url, // PC 웹 링크
          },
        },
        buttons: [
          // 공유 카드 하단 '보러가기' 버튼
          {
            title: '롤링페이퍼 보러가기',
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
      setActive(false);
    } catch (err) {
      console.error('카카오톡 공유 실패:', err);
      alert('카카오톡 공유에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleUrlShareClick = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setActive(false);
      setShowToast(true);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  // active : true 드롭다운 메뉴 활성화 / false 드롭다운 메뉴 비활성화
  const linkMenuClass = active ? `${styles.linkMenu} ${styles.active}` : `${styles.linkMenu}`;

  return (
    <div className={styles.linkShareContainer}>
      <button
        style={{ width: '36px', height: '32px', border: '1px solid gray' }}
        onClick={handleClick}
      >
        공유
      </button>
      <ul className={linkMenuClass}>
        <li>
          <button type="button" className={styles.linkMenuButton} onClick={handleKakaoShareClick}>
            카카오톡 공유
          </button>
        </li>
        <li>
          <button type="button" className={styles.linkMenuButton} onClick={handleUrlShareClick}>
            URL 공유
          </button>
        </li>
      </ul>
      {showToast && <Toast onClose={handleCloseToast} />}
    </div>
  );
}

export default LinkShare;
