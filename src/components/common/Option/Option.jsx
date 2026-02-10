import styles from './Option.module.css';

/**
 * 옵션 선택 컴포넌트
 * 색상이나 이미지 등을 선택할 수 있는 옵션 버튼
 *
 * @param {string} type - 옵션 타입 ("color" | "image")
 * @param {Array} options - 선택 가능한 옵션 배열 (색상명 또는 이미지 URL)
 * @param {string} selected - 현재 선택된 옵션
 * @param {function} onSelect - 옵션 선택 시 호출되는 핸들러 함수
 * @return {JSX.Element} Option 컴포넌트
 */
const Option = ({ type = 'color', options = [], selected, onSelect }) => {
  /**
   * 옵션 클릭 핸들러
   *
   * @param {string} option - 선택된 옵션 값
   */
  const handleOptionClick = (option) => {
    onSelect(option);
  };

  /**
   * 색상명을 CSS 색상 값으로 변환
   *
   * @param {string} colorName - 색상명 ("beige" | "purple" | "blue" | "green")
   * @return {string} CSS 색상 값
   */
  const getColorValue = (colorName) => {
    const colorMap = {
      beige: '#FFE2AD',
      purple: '#ECD9FF',
      blue: '#B1E4FF',
      green: '#D0F5C3',
    };
    return colorMap[colorName] || colorName;
  };

  return (
    <div className={styles.optionContainer}>
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleOptionClick(option)}
          className={`${styles.optionButton} ${selected === option ? styles.selected : ''}`}
          style={
            type === 'color'
              ? { backgroundColor: getColorValue(option) }
              : { backgroundImage: `url(${option})` }
          }
        >
          {selected === option && (
            <div className={styles.checkmark}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.6668 5L7.50016 14.1667L3.3335 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default Option;