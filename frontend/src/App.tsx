import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import MainPage from './containers/MainPage/MainPage';
import BookListPage from './containers/BookListPage/BookListPage';
import BookRegisterPage from './containers/BookRegisterPage/BookRegisterPage';
import BookDetailPage from './containers/BookDetailPage/BookDetailPage';
import BookEditPage from './containers/BookEditPage/BookEditPage';
import BookRequestPage from './containers/BookRequestPage/BookRequestPage';
import ChattingPage from './containers/ChattingPage/ChattingPage';
import './App.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/search/:key" element={<BookListPage />} />
          <Route path="/book/register" element={<BookRegisterPage />} />
          <Route path="/book/:id" element={<BookDetailPage />} />
          <Route path="/book/:id/edit" element={<BookEditPage />} />
          <Route path="/book/:id/request" element={<BookRequestPage />} />
          <Route path="/chat" element={<ChattingPage />} />
          <Route path="" element={<Navigate to="/main" replace />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
