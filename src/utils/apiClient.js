/**
 * API 클라이언트 유틸리티
 * fetch 요청을 래핑하여 에러 처리를 일관되게 수행
 */

const API_BASE_URL = 'https://rolling-api.vercel.app/22-1';

/**
 * HTTP 상태 코드에 따른 에러 메시지 반환
 * @param {number} status - HTTP 상태 코드
 * @param {string} context - 에러 컨텍스트 (예: '롤링페이퍼 생성', '메시지 전송')
 * @returns {string} 에러 메시지
 */
export const getErrorMessage = (status, context = '요청') => {
  switch (status) {
    case 400:
      return '잘못된 요청입니다. 입력 내용을 확인해주세요.';
    case 404:
      return context === '롤링페이퍼 조회'
        ? '롤링페이퍼를 찾을 수 없습니다.'
        : '요청하신 데이터를 찾을 수 없습니다.';
    case 409:
      return '이미 존재하는 데이터입니다.';
    case 422:
      return '입력 형식이 올바르지 않습니다.';
    default:
      return `${context} 중 오류가 발생했습니다.`;
  }
};

/**
 * API 요청 수행
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise<Object>} API 응답 데이터
 * @throws {Object} 에러 객체 { status, message, data }
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    // 성공 응답
    if (response.ok) {
      // 204 No Content, 응답에 본문이 없는 경우 바로 return
      if (response.status === 204) return null;

      return await response.json();
    }

    // 에러 응답
    const status = response.status;
    let errorData = {};

    try {
      errorData = await response.json();
    } catch {
      // JSON 파싱 실패 시 빈 객체 유지
    }

    throw {
      status,
      message: errorData.message || getErrorMessage(status, options.context),
      data: errorData,
    };
  } catch (error) {
    // 네트워크 에러
    if (error.status) {
      // 위에서 throw한 에러는 그대로 전달
      throw error;
    }

    // 기타 네트워크 에러
    throw {
      status: null,
      message: '네트워크 연결을 확인해주세요.',
      isNetworkError: true,
      originalError: error,
    };
  }
};

/**
 * GET 요청
 */
export const get = (endpoint, context) => {
  return apiRequest(endpoint, { method: 'GET', context });
};

/**
 * POST 요청
 */
export const post = (endpoint, data, context) => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    context,
  });
};

/**
 * DELETE 요청
 */
export const del = (endpoint, context) => {
  return apiRequest(endpoint, { method: 'DELETE', context });
};
