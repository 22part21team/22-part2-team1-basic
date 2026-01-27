import { Link, useLocation, useNavigate } from 'react-router-dom';
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

  // / 또는 /list 페이지에서만 버튼 표시
  const showCreateButton = location.pathname === '/' || location.pathname === '/list';

  /**
   * 롤링 페이퍼 만들기 버튼 클릭 핸들러
   */
  const handleCreateClick = () => {
    navigate('/post');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <img src={logoMain} alt="Rolling 로고" className={styles.logo} />
        </Link>

        {showCreateButton && (
          <button className={styles.createButton} onClick={handleCreateClick}>
            롤링 페이퍼 만들기
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;