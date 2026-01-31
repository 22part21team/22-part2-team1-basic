const BASE_URL = 'https://rolling-api.vercel.app/22-1';

/**
 * Rolling API 서버와 통신하기 위한 공통 fetch 함수
 *
 * @param {string} endpoint - BASE_URL 이후의 API 엔드포인트 경로
 * @param {Object} [options={}] - fetch API에 전달할 추가 옵션 (method, headers, body 등)
 * @param {string|number} [query=''] - URL 경로에 추가할 쿼리 값
 * @returns {Promise<Object>} 서버로부터 받은 JSON 응답 데이터
 * @throws {Error} 응답이 성공(ok)하지 않을 경우 에러를 발생시킴
 */
export async function fetchApi(endpoint, options = {}, query = '') {
  const res = await fetch(`${BASE_URL}/${endpoint}/${query}`, options);
  const json = await res.json();

  if (!res.ok) {
    throw new Error('데이터를 불러오는데 실패했습니다.');
  }

  return json;
}
