import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import { Collapse } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel'

import { AppDispatch } from '../../store'
import { deleteLend, fetchLend, selectLend } from '../../store/slices/lend/lend'
import { selectUser, toggleWatch } from '../../store/slices/user/user'
import './BookDetailPage.css'
import AlertModal from '../../components/AlertModal/AlertModal'

const BookDetailPage = () => {
  const [infoVisible, setInfoVisible] = useState<boolean>(false)
  const [tagVisible, setTagVisible] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [header, setHeader] = useState<string>('')
  const [body, setBody] = useState<string>('')

  const id = useParams().id as string
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)

  const [lendImageIdx, setLendImageIdx] = useState(0)

  useEffect(() => {
    dispatch(fetchLend(Number(id)))
  }, [id, dispatch])

  const clickDeleteHandler = async () => {
    await dispatch(deleteLend(Number(id)))
    navigate('/main')
  }

  const clickWatchHandler = async () => {
    const response = await dispatch(toggleWatch({ lend_id: Number(id) }))

    if (response.payload.created) {
      setHeader('Watch success')
      setBody('You have successfully watched this book!')
      setShow(true)
    } else {
      setHeader('Watch canceled')
      setBody('You have successfully canceled the watch!')
      setShow(true)
    }
  }

  return (
    <div className='page'>
      <br />
      <div className='book-detail-page'>
        <div>
          <div className="image-test">
            <img alt='Image Not Found' width={'100%'} src={lendState.selectedLend?.book_info.image} />
          </div>
          <div id='lend-image-div'>
            {lendState.selectedLend?.images?.length
              ? <Carousel
                activeIndex={lendImageIdx}
                onSelect={selectedIndex => setLendImageIdx(selectedIndex)}
                variant='dark'
              >
                {lendState.selectedLend?.images.map((image, idx) => (
                  <Carousel.Item key={`lendImage_${idx}`}>
                    <img
                      className='lend-image-carousel'
                      src={image.image}
                      alt="Image Not Found"
                    />
                    <Carousel.Caption>
                      <p>{idx + 1}/{lendState.selectedLend?.images.length} image</p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
              : null}
          </div>
        </div>
        <div className='book-detail-info'>
          <h1>{lendState.selectedLend?.book_info.title}</h1>
          <h5>written by {lendState.selectedLend?.book_info.author}</h5>
          <p className='light-text'>owned by {lendState.selectedLend?.owner_username}</p>
          <hr />
          <h2>{lendState.selectedLend?.cost} &#x20a9;</h2>
          <br />
          <p className='light-text'>{lendState.selectedLend?.book_info.brief}</p>
          {lendState.selectedLend?.status
            ? <Button active variant='warning' style={{ cursor: 'default' }}>Borrowed</Button>
            : <Button active variant='success' style={{ cursor: 'default' }}>Available</ Button>
          }
          <br />
          <br />
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
          <br />
          <div className='addinfo'>
            <Button variant="outline-primary"
              type="button"
              onClick={() => setInfoVisible(!infoVisible)}
              aria-controls='add-information'
              aria-expanded={infoVisible}
            >Additional Info</Button>
            <br />
            <Collapse in={infoVisible}>
              <div id='add-information' className="info-box" hidden={!infoVisible}>
                {lendState.selectedLend?.additional}
              </div>
            </Collapse>
          </div>
        </div>
      </div>

      <div className='detail-page-bottom'>
        {(userState.currentUser && (userState.currentUser.id === lendState.selectedLend?.owner))
          ? <>
            <Button variant="outline-primary"
              type="button"
              className='detail-page-buttons'
              id="detail-edit-button"
              onClick={() => navigate(`/book/${id}/edit`)}
            >Edit</Button>
            <Button variant="outline-danger"
              type="button"
              className='detail-page-buttons'
              onClick={() => clickDeleteHandler()}
            >Delete</Button>
          </>
          : <>
            <Button variant="outline-primary"
              className='detail-page-buttons'
              id="detail-request-button"
              onClick={() => navigate(`/book/${id}/request`)}
            >Request</Button>
            <Button variant={`${userState.watch_list.find(watch => watch.id === Number(id)) ? '' : 'outline-'}warning`}
              type="button"
              className={'detail-page-buttons'}
              id="detail-watch-button"
              onClick={() => clickWatchHandler()}
            >Watch</Button>
          </>
        }
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

export default BookDetailPage
