/**
 * ISO 8601 형식의 날짜 문자열을 'YYYY.MM.DD' 형식으로 변환하는 함수
 *
 * @param {string} dateString - 변환할 날짜 문자열 (예: '2024-03-27T12:00:00Z')
 * @returns {string} 'YYYY.MM.DD' 형태로 포맷팅된 날짜
 * @example formatDate('2024-03-27T10:00:00') // '2024.03.27'
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}
