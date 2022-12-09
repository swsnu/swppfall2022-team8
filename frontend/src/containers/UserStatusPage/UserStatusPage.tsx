import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { fetchRecommend, fetchTags, fetchWatch, selectUser, updateTag } from '../../store/slices/user/user'
import { selectLend, fetchUserLends } from '../../store/slices/lend/lend'
import { selectBorrow, fetchUserBorrows } from '../../store/slices/borrow/borrow'
import BookListEntity from '../../components/BookListEntity/BookListEntity'
import { Button, Form, InputGroup, ListGroup, Overlay, Row } from 'react-bootstrap'
import './UserStatusPage.css'
import PageButton from '../../components/PageButton/PageButton'
import useInterval from '../../utils/useInterval'
import { fetchQueryTags, selectBook } from '../../store/slices/book/book'

const UserStatusPage = () => {
  const [lendPage, setLendPage] = useState<number>(1)
  const [borrowPage, setBorrowPage] = useState<number>(1)
  const [watchPage, setWatchPage] = useState<number>(1)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const userState = useSelector(selectUser)
  const bookState = useSelector(selectBook)
  const lendState = useSelector(selectLend)
  const borrowState = useSelector(selectBorrow)

  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>(userState.subscribed_tags)
  const [listShow, setListShow] = useState<boolean>(false)
  const [listTarget, setListTarget] = useState<HTMLElement | null>(null)
  const prevTagInput = useRef<string>('')

  const borrowList = borrowState.userBorrows.filter((borrow, idx) => borrow.active)

  useEffect(() => {
    if (!userState.currentUser) {
      navigate('/login')
    } else {
      (async () => {
        const response = await dispatch(fetchTags())
        if (response.type === `${fetchTags.typePrefix}/fulfilled`) {
          setTags(response.payload)
        } else {
          alert('Error on fetch tags')
        }
      })()
      dispatch(fetchUserLends())
      dispatch(fetchUserBorrows())
      dispatch(fetchWatch())
    }
  }, [navigate, dispatch])

  useInterval(() => {
    if (listTarget === document.activeElement && tag !== prevTagInput.current) {
      if (tag) {
        dispatch(fetchQueryTags({ name: tag }))
      }
      setListShow(Boolean(tag))
      prevTagInput.current = tag
    }
  }, 200)

  useEffect(() => {
    return () => {
      if (sessionStorage.getItem('drf-token')) {
        dispatch(fetchRecommend())
      }
    }
  }, [dispatch])

  const clickAddTagHandler = async () => {
    if (tags.find(val => val === tag)) {
      setTag('')
      return
    }
    const newTags: string[] = [...tags, tag]
    const response = await dispatch(updateTag({ tag }))
    if (response.type === `${updateTag.typePrefix}/fulfilled`) {
      setTags(newTags)
      setTag('')
    } else {
      alert('Error on add tag')
    }
  }

  const clickDeleteTagHandler = async (index: number) => {
    const newTags = tags.filter((_tag, idx) => idx !== index)
    const response = await dispatch(updateTag({ tag: tags[index] }))
    if (response.type === `${updateTag.typePrefix}/fulfilled`) {
      setTags(newTags)
    } else {
      alert('Error on delete tag')
    }
  }

  const lendPageClickHandler = (page: number) => {
    dispatch(fetchUserLends({ page }))
    setLendPage(page)
  }

  const borrowPageClickHandler = (page: number) => {
    dispatch(fetchUserBorrows({ page }))
    setBorrowPage(page)
  }

  const watchPageClickHandler = (page: number) => {
    dispatch(fetchWatch({ page }))
    setWatchPage(page)
  }

  return (
    <div className='page'>
      <br />
      <h1>{`${userState.currentUser?.username ?? ''}'s User Info`}</h1>
      <br />
      <br />
      <h3>Lend List</h3>
      <div className='booklist'>
        {lendState.userLends.length
          ? lendState.userLends.map((lend, idx) => (
            <div key={`mylend_${idx}`}>
              <BookListEntity
                id={lend.id}
                image={lend.book_info.image}
                title={lend.book_info.title}
                available={lend.status === null}
              />
            </div>
          ))
          : <>
            <h5><br /><br /><br /><br /></h5>
            <h5 className='empty-text'></h5>
          </>
        }
      </div>
      <div>
        <div className='page-button'>
          <PageButton
            currPage={lendPage}
            numPage={Math.ceil(lendState.count / 12)}
            handleClick={lendPageClickHandler}
          />
        </div>
      </div>
      <br />
      <h3>Borrow List</h3>
      <div className='booklist'>
        {borrowList.length
          ? borrowList.map((borrow, idx) => (
            <div key={`myborrow_${idx}`}>
              <BookListEntity
                id={borrow.lend_id}
                image={borrow.image}
                title={borrow.book_title}
                available={false}
              />
            </div>
          ))
          : <>
            <h5 className='empty-text'></h5>
          </>
        }
      </div>
      <div>
        <div className='page-button'>
          <PageButton
            currPage={borrowPage}
            numPage={Math.ceil(borrowState.count / 12)}
            handleClick={borrowPageClickHandler}
          />
        </div>
      </div>
      <br />
      <h3>Watch List</h3>
      <div className='booklist'>
        {userState.watch_list.length
          ? userState.watch_list.map((watch, idx) => (
            <div key={`mywatch_${idx}`}>
              <BookListEntity
                id={watch.id}
                image={watch.book_info.image}
                title={watch.book_info.title}
                available={watch.status === null}
              />
            </div>
          ))
          : <>
            <h5 className='empty-text'></h5>
          </>
        }
      </div>
      <div>
        <div className='page-button'>
          <PageButton
            currPage={watchPage}
            numPage={Math.ceil(userState.count / 12)}
            handleClick={watchPageClickHandler}
          />
        </div>
      </div>
      <br />
      <Form>
        <InputGroup as={Row} className='input-class' id='tags-input-form'>
          <Form.Label id='tags-text'>
            <h5>Preference Tag List</h5>
            <div className='tags-input-button'>
              <Form.Control
                id='tags-input'
                type='text'
                autoComplete='off'
                value={tag}
                onChange={event => setTag(event.target.value)}
                onKeyPress={event => { if (event.key === 'Enter' && tag) { event.preventDefault(); clickAddTagHandler() } }}
                onFocus={event => { setListShow(Boolean(tag)); setListTarget(event.currentTarget) }}
                onBlur={_event => { setListShow(false) }}
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
                  onClick={() => { setTag(tag.name); setListShow(false) }}
                >{tag.name}</ListGroup.Item>
              ))}
            </ListGroup>
          </Overlay>
        </InputGroup>
      </Form>

    </div>
  )
}

export default UserStatusPage
