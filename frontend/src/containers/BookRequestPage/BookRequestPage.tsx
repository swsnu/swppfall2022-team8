import { useEffect, useState } from 'react'
import { Button, Card, Form } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { fetchLend, selectLend } from '../../store/slices/lend/lend'
import { createRoom } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'

import './BookRequestPage.css'

const BookRequestPage = () => {
  const [answers, setAnswers] = useState<string[]>([])

  const id = useParams().id as string
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)

  useEffect(() => {
    (async () => {
      if (!userState.currentUser) {
        navigate('/login')
        return
      }

      const response = await dispatch(fetchLend(Number(id)))

      if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
        if (response.payload.owner === userState.currentUser.id) {
          alert('You can\'t borrow your book!')
          navigate('/main')
        }
      } else {
        alert('Error on fetch lend')
        const surfix = id ? `/${id}` : ''
        navigate(`/book${surfix}`)
      }
    })()
  }, [id, dispatch])

  const clickSendButtonHandler = async () => {
    if (lendState.selectedLend == null) {
      return
    }

    const { questions } = lendState.selectedLend
    if (questions.length !== answers.length || answers.some(val => !val)) {
      alert('You should fill in all answers.')
      return
    }

    const response = await dispatch(createRoom({ lend_id: Number(id), answers }))

    if (response.type === `${createRoom.typePrefix}/fulfilled`) {
      navigate('/chat')
    } else {
      alert('You cannot request same book twice.')
    }
  }

  const changeAnswerHandler = (idx: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[idx] = value
    setAnswers([...newAnswers])
  }

  return (
    <div className='page'>
      <NavBar />
      <br />
      <div id='request-page'>
        <div>
          <Card
            style={{ width: '18rem' }}
            onClick={() => navigate(`/book/${(lendState.selectedLend !== null) ? lendState.selectedLend.id : ''}`)}
            className='book-list-entity'
          >
            <Card.Img variant='top' src={lendState.selectedLend?.book_info.image} className='book-entity-image' />
            <Card.Body>
              <Card.Title>{(lendState.selectedLend != null) ? lendState.selectedLend.book_info.title : ''}</Card.Title>
            </Card.Body>
          </Card>
        </div>
        <Form id='request-form'>
          <h5>Questions and answers will be sent to the lender.</h5>
          <br />
          {(lendState.selectedLend != null)
            ? lendState.selectedLend.questions.map((question, idx) => (
              <Form.Group key={`question_${idx}`}>
                <Form.Label id={`request-question-${idx}`} className='request-question'>Question {idx + 1}: {question}</Form.Label>
                <br />
                <br />
                <Form.Control
                  value={answers[idx] ?? ''}
                  type='text'
                  autoComplete='off'
                  placeholder='answer to the question...'
                  onChange={event => changeAnswerHandler(idx, event.target.value)}
                />
                <br />
              </Form.Group>
            ))
            : null}
          <br />
          <Button
            onClick={() => clickSendButtonHandler()}
            variant='outline-primary'
            id='request-send-button'
          >Send to lender</Button>
        </Form>
      </div>
    </div>
  )
}

export default BookRequestPage
