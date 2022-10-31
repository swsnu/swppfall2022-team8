import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import ChattingButton from '../../components/ChattingButton/ChattingButton'
import LogoButton from '../../components/LogoButton/LogoButton'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import { AppDispatch } from '../../store'
import { deleteLend, fetchLend, selectLend } from '../../store/slices/lend/lend'
import Button from 'react-bootstrap/Button'
import UserStatusButton from '../../components/UserStatusButton/UserStatusButton'
import LogoutButton from '../../components/LogoutButton/LogoutButton'
import { selectUser } from '../../store/slices/user/user'
import './BookDetailPage.css'

const BookDetailPage = () => {
  const [infoVisible, setInfoVisible] = useState<boolean>(false)

  const id = useParams().id as string
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)

  useEffect(() => {
    dispatch(fetchLend(Number(id)))
  }, [id, dispatch])

  const clickDeleteHandler = async () => {
    await dispatch(deleteLend(Number(id)))
    navigate('/main')
  }

  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <UserStatusButton />
      <LogoutButton />
      <br />
      <h1>BookDetailPage</h1>
      <br />

      {/* TODO: add image field */}
      <div className="image-test"><p>image</p></div>

      <p>Owner: {lendState.selectedLend?.owner}</p>
      <p>Book title: {lendState.selectedLend?.book_info.title}</p>
      <p>Author: {lendState.selectedLend?.book_info.author}</p>
      <p>Brief Summary: {lendState.selectedLend?.book_info.brief}</p>

      <p>Status: {lendState.selectedLend?.status ? 'Borrowed' : 'Available'}</p>
      <p>Borrowing cost: {lendState.selectedLend?.cost}</p>
      <p>tags: {lendState.selectedLend?.book_info.tags.join(', ')}</p>
      <br />
      <Button variant="outline-primary"
        type="button"
        onClick={() => setInfoVisible(!infoVisible)}
      >Info</Button>
      <br />
      <div className="info-box" hidden={!infoVisible}>
        {lendState.selectedLend?.additional}
      </div>

      {/* TODO: implement borrow related feature in sprint3 */}

      {(() => {
        if (userState.currentUser && (userState.currentUser.id === lendState.selectedLend?.owner)) {
          return (
            <>
              <Button variant="outline-primary"
                type="button"
                id="detail-edit-button"
                onClick={() => navigate(`/book/${id}/edit`)}
              >Edit</Button>
              <Button variant="outline-primary"
                type="button"
                onClick={() => clickDeleteHandler()}
              >Delete</Button>
            </>
          )
        } else {
          return (
            <>
              <Button variant="outline-primary"
                id="detail-request-button"
                onClick={() => navigate(`/book/${id}/request`)}
              >Request</Button>
              <Button variant="outline-primary"
                type="button"
                id="detail-watch-button"
                onClick={() => alert('TODO: implement user feature')}
              >Watch</Button>
            </>
          )
        }
      })()}
    </>
  )
}

export default BookDetailPage
