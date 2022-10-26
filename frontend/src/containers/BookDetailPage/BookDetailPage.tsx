import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import ChattingButton from '../../components/ChattingButton/ChattingButton'
import LogoButton from '../../components/LogoButton/LogoButton'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import { AppDispatch } from '../../store'
import { deleteLend, fetchLend, selectLend } from '../../store/slices/lend/lend'
import './BookDetailPage.css'

const BookDetailPage = () => {
  const [infoVisible, setInfoVisible] = useState<boolean>(false)

  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const lendState = useSelector(selectLend)

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
      <br/>
      <h1>BookDetailPage</h1>
      <br/>

      {/* TODO: add image field */}
      <div className="image-test"><p>image</p></div>

      <p>Owner: {lendState.selectedLend?.owner}</p>
      <p>Book title: {lendState.selectedLend?.book_info.title}</p>
      <p>Author: {lendState.selectedLend?.book_info.author}</p>
      <p>Brief Summary: {lendState.selectedLend?.book_info.brief}</p>

      <p>Status: {lendState.selectedLend?.status ? 'Borrowed' : 'Available'}</p>
      <p>Borrowing cost: {lendState.selectedLend?.cost}</p>
      <br/>
      <button
        type="button"
        onClick={() => setInfoVisible(!infoVisible)}
      >Info</button>
      <br/>
      <div className="info-box" hidden={!infoVisible}>
        {lendState.selectedLend?.additional}
      </div>

      {/* TODO: implement borrow related feature in sprint3 */}

      <button
        type="button"
        onClick={() => navigate(`/book/${id}/request`)}
      >Request</button>
      <button
        type="button"
        onClick={() => alert('TODO: implement user feature')}>Watch</button>
      <br/>
      <button
        type="button"
        onClick={() => navigate(`/book/${id}/edit`)}
      >Edit</button>
      <button
        type="button"
        onClick={async () => await clickDeleteHandler()}
      >Delete</button>
    </>
  )
}

export default BookDetailPage
