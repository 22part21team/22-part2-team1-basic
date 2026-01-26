import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * 레이아웃 컴포넌트
 * 모든 페이지에 공통으로 적용되는 레이아웃
 * Header와 main 영역을 포함
 *
 * @return {JSX.Element} Layout 컴포넌트
 */
function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;