import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import AuthElement from './components/AuthElement/AuthElement'
import MainPage from './containers/MainPage/MainPage'
import BookListPage from './containers/BookListPage/BookListPage'
import BookRegisterPage from './containers/BookRegisterPage/BookRegisterPage'
import BookDetailPage from './containers/BookDetailPage/BookDetailPage'
import BookEditPage from './containers/BookEditPage/BookEditPage'
import BookRequestPage from './containers/BookRequestPage/BookRequestPage'
import ChattingPage from './containers/ChattingPage/ChattingPage'
import LoginPage from './containers/LoginPage/LoginPage'
import UserStatusPage from './containers/UserStatusPage/UserStatusPage'
import SignupPage from './containers/SignupPage/SignupPage'

import './App.css'

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthElement auth={false} element={<LoginPage />} />} />
          <Route path="/signup" element={<AuthElement auth={false} element={<SignupPage />} />} />
          <Route path="/main" element={<AuthElement auth={true} element={<MainPage />} />} />
          <Route path="/status" element={<AuthElement auth={true} element={<UserStatusPage />} />} />
          <Route path="/search" element={<AuthElement auth={true} element={<BookListPage />} />} />
          <Route path="/book/register" element={<AuthElement auth={true} element={<BookRegisterPage />} />} />
          <Route path="/book/:id" element={<AuthElement auth={true} element={<BookDetailPage />} />} />
          <Route path="/book/:id/edit" element={<AuthElement auth={true} element={<BookEditPage />} />} />
          <Route path="/book/:id/request" element={<AuthElement auth={true} element={<BookRequestPage />} />} />
          <Route path="/chat" element={<AuthElement auth={true} element={<ChattingPage />} />} />
          <Route path="" element={<Navigate to="/main" replace />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
