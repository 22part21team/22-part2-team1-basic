import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home/Home';
import PostList from '@/pages/PostList/PostList';
import PostCreate from '@/pages/PostCreate/PostCreate';
import PostDetail from '@/pages/PostDetail/PostDetail';
import MessageCreate from '@/pages/MessageCreate/MessageCreate';
import NotFound from '@/pages/NotFound/NotFound';
import Error from '@/pages/Error/Error';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="list" element={<PostList />} />
        <Route path="post">
          <Route index element={<PostCreate />} />
          <Route path=":id">
            <Route index element={<PostDetail />} />
            <Route path="edit" element={<PostDetail />} />
            <Route path="message" element={<MessageCreate />} />
          </Route>
        </Route>
        <Route path="error" element={<Error />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
