const BASE_URL = 'https://rolling-api.vercel.app/22-1';

export async function fetchApi(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}/${endpoint}/`, options);
  const json = await res.json();

  if (!res.ok) {
    throw new Error('데이터를 불러오는데 실패했습니다.');
  }

  return json;
}
