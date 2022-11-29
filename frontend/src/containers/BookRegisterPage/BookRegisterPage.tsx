import { SetStateAction, useState } from 'react'
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { BookType, createBook } from '../../store/slices/book/book'
import { createLend, LendType, postImage, selectLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'
import './BookRegisterPage.css'
import Carousel from 'react-bootstrap/Carousel'

export const maxLendImage = 3

const BookRegisterPage = () => {
  const [bookImage, setBookImage] = useState<File | null>(null)
  const [lendImage, setLendImage] = useState<File[]>([])
  const [lendImageIdx, setLendImageIdx] = useState(0)

  const handleSelect = (selectedIndex: SetStateAction<number>, e: any) => {
    setLendImageIdx(selectedIndex)
  }

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

  const lendImageChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files !== null) {
      if (files.length + lendImage.length > maxLendImage) {
        alert(`You can only post up to ${maxLendImage} images.`)
      } else {
        setLendImage(lendImage.concat(Array.from(files)))
      }
    }
  }

  const clickDeleteLendImage = () => {
    const newLendImage = lendImage.filter((image, idx) => idx !== lendImageIdx)
    setLendImageIdx(lendImageIdx % (lendImage.length - 1))
    setLendImage(newLendImage)
  }

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

    const validationCheckList = [bookImage, title, author, brief, tags.length, lendImage.length]
    const validationMessages = ['book cover image', 'title', 'author', 'brief summary', 'at least one tag', 'at least one lend image']

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

    const formData = new FormData()
    if (bookImage) {
      formData.append('image', bookImage)
    }
    formData.append('title', title)
    formData.append('author', author)
    tags.forEach(tag => {
      formData.append('tags', tag)
    })
    formData.append('brief', brief)

    const responseBook = await dispatch(createBook(formData))

    if (responseBook.type === `${createBook.typePrefix}/fulfilled`) {
      const { id } = responseBook.payload as BookType
      const bookData = responseBook.payload
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
        const { id } = responseLend.payload as LendType
        lendImage.forEach((image, idx) => {
          dispatch(postImage({ image, id }))
        })

        setSubmitted(true)
      } else {
        alert('Error on Register a book (lend)')
      }
    } else {
      alert('Error on Register a book (book)')
    }
  }

  if (submitted) {
    return <Navigate to={`/book${(lendState.selectedLend !== null) ? `/${lendState.selectedLend.id}` : ''}`} />
  } else {
    return (
      <div id='register-page'>
        <div className='nav-bar'>
          <NavBar />
        </div>
        <p />
        <h1>Register Your Book!</h1>
        <p />
        <div className='book-register'>
          <br />

          {/* TODO: add image upload field */}
          <div>
            <h2>Upload Book Cover Image</h2>
            {bookImage && (
              <div>
                <img alt='Image Not Found' width={'250px'} src={URL.createObjectURL(bookImage)} />
              </div>
            )}
            <br />

            <input
              type='file'
              accept="image/*"
              onChange={(event) => {
                if (event.target?.files) {
                  setBookImage(event.target?.files[0])
                }
              }}
            />
          </div>

          <div>
            <h2>Upload Book Images You Want To Lend</h2>
            {lendImage.length
              ? <div>
                <Carousel activeIndex={lendImageIdx} onSelect={handleSelect}>
                  {lendImage.map((image, idx) => (
                    <Carousel.Item key={`lendImage_${idx}`}>
                      <img
                        src={URL.createObjectURL(image)}
                        width={'100%'}
                        alt="Image Not Found"
                      />
                      <Carousel.Caption>
                        <p>{idx + 1}/{lendImage.length} image</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
                <button onClick={() => clickDeleteLendImage()}>delete</button>
              </div>
              : null}
            <input
              type='file'
              multiple
              accept="image/*"
              onChange={lendImageChangedHandler}
            />
          </div>

          <Form>
            <Form.Group as={Row} className="input-class" id="title-input-form">
              <Form.Label column sm={1} id="title-text"><h5>Title</h5></Form.Label>
              <Col sm={9}>
                <Form.Control
                  id='title-input'
                  type="text" placeholder="title"
                  value={title} onChange={event => setTitle(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='input-class' id="author-input-form">
              <Form.Label column sm={1} id="author-text"><h5>Author</h5></Form.Label>
              <Col>
                <Form.Control
                  id='author-input'
                  type="text" placeholder='author'
                  value={author} onChange={event => setAuthor(event.target.value)}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='input-class' id='brief-summary-input-form'>
              <Form.Label id='brief-summary-text'><h5>Brief Summary</h5>
                <br />
                <h5 id='breif-summary-description'>Write down a brief summary of your book</h5>
                <br />
                <div>
                  <Form.Control
                    id='brief-summary-input'
                    type='text' value={brief}
                    onChange={event => setBrief(event.target.value)}
                  />
                </div>
              </Form.Label>
            </Form.Group>
            <InputGroup as={Row} className='input-class' id='tags-input-form'>
              <Form.Label id='tags-text'>
                <h5>tags</h5>
                <br />
                <br />
                <div className='tags-input-button'>
                  <Form.Control
                    id='tags-input'
                    type='text' value={tag}
                    onChange={event => setTag(event.target.value)}
                  />
                </div>
              </Form.Label>
              <div className='tags-display'>
                {tags.map((tag, index) => (
                  <div key={index} className='display-tag'>
                    <h5 id='tags-display-text'>{tag}</h5>
                    <Button
                      type="button"
                      variant='outline-secondary'
                      onClick={() => clickDeleteTagHandler(index)}
                      className='delete-button'
                    >X</Button>
                  </div>
                ))}
                <Button
                  variant="primary"
                  className='add-button'
                  onClick={() => clickAddTagHandler()}
                  disabled={!tag}
                >add</Button>
              </div>
            </InputGroup>
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
          <Button
            id='register-button'
            type="button"
            onClick={() => clickConfirmRegisterHanler()}>
            Register
          </Button>
        </div>
      </div>
    )
  }
}

export default BookRegisterPage
