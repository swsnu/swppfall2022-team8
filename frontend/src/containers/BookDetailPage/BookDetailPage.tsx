import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import { AppDispatch } from '../../store'
import { deleteLend, fetchLend, selectLend } from '../../store/slices/lend/lend'
import Button from 'react-bootstrap/Button'
import { selectUser, toggleWatch } from '../../store/slices/user/user'
import './BookDetailPage.css'
import NavBar from '../../components/NavBar/NavBar'

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

  const clickWatchHandler = async () => {
    const response = await dispatch(toggleWatch({ lend_id: Number(id) }))

    // TODO : Something's wrong... Can alert Success, but can't alert Canceled. Check console
    if (response.payload.created) {
      console.log('success')
      alert('Watch Success!')
    } else {
      console.log('canceled')
      alert('Watch Canceled!')
    }
  }

  return (
    <>
      <NavBar />
      <br />
      <h1>Book Detail Page</h1>
      <br />
      <div className='book-detail-page'>
        {/* TODO: add image field */}
        <div className="image-test">
          image
        </div>
        <div className='book-detail-info'>
          <h1>{lendState.selectedLend?.book_info.title}</h1>
          <h5>written by {lendState.selectedLend?.book_info.author}</h5>
          <p>owned by {lendState.selectedLend?.owner}</p>
          <hr/>
          <h2>{lendState.selectedLend?.cost} &#x20a9;</h2>
          <p>Brief Summary: {lendState.selectedLend?.book_info.brief}</p>
          <p>Status: {lendState.selectedLend?.status ? 'Borrowed' : 'Available'}</p>
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
                    onClick={() => clickWatchHandler()}
                  >Watch</Button>
                </>
              )
            }
          })()}
        </div>
      </div>
    </>
  )
}

export default BookDetailPage
