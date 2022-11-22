import { useEffect, useState } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { fetchLend, selectLend, updateLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'

import './BookEditPage.css'

const BookEditPage = () => {
  const id = useParams().id as string
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
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
        if (response.payload.owner !== userState.currentUser.id) {
          alert('You can\'t edit other\'s book!')
          navigate('/main')
        }
      } else {
        const surfix = id ? `/${id}` : ''
        navigate(`/book${surfix}`)
      }
    })()
  }, [id, dispatch])

  const [cost, setCost] = useState<number>(lendState.selectedLend?.cost ?? 0)
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState<string[]>(lendState.selectedLend?.questions ?? [])
  const [info, setInfo] = useState(lendState.selectedLend?.additional ?? '')

  const clickAddQuestionHandler = () => {
    const newQuestions: string[] = [...questions, question]
    setQuestions(newQuestions)
    setQuestion('')
  }
  const clickDeleteQuestionHandler = (index: number) => {
    const newQuestions = questions.filter((_question, idx) => idx !== index)
    setQuestions(newQuestions)
  }

  const clickConfirmEditHanler = async () => {
    if (lendState.selectedLend != null) {
      const lendData = new FormData()

      // lendImage.forEach((image, idx) => lendData.append('new_images', image))
      lendData.append('id', String(lendState.selectedLend.id))
      lendData.append('book', String(lendState.selectedLend.book))
      lendData.append('book_info', JSON.stringify(lendState.selectedLend.book_info))
      lendData.append('owner', String(lendState.selectedLend.owner))
      lendData.append('owner_username', lendState.selectedLend.owner_username)
      questions.forEach((question, idx) => lendData.append('questions', question))
      lendData.append('cost', String(cost))
      lendData.append('additional', info)

      await dispatch(updateLend({ lendData, id }))
      navigate(`/book/${lendState.selectedLend.id}`)
    }
  }

  return (
    <>
      <NavBar />
      <h1>Book Edit Page</h1>
      <br />
      <p>You can only edit lend info.</p>
      <div className='book-edit'>
        <div className='book-main-info'>
          <div className="image-test">
            image
          </div>
          <div className='input-class'>
            <div className='book-detail-info'>
              <h1>{lendState.selectedLend?.book_info.title}</h1>
              <br/>
              <h5 id='edit-author'>written by {lendState.selectedLend?.book_info.author}</h5>
              <br/>
              <p/>
              {lendState.selectedLend?.book_info.brief}
              <br/>
              <p/>
              {lendState.selectedLend?.book_info.tags.map((t) => ('#' + t + ' '))}
            </div>
          </div>
        </div>
        <hr id='hr-line' />
        <Form>
          <Form.Group as={Row} className='input-class'>
              <Form.Label>
                <h5>Borrowing Cost :</h5>
                <h5 id='h5-cost'>{cost}</h5>
                <br />
                <br />
                <div id='borrowing-cost-range'>
                  <Form.Range
                    min="0"
                    max="5000"
                    step="100"
                    value={cost}
                    onChange={event => setCost(Number(event.target.value))}
                  />
                </div>
              </Form.Label>
          </Form.Group>
          <Form.Group as={Row} className='input-class' id='additional-info-input-form'>
            <Form.Label id='additional-info-text'><h5>Additional Information (Optional!)</h5>
              <br />
              <br />
              <div>
                <Form.Control
                  as='textarea'
                  id='additional-info-input'
                  type='text' value={info}
                  onChange={event => setInfo(event.target.value)}
                />
              </div>
            </Form.Label>
          </Form.Group>
          <Form.Group as={Row} className='input-class' id='questions-input-form'>
              <Form.Label id='questions-text'>
                <h5>Questions</h5>
                <div className='questions-input-button'>
                  <Form.Control
                    id='questions-input'
                    type='text' value={question}
                    onChange={event => setQuestion(event.target.value)}
                  />
                </div>
              </Form.Label>
                <div className='questions-display'>
                {questions.map((question, index) => (
                  <div key={index} className='display-tag'>
                    <h5 id='questions-display-text'>{question}</h5>
                    <Button
                      type="button"
                      variant='outline-secondary'
                      onClick={() => clickDeleteQuestionHandler(index)}
                      className='delete-button'
                    >X</Button>
                  </div>
                ))}
                <Button
                  variant="primary"
                  className='add-button'
                  onClick={() => clickAddQuestionHandler()}
                  disabled={!question}
                >add</Button>
              </div>
            </Form.Group>
        </Form>
      </div>
      <Button
        id='edit-button'
        type="button" onClick={() => clickConfirmEditHanler()}
      >Edit</Button>
    </>
  )
}

export default BookEditPage
