/**
 * 숫자를 K, M 단위로 포맷팅하는 함수
 *
 * @param {number} count
 * @returns {string | number}
 */
export const formatCount = (count) => {
  if (count === 0) return '0';
  const formatter = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
  return formatter.format(count);
};
