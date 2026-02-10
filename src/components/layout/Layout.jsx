import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * 레이아웃 컴포넌트
 * 모든 페이지에 공통으로 적용되는 레이아웃
 * Header / main영역 / 모달 렌더링을 위한 전용 포탈 루트(modal-root)를 포함
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
      {/* createPortal 모달 전용 DOM */}
      <div id="modal-root"></div>
    </>
  );
}

export default Layout;
