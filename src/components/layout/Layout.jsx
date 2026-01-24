import { Outlet } from 'react-router-dom';
import Header from './Header';

function Layout() {
  return (
    <>
      Layout&nbsp;
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
