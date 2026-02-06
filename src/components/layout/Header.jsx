import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom';
import logoMain from '/src/assets/images/common/logo-main.svg';
import styles from './Header.module.css';

/**
 * 공용 헤더 컴포넌트
 * 로고와 조건부 "롤링 페이퍼 만들기" 버튼 포함
 *
 * @return {JSX.Element} Header 컴포넌트
 */
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // / 또는 /list 페이지에서만 "롤링페이퍼 만들기" 버튼 표시
  const showCreateButton = location.pathname === '/' || location.pathname === '/list';
  // /post 또는 /post/{id}/message 페이지에서만 "이전으로" 버튼 표시
  const showPrevButton =
    location.pathname === '/post' || !!matchPath({ path: '/post/:id/message' }, location.pathname);
  // /post 하위 페이지에만 moblieHide 추가
  const isLocation = location.pathname.startsWith('/post');
  const headerClass = isLocation ? `${styles.header} ${styles.mobileHide}` : `${styles.header}`;

  /**
   * 롤링 페이퍼 만들기 버튼 클릭 핸들러
   */
  const handleCreateClick = () => {
    navigate('/post');
  };

  /**
   * 이전으로 버튼 클릭 핸들러
   */
  const handlePrevClick = () => {
    // 외부에서 바로 온 경우, 홈페이지로 이동
    if (window.history.length <= 2) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={headerClass}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <img src={logoMain} alt="Rolling 로고" className={styles.logo} />
        </Link>

        {showCreateButton && (
          <button className={styles.headerButton} onClick={handleCreateClick}>
            롤링 페이퍼 만들기
          </button>
        )}

        {showPrevButton && (
          <button className={styles.headerButton} onClick={handlePrevClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
              width="1em"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span className={styles.headerSpan}>이전으로</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
