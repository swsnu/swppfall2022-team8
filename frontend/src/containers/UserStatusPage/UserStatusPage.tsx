import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { selectUser } from '../../store/slices/user/user'
import { selectLend, fetchUserLends } from '../../store/slices/lend/lend'
import { selectBorrow, fetchUserBorrows } from '../../store/slices/borrow/borrow'
import BookListEntity from '../../components/BookListEntity/BookListEntity'
import NavBar from '../../components/NavBar/NavBar'

const UserStatusPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const userState = useSelector(selectUser)
  const lendState = useSelector(selectLend)
  const borrowState = useSelector(selectBorrow)

  useEffect(() => {
    if (!userState.currentUser) {
      navigate('/login')
    } else {
      dispatch(fetchUserLends())
      dispatch(fetchUserBorrows())
    }
  }, [navigate, dispatch])
  return (
    <>
      <NavBar />
      <h1>UserStatusPage</h1>
      <br />
      <p>Lend List</p>
      {lendState.userLends.map((lend, idx) => (
        <div key={`mylend_${idx}`}>
          <BookListEntity
            id={lend.id}
            title={lend.book_info.title}
          />
        </div>
      ))}
      <br />
      <p>Borrow List</p>
      {borrowState.userBorrows.map((borrow, idx) => (
        <div key={`myborrow_${idx}`}>
          <BookListEntity
            id={borrow.lend_id}
            title={`lend_id: ${borrow.lend_id}`}
          // TODO: add book info to borrow slice
          />
        </div>
      ))}
      <br />
      <p>Watch List</p>
      {/* TODO: implement Watch List */}
    </>
  )
}

export default UserStatusPage
