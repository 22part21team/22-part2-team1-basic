import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './NotFound.module.css';

const NotFound = () => {

  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="60" fill="#FFF0F0"/>
            <circle cx="60" cy="60" r="45" fill="#FF5A5F"/>
            <text
              x="60"
              y="72"
              textAnchor="middle"
              fill="white"
              fontSize="28"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              404
            </text>
          </svg>
        </div>
        
        <h1 className={styles.title}>페이지를 찾을 수 없습니다!</h1>
        <p className={styles.message}>주소가 잘못되었거나 삭제된 페이지입니다.</p>
        
        <div className={styles.buttonGroup}>
          <Button size="Large" onClick={handleGoHome}>
            홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
