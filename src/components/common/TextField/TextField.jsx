import { useState } from 'react';
import styles from './TextField.module.css';

/**
 * 텍스트 입력 필드 컴포넌트
 * 라벨, 에러 메시지, placeholder를 지원하는 재사용 가능한 Input 컴포넌트
 *
 * @param {string} label - Input 필드 위에 표시될 라벨 텍스트
 * @param {string} name - Input 필드의 name 속성
 * @param {string} value - Input 필드의 현재 값
 * @param {function} onChange - Input 값 변경 시 호출되는 핸들러 함수
 * @param {function} onBlur - Input focus out 시 호출되는 핸들러 함수
 * @param {string} placeholder - Input 필드의 placeholder 텍스트
 * @param {string} error - 에러 메시지 (있을 경우 에러 상태로 표시)
 * @return {JSX.Element} TextField 컴포넌트
 */
const TextField = ({ label, name, value, onChange, onBlur, placeholder = '', error = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Input 포커스 시 상태 업데이트
   */
  const handleFocus = () => {
    setIsFocused(true);
  };

  /**
   * Input 포커스 아웃 시 상태 업데이트 및 부모 onBlur 호출
   */
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <div className={styles.fieldContainer}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.error : ''} ${
          isFocused ? styles.focused : ''
        }`}
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default TextField;