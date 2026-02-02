import { useEffect, useRef, useState } from 'react';
import styles from './LinkShare.module.css';
import Toast from '@/components/common/Toast/Toast';
import { Outlined } from '@/components/common/Button';
import iconShare from '@/assets/images/common/icon-share.svg';
/**
 * 카카오 공유용 기본 이미지 URL
 * - 카카오톡 공유 시 카드 썸네일로 사용됨
 * - 외부에서 접근 가능한 공개 URL이어야 함 (카카오 서버가 이미지를 가져와 표시)
 * - mud-kage: 카카오 CDN 이미지 호스팅 서비스
 */
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
  const containerRef = useRef(null);  // 컴포넌트 외부 클릭 시 메뉴 닫기

  // 카카오 JavaScript SDK 초기화에 사용할 앱 키
  // - 카카오 개발자 콘솔(https://developers.kakao.com)에서 애플리케이션 생성 후 발급
  // - .env.local에 VITE_KAKAO_JAVASCRIPT_KEY=발급받은키 형태로 설정
  const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

  // 카카오 SDK 초기화 effect
  // - index.html에 로드된 카카오 스크립트(window.Kakao)가 준비된 후 실행
  // - isInitialized() 체크로 중복 초기화 방지 (SDK 권장사항)
  useEffect(() => {
    if (kakaoKey && typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey);
    }
  }, [kakaoKey]);

  // 메뉴 활성화 시, 그 외 화면 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!active) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [active]);

  const handleClick = () => {
    setActive(!active);
  };

  /**
   * 카카오톡 공유 버튼 클릭 핸들러
   * - sendDefault: 기본 피드 템플릿을 사용한 공유 (별도 메시지 템플릿 등록 불필요)
   * - 공유 시 카카오톡 앱 또는 웹으로 공유 팝업이 열림
   */
  const handleKakaoShareClick = () => {
    // Share API 미로드 시: SDK 스크립트 로드 실패 또는 앱 키 미설정
    if (!window.Kakao?.Share) {
      alert('카카오톡 공유를 사용하려면 카카오 개발자 콘솔에서 JavaScript 키를 발급받아 .env.local에 VITE_KAKAO_JAVASCRIPT_KEY를 설정해주세요.');
      setActive(false);
      return;
    }

    // 공유할 페이지 URL (현재 페이지 주소)
    const url = window.location.href;
    // 카드 제목: 수신자 있으면 "To. {이름} 롤링페이퍼", 없으면 "롤링페이퍼"
    const title = recipient?.name ? `To. ${recipient.name} 롤링페이퍼` : '롤링페이퍼';
    // 카드 설명: 메시지 개수 있으면 "N명이 작성했어요!", 없으면 기본 문구
    const description = recipient?.messageCount
      ? `${recipient.messageCount}명이 작성했어요!`
      : '나만의 롤링페이퍼를 확인해보세요.';

    try {
      // sendDefault: 카카오 기본 피드 공유 API (메시지 템플릿 등록 없이 사용 가능)
      window.Kakao.Share.sendDefault({
        objectType: 'feed', // feed: 피드형 공유 (카카오톡 타임라인/채팅에 카드 형태로 표시)
        content: {
          title, // 공유 카드 상단 제목
          description, // 제목 아래 부가 설명
          imageUrl: DEFAULT_SHARE_IMAGE, // 카드 썸네일 이미지 (HTTPS, 외부 접근 가능 URL)
          link: {
            mobileWebUrl: url, // 모바일에서 링크 클릭 시 이동할 URL
            webUrl: url, // PC에서 링크 클릭 시 이동할 URL
          },
        },
        buttons: [
          // 공유 카드 하단에 표시될 버튼 (최대 2개, 선택사항)
          {
            title: '롤링페이퍼 보러가기', // 버튼 텍스트
            link: {
              mobileWebUrl: url,
              webUrl: url,
            },
          },
        ],
      });
      setActive(false); // 공유 시작 후 드롭다운 메뉴 닫기
    } catch (err) {
      console.error('카카오톡 공유 실패:', err); // SDK 오류, 사용자 취소 등
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
    <div ref={containerRef} className={styles.linkShareContainer}>

      <Outlined size="36" className={styles.shareButton} onClick={handleClick}>
        <img src={iconShare} alt="" /> <span className={styles.visuallyHidden}>공유</span>
      </Outlined>
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
