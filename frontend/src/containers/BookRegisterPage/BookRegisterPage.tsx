import { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { BookType, createBook } from '../../store/slices/book/book'
import { createLend, selectLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'
import './BookRegisterPage.css'

const BookRegisterPage = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [cost, setCost] = useState(0)
  const [info, setInfo] = useState('')
  const [brief, setBrief] = useState('')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [submitted, setSubmitted] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)

  const clickAddTagHandler = () => {
    const newTags: string[] = [...tags, tag]
    setTags(newTags)
    setTag('')
  }

  const clickAddQuestionHandler = () => {
    const newQuestions: string[] = [...questions, question]
    setQuestions(newQuestions)
    setQuestion('')
  }

  const clickDeleteTagHandler = (index: number) => {
    const newTags = tags.filter((tag, idx) => idx !== index)
    setTags(newTags)
  }

  const clickDeleteQuestionHandler = (index: number) => {
    const newQuestions = questions.filter((_question, idx) => idx !== index)
    setQuestions(newQuestions)
  }

  const clickConfirmRegisterHanler = async () => {
    if (!userState.currentUser) {
      navigate('/login')
      return
    }

    const validationCheckList = [title, author, brief, tags.length]
    const validationMessages = ['title', 'author', 'brief summary', 'at least one tag']

    if (validationCheckList.some(val => !val)) {
      const messageBuffer = ['Should fill in :']
      validationCheckList.forEach((val, idx) => {
        if (!val) {
          messageBuffer.push(validationMessages[idx])
        }
      })
      alert(messageBuffer.join('\n'))
      return
    }

    const bookData = {
      title,
      author,
      tags,
      brief
    }

    const responseBook = await dispatch(createBook(bookData))

    if (responseBook.type === `${createBook.typePrefix}/fulfilled`) {
      const { id } = responseBook.payload as BookType
      const lendData = {
        book: id,
        book_info: bookData,
        owner: userState.currentUser.id,
        owner_username: userState.currentUser.username,
        questions,
        cost,
        additional: info
      }

      const responseLend = await dispatch(createLend(lendData))

      if (responseLend.type === `${createLend.typePrefix}/fulfilled`) {
        setSubmitted(true)
      } else {
        alert('Error on Register a book (lend)')
      }
    } else {
      alert('Error on Register a book (book)')
    }
  }

  if (submitted) {
    return <Navigate to={`/book${(lendState.selectedLend != null) ? `/${lendState.selectedLend.id}` : ''}`} />
  } else {
    return (
      <>
        <div className='nav-bar'>
          <NavBar />
        </div>
        <div className='book-register'>

          <h1>BookRegisterPage</h1>
          <br />

          {/* TODO: add image upload field */}

          <Form>
            <Form.Group as={Row} className="input-class" controlId="title-input-form">
              <Form.Label column sm={1} id="title-text"><h5>Title</h5></Form.Label>
              <Col sm={9}>
                <Form.Control
                  id='title-input'
                  type="text" placeholder="title"
                  value={title} onChange={event => setTitle(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} classname="input-class" controlId="title-input-form">
              <Form.Label coulmn sm={1} id="author-text"><h5>Author</h5></Form.Label>
              <Col sm={9}>
                <Form.Control
                  id='author-input'
                  type="text" placeholder='author'
                  value={author} onChange={event => setAuthor(event.target.value)}
                />
              </Col>
            </Form.Group>
          </Form>
          <br />
          <label>
            Brief summary
            <input type="text" value={brief} onChange={event => setBrief(event.target.value)} />
          </label>
          <br />

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

          <br />
          <br />
          <label>
            borrowing cost
            <input
              type="number"
              min="0"
              step="100"
              value={cost}
              onChange={event => setCost(Number(event.target.value))}
            />
          </label>
          <br />
          <label>
            additional info (optional)
            <input type="text" value={info} onChange={event => setInfo(event.target.value)} />
          </label>
          <br />

          <label>
            questions (optional)
            <input type="text" value={question} onChange={event => setQuestion(event.target.value)} />
            <button
              type="button"
              onClick={() => clickAddQuestionHandler()}
              disabled={!question}
            >add</button>
          </label>
          {questions.map((question, index) => (
            <div key={index}>
              {question}
              <button type="button" onClick={() => clickDeleteQuestionHandler(index)}>x</button>
            </div>
          ))}
          <br />

          <Button type="button" onClick={() => clickConfirmRegisterHanler()}>Register</Button>
        </div>
      </>
    )
  }
}

export default BookRegisterPage
