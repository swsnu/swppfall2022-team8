import { useEffect, useState } from 'react'
import { Button, Form, Row } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { AppDispatch } from '../../store'
import { deleteImage, fetchLend, postImage, selectLend, updateLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'
import Carousel from 'react-bootstrap/Carousel'

import './BookEditPage.css'
import { maxLendImage } from '../BookRegisterPage/BookRegisterPage'
import AlertModal from '../../components/AlertModal/AlertModal'

const BookEditPage = () => {
  const [show, setShow] = useState<boolean>(false)

  const id = useParams().id as string
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)
  const [tagVisible, setTagVisible] = useState<boolean>(false)

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

  const [deletedImages, setDeletedImages] = useState<number[]>([])
  const [oldImages, setOldImages] = useState(lendState.selectedLend?.images ?? [])
  const [newImages, setNewImages] = useState<File[]>([])
  const [lendImageIdx, setLendImageIdx] = useState(0)
  const handleSelect = (selectedIndex: number, e: any) => {
    setLendImageIdx(selectedIndex)
  }

  const clickAddQuestionHandler = () => {
    const newQuestions: string[] = [...questions, question]
    setQuestions(newQuestions)
    setQuestion('')
  }
  const clickDeleteQuestionHandler = (index: number) => {
    const newQuestions = questions.filter((_question, idx) => idx !== index)
    setQuestions(newQuestions)
  }

  const lendImageChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files !== null) {
      if (files.length + oldImages.length + newImages.length > maxLendImage) {
        setShow(true)
      } else {
        setNewImages(newImages.concat(Array.from(files)))
      }
    }
  }

  const onOldDeleteHandler = (imageId: number) => {
    setDeletedImages([...deletedImages, imageId])
    const newOldImages = oldImages.filter(image => image.id !== imageId)
    setOldImages(newOldImages)
  }

  const onNewDeleteHandler = (id: number) => {
    const newNewImages = newImages.filter((image, idx) => idx !== id)
    setLendImageIdx(lendImageIdx % (oldImages.length + newImages.length - 1))
    setNewImages(newNewImages)
  }

  const clickConfirmEditHanler = async () => {
    if (lendState.selectedLend != null) {
      const lendData = {
        id: lendState.selectedLend.id,
        book: lendState.selectedLend.book,
        book_info: lendState.selectedLend.book_info,
        owner: lendState.selectedLend.owner,
        owner_username: lendState.selectedLend.owner_username,
        questions,
        cost,
        additional: info
      }

      const response = await dispatch(updateLend(lendData))

      if (response.type === `${updateLend.typePrefix}/fulfilled`) {
        deletedImages.forEach(imageId => {
          dispatch(deleteImage({ image_id: imageId }))
        })
        newImages.forEach((image, idx) => {
          dispatch(postImage({ image, id: lendData.id }))
        })
      }
      navigate(`/book/${lendState.selectedLend.id}`)
    }
  }

  return (
    <div className='page'>
      <br />
      <div className='book-edit'>
        <div className='book-main-info'>
          <div className="image-test">
            <img alt='Image Not Found' width={'100%'} src={lendState.selectedLend?.book_info.image} />
          </div>
          <div className='input-class'>
            <div className='book-detail-info'>
              <h1>{lendState.selectedLend?.book_info.title}</h1>
              <br />
              <h5 id='edit-author'>written by {lendState.selectedLend?.book_info.author}</h5>
              <br />
              <p />
              {lendState.selectedLend?.book_info.brief}
              <br />
              <p />
              <div>
                <Button
                  type="button"
                  onClick={() => setTagVisible(val => !val)}
                >{tagVisible ? 'Close Tags' : 'More Tags'}</Button>
                <br />
                <div className='info-box'>
                  {tagVisible
                    ? lendState.selectedLend?.book_info.tags.map((tag) => ('#' + tag + ' '))
                    : lendState.selectedLend?.book_info.tags.slice(0, 10).map((tag) => ('#' + tag + ' '))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr id='hr-line' />

        <div>
          {oldImages.length > 0 || newImages.length > 0
            ? <Carousel
              activeIndex={lendImageIdx}
              onSelect={handleSelect}
              variant="dark"
              id='edit-images'
            > {oldImages.map((image, idx) => (
              <Carousel.Item key={`lendImage_${idx}`}>
                <img
                  className='lend-image-carousel'
                  src={image.image}
                  width={'100%'}
                  alt="Image Not Found"
                />
                <Carousel.Caption>
                  <Button
                    variant='danger'
                    onClick={() => onOldDeleteHandler(image.id)}
                  >x</Button>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
              {newImages.map((image, idx) => (
                <Carousel.Item key={`lendImage_${idx}`}>
                  <img
                    className='lend-image-carousel'
                    src={URL.createObjectURL(image)}
                    width={'100%'}
                    alt="Image Not Found"
                  />
                  <Carousel.Caption>
                    <Button
                      variant='danger'
                      onClick={() => onNewDeleteHandler(idx)}
                    >x
                    </Button>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
            : null}
        </div>

        <Form>
          <Form.Group as={Row} className='input-class'>
            <Form.Control
              type='file'
              accept='image/*'
              onChange={lendImageChangedHandler}
            />
            <br />
            <Form.Label>
              <br />
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
      <br />
      <Button
        id='edit-button'
        type="button" onClick={() => clickConfirmEditHanler()}
      >Edit</Button>
      <AlertModal
        header={'Limit the number of image uploads'}
        body={`You can only post up to ${maxLendImage} images.`}
        show={show}
        hide={() => setShow(false)}
      />
    </div>
  )
}

export default BookEditPage
