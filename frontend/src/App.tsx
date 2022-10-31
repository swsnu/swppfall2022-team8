import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import MainPage from './containers/MainPage/MainPage'
import BookListPage from './containers/BookListPage/BookListPage'
import BookRegisterPage from './containers/BookRegisterPage/BookRegisterPage'
import BookDetailPage from './containers/BookDetailPage/BookDetailPage'
import BookEditPage from './containers/BookEditPage/BookEditPage'
import BookRequestPage from './containers/BookRequestPage/BookRequestPage'
import ChattingPage from './containers/ChattingPage/ChattingPage'
import './App.css'
import LoginPage from './containers/LoginPage/LoginPage'
import UserStatusPage from './containers/UserStatusPage/UserStatusPage'
import SignupPage from './containers/SignupPage/SignupPage'
import { selectUser } from './store/slices/user/user'
import { useSelector } from 'react-redux'

const App = () => {
  const userState = useSelector(selectUser)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {(() => {
            if (userState.currentUser) { // Logged-in user
              return (
                <>
                  <Route path="/login" element={<Navigate to="/main" replace />} />
                  <Route path="/signup" element={<Navigate to="/main" replace />} />
                  <Route path="/main" element={<MainPage />} />
                  <Route path="/status" element={<UserStatusPage />} />
                  <Route path="/search/:key" element={<BookListPage />} />
                  <Route path="/book/register" element={<BookRegisterPage />} />
                  <Route path="/book/:id" element={<BookDetailPage />} />
                  <Route path="/book/:id/edit" element={<BookEditPage />} />
                  <Route path="/book/:id/request" element={<BookRequestPage />} />
                  <Route path="/chat" element={<ChattingPage />} />
                  <Route path="" element={<Navigate to="/main" replace />} />
                  <Route path="*" element={<h1>404 Not Found</h1>} />
                </>
              )
            } else { // Anonymous user
              return (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/main" element={<Navigate to="/login" replace />} />
                  <Route path="/status" element={<Navigate to="/login" replace />} />
                  <Route path="/search/:key" element={<Navigate to="/login" replace />} />
                  <Route path="/book/register" element={<Navigate to="/login" replace />} />
                  <Route path="/book/:id" element={<Navigate to="/login" replace />} />
                  <Route path="/book/:id/edit" element={<Navigate to="/login" replace />} />
                  <Route path="/book/:id/request" element={<Navigate to="/login" replace />} />
                  <Route path="/chat" element={<Navigate to="/login" replace />} />
                  <Route path="" element={<Navigate to="/login" replace />} />
                  <Route path="*" element={<h1>404 Not Found</h1>} />
                </>
              )
            }
          })()}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
