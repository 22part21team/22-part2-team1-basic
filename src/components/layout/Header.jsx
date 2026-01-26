import { Link } from 'react-router-dom';
import logoMain from '/src/assets/images/common/logo-main.svg';
import styles from './Header.module.css';

/**
 * 공용 헤더 컴포넌트
 * 로고만 포함
 *
 * @return {JSX.Element} Header 컴포넌트
 */
const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <img src={logoMain} alt="Rolling 로고" className={styles.logo} />
        </Link>
      </div>
    </header>
  );
};

export default Header;