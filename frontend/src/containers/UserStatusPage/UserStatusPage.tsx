import { useEffect, useState } from 'react'
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

  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([]) // TODO : Should use User's tags as initial state

  useEffect(() => {
    if (!userState.currentUser) {
      navigate('/login')
    } else {
      dispatch(fetchUserLends())
      dispatch(fetchUserBorrows())
      // dispatch(fetchUserTags()) // TODO : Should fetch user tags
    }
  }, [navigate, dispatch])

  const clickAddTagHandler = () => {
    const newTags: string[] = [...tags, tag]
    setTags(newTags)
    // dispatch(postUserTag({name: tag})) // TODO
    setTag('')
  }

  const clickDeleteTagHandler = (index: number) => {
    const newTags = tags.filter((tag, idx) => idx !== index)
    // dispatch(deleteUserTag({name: tags[index]})) // TODO
    setTags(newTags)
  }

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

      <br />
      <p>Preference Tag List</p>
      <label>
        tags
        <input type="text" value={tag} onChange={event => setTag(event.target.value)} />
        <button
          type="button"
          onClick={() => clickAddTagHandler()}
          disabled={!tag}
        >add</button>
      </label>
      {tags.map((tag, index) => (
        <div key={index}>
          {tag}
          <button type="button" onClick={() => clickDeleteTagHandler(index)}>x</button>
        </div>
      ))}
    </>
  )
}

export default UserStatusPage
