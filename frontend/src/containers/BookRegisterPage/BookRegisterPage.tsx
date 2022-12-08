import { SetStateAction, useRef, useState } from 'react'
import { Button, ButtonGroup, Col, Form, InputGroup, ListGroup, Overlay, Row, ToggleButton } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { BookType, createBook, fetchQueryBooks, fetchQueryTags, selectBook } from '../../store/slices/book/book'
import { createLend, LendType, postImage, selectLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'
import './BookRegisterPage.css'
import Carousel from 'react-bootstrap/Carousel'
import useInterval from '../../utils/useInterval'
import AlertModal from '../../components/AlertModal/AlertModal'

export const maxLendImage = 3

const BookRegisterPage = () => {
  const [bookImage, setBookImage] = useState<File | null>(null)
  const [lendImage, setLendImage] = useState<File[]>([])
  const [lendImageIdx, setLendImageIdx] = useState(0)

  const handleSelect = (selectedIndex: SetStateAction<number>, e: any) => {
    setLendImageIdx(selectedIndex)
  }

  // Book Data
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [brief, setBrief] = useState('')
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])

  // Lend Data
  const [cost, setCost] = useState(0)
  const [info, setInfo] = useState('')
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState<string[]>([])

  const [submitted, setSubmitted] = useState<boolean>(false)
  const [existingBook, setExistingBook] = useState(true)
  const [selectedBook, setSelectedBook] = useState<BookType | null>(null)

  const [show, setShow] = useState<boolean>(false)
  const [header, setHeader] = useState<string>('')
  const [body, setBody] = useState<string | JSX.Element>('')

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)
  const bookState = useSelector(selectBook)

  const [listTarget, setListTarget] = useState<HTMLElement | null>(null)
  const prevTitleInput = useRef<string>('')
  const [listShow, setListShow] = useState<boolean>(false)
  const prevTagInput = useRef<string>('')

  const [tagVisible, setTagVisible] = useState<boolean>(false)

  useInterval(() => {
    if (listTarget === document.activeElement && title !== prevTitleInput.current) {
      if (title) {
        dispatch(fetchQueryBooks({ title }))
      }
      setListShow(Boolean(title))
      prevTitleInput.current = title
    }
    if (listTarget === document.activeElement && tag !== prevTagInput.current) {
      if (tag) {
        dispatch(fetchQueryTags({ name: tag }))
      }
      setListShow(Boolean(tag))
      prevTagInput.current = tag
    }
  }, 200)

  const clickSearchBookHandler = () => {
    setExistingBook(true)
    setTitle('')
    setAuthor('')
    setBrief('')
    setTag('')
    setTags([])
    setBookImage(null)
    setSelectedBook(null)
  }

  const clickNewBookHandler = () => {
    setExistingBook(false)
    setTitle('')
    setAuthor('')
    setBrief('')
    setTag('')
    setTags([])
    setBookImage(null)
    setSelectedBook(null)
  }

  const onClickAutoCompleteHandler = (book: BookType) => {
    console.log(book)
    setSelectedBook(book)
    setTitle(book.title)
    setAuthor(book.author)
    setBrief(book.brief)
    setTags(book.tags)
  }

  const bookImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files) {
      setBookImage(event.target?.files[0])
    }
  }

  const lendImageChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files !== null) {
      if (files.length + lendImage.length > maxLendImage) {
        setHeader('Limit the number of image uploads')
        setBody(`You can only post up to ${maxLendImage} images.`)
        setShow(true)
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

  const clickAddTagHandler = (name: string) => {
    const newTags: string[] = [...tags, name]
    setTags(newTags)
    setTag('')
    setListShow(false)
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
    const validationMessages = ['Book cover image', 'Title', 'Author', 'Brief summary', 'At least one tag', 'At least one image of your book']

    if (!existingBook && validationCheckList.some(val => !val)) {
      const messageBuffer: JSX.Element[] = [<>You should fill in :</>]
      validationCheckList.forEach((val, idx) => {
        if (!val) {
          messageBuffer.push(
            <>
              <br />
              &middot; {validationMessages[idx]}
            </>
          )
        }
      })
      setHeader('Form validation error')
      setBody(<>{messageBuffer.map((elem, idx) => (
        <span key={`validation_${idx}`}>
          {elem}
        </span>
      ))}</>)
      setShow(true)
      return
    }

    if (!existingBook) {
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
    } else if (selectedBook) {
      if (!lendImage.length) {
        setHeader('Form validation error')
        setBody('You should attach at least one image of your book.')
        setShow(true)
        return
      }

      const lendData = {
        book: selectedBook.id,
        book_info: {
          author: selectedBook.author,
          title: selectedBook.title,
          image: selectedBook.image,
          brief: selectedBook.brief,
          tags: selectedBook.tags
        },
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
      setHeader('Form validation error')
      setBody('You should select a book.')
      setShow(true)
    }
  }

  if (submitted) {
    return <Navigate to={`/book${(lendState.selectedLend !== null) ? `/${lendState.selectedLend.id}` : ''}`} />
  } else {
    return (
      <div id='register-page'>
        <br />
        <h1>Register Your Book!</h1>
        <p />
        <div className='book-register'>
          <br />
          <Form>
            <div className='select-input'>
              <h3>Book Data</h3>
              <ButtonGroup>
                <ToggleButton
                  id='radio-1'
                  type='radio'
                  variant='outline-success'
                  name='radio'
                  value={1}
                  checked={existingBook}
                  onChange={() => clickSearchBookHandler()}
                  style={{ zIndex: 0 }}
                >
                  Search Book
                </ToggleButton>
                <ToggleButton
                  id='radio-2'
                  type='radio'
                  variant='outline-success'
                  name='radio'
                  value={2}
                  checked={!existingBook}
                  onChange={() => clickNewBookHandler()}
                  style={{ zIndex: 0 }}
                >
                  Register New Book
                </ToggleButton>
              </ButtonGroup>
            </div>
            {existingBook
              ? <>
                <Form.Group as={Row} className="input-class" id="title-input-form">
                  <Form.Label><h5>Search By Title</h5></Form.Label>
                  <Form.Control
                    autoComplete='off'
                    type='text'
                    onChange={event => setTitle(event.target.value)}
                    value={title}
                    onFocus={event => { setListShow(Boolean(title)); setListTarget(event.currentTarget) }}
                    onBlur={_event => { setListShow(false) }}
                  />
                  <Overlay
                    show={listShow}
                    target={listTarget}
                    placement="top"
                    container={null}
                    containerPadding={0}
                  >
                    <ListGroup style={{ width: (listTarget?.clientWidth ?? 0) / 2 }}>
                      {bookState.books.map((book, idx) => (
                        <ListGroup.Item
                          key={`book_${book.title}_${idx}`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => { onClickAutoCompleteHandler(book); setListShow(false) }}
                        >{book.title}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Overlay>
                </Form.Group>
                {selectedBook
                  ? <div className='input-class'>
                    <div className='book-detail-page'>
                      <div className='image-test'>
                        <img alt='Image Not Found' width={'100%'} src={selectedBook.image} />
                      </div>
                      <div className='book-detail-info'>
                        <h1>{selectedBook.title}</h1>
                        <br />
                        <h5 id='register-page-author'>written by {selectedBook.author}</h5>
                        <hr />
                        <p className='light-text'>{selectedBook.brief}</p>
                        <Button
                          type="button"
                          onClick={() => setTagVisible(val => !val)}
                        >{tagVisible ? 'Close Tags' : 'More Tags'}</Button>
                        <div className='tags-text'>
                          {tagVisible
                            ? selectedBook.tags.map((tag) => ('#' + tag + ' '))
                            : selectedBook.tags.slice(0, 10).map((tag) => ('#' + tag + ' '))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  : null}
              </>
              : <>
                <Form.Group as={Row} className="input-class" id="title-input-form">
                  {bookImage && (
                    <div>
                      <img alt='Image Not Found' width={'250px'} src={URL.createObjectURL(bookImage)} />
                    </div>
                  )}
                  <Form.Label><h5>Upload Book Cover Image</h5></Form.Label>
                  <Form.Control
                    type='file'
                    accept="image/*"
                    onChange={bookImageHandler}
                  />
                </Form.Group>
                <Form.Group as={Row} className="input-class" id="title-input-form">
                  <Form.Label column sm={1} id="title-text"><h5>Title</h5></Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      id='title-input'
                      autoComplete='off'
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
                      autoComplete='off'
                      type="text" placeholder='author'
                      value={author} onChange={event => setAuthor(event.target.value)}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className='input-class' id='brief-summary-input-form'>
                  <Form.Label id='brief-summary-text'><h5>Brief Summary</h5>
                    <br />
                    <br />
                    <div>
                      <Form.Control
                        id='brief-summary-input'
                        autoComplete='off'
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
                        type='text'
                        autoComplete='off'
                        value={tag}
                        onChange={event => setTag(event.target.value)}
                        placeholder='Search Tag'
                        onKeyPress={event => { if (event.key === 'Enter' && tag) clickAddTagHandler(tag) }}
                        onFocus={event => { setListShow(Boolean(tag)); setListTarget(event.currentTarget) }}
                        onBlur={_event => { setListShow(false) }}
                      />
                    </div>
                  </Form.Label>
                  <div className='tags-display'>
                    <Button
                      variant="primary"
                      className='add-button'
                      onClick={() => clickAddTagHandler(tag)}
                      disabled={!tag}
                    >add</Button>
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
                  </div>
                  <Overlay
                    show={listShow}
                    target={listTarget}
                    placement="top"
                    container={null}
                    containerPadding={0}
                  >
                    <ListGroup style={{ width: (listTarget?.clientWidth ?? 0) / 2 }}>
                      {bookState.tags.map((tag, idx) => (
                        <ListGroup.Item
                          key={`tag_${tag.name}_${idx}`}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => { clickAddTagHandler(tag.name) }}
                        >{tag.name}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Overlay>
                </InputGroup>
              </>
            }
            <Form.Group as={Row} className='input-class'>
              <h3>Lend Data</h3>
              <Form.Label><h5>Upload Book Images You Want To Lend</h5></Form.Label>
              {lendImage.length
                ? <div id='lend-image-div'>
                  <Carousel activeIndex={lendImageIdx} onSelect={handleSelect}>
                    {lendImage.map((image, idx) => (
                      <Carousel.Item key={`lendImage_${idx}`}>
                        <img
                          className='lend-image-carousel'
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
                  <Button id='lendimage-delete-button' variant='outline-danger' onClick={() => clickDeleteLendImage()}>delete</Button>
                  <br />
                </div>
                : null}
              <Form.Control
                type='file'
                multiple
                accept="image/*"
                onChange={lendImageChangedHandler}
              />
            </Form.Group>
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
                    type='text'
                    autoComplete='off'
                    value={info}
                    onChange={event => setInfo(event.target.value)}
                  />
                </div>
              </Form.Label>
            </Form.Group>
            <Form.Group as={Row} className='input-class' id='questions-input-form'>
              <Form.Label id='questions-text'>
                <h5>Questions</h5>
                <p>The questions will be answered when the borrowers request for your book.</p>
                <div className='questions-input-button'>
                  <Form.Control
                    id='questions-input'
                    type='text'
                    autoComplete='off'
                    value={question}
                    onChange={event => setQuestion(event.target.value)}
                  />
                </div>
              </Form.Label>
              <div className='questions-display'>
                <Button
                  variant="primary"
                  className='add-button'
                  onClick={() => clickAddQuestionHandler()}
                  disabled={!question}
                >add</Button>
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
        <AlertModal
          header={header}
          body={body}
          show={show}
          hide={() => setShow(false)}
        />
      </div>
    )
  }
}

export default BookRegisterPage
