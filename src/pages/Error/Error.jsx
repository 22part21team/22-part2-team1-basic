import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import styles from './Error.module.css';

/**
 * 에러 페이지 컴포넌트
 * 서버 에러나 네트워크 에러 발생 시 표시
 * 
 * @return {JSX.Element} Error 페이지 컴포넌트
 */
const Error = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // location.state에서 에러 정보 가져오기
  const errorMessage = location.state?.message || '오류가 발생했습니다.';
  const errorType = location.state?.type || 'unknown';

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    navigate(-1);
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
            <path 
              d="M60 35V65M60 75V80" 
              stroke="white" 
              strokeWidth="6" 
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <h1 className={styles.title}>문제가 발생했습니다</h1>
        <p className={styles.message}>{errorMessage}</p>
        
        {errorType === 'network' && (
          <p className={styles.description}>
            네트워크 연결을 확인하고 다시 시도해주세요.
          </p>
        )}
        
        {errorType === 'server' && (
          <p className={styles.description}>
            서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
          </p>
        )}
        
        <div className={styles.buttonGroup}>
          <Button size="Large" onClick={handleGoBack}>
            이전 페이지로
          </Button>
          <Button size="Large" onClick={handleGoHome}>
            홈으로 가기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;
