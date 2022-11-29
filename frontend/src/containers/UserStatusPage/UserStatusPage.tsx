import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { fetchRecommend, fetchTags, fetchWatch, selectUser, updateTag } from '../../store/slices/user/user'
import { selectLend, fetchUserLends } from '../../store/slices/lend/lend'
import { selectBorrow, fetchUserBorrows } from '../../store/slices/borrow/borrow'
import BookListEntity from '../../components/BookListEntity/BookListEntity'
import NavBar from '../../components/NavBar/NavBar'
import { Button, Form, InputGroup, Row } from 'react-bootstrap'
import './UserStatusPage.css'

const UserStatusPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const userState = useSelector(selectUser)
  const lendState = useSelector(selectLend)
  const borrowState = useSelector(selectBorrow)

  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>(userState.subscribed_tags)

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

  useEffect(() => {
    return () => {
      if (sessionStorage.getItem('drf-token')) {
        dispatch(fetchRecommend())
      }
    }
  }, [dispatch])

  const clickAddTagHandler = async () => {
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

  return (
    <div className='user-status-page'>
      <NavBar />
      <br />
      <h1>User Info</h1>
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
                />
              </div>
          ))
          : <>
              <h5><br/><br/><br/><br/></h5>
              <h5 className='empty-text'></h5>
            </>
        }
      </div>
      <br />
      <h3>Borrow List</h3>
      <div className='booklist'>
        { borrowList.length
          ? borrowList.map((borrow, idx) => (
            <div key={`myborrow_${idx}`}>
              <BookListEntity
                id={borrow.lend_id}
                image={borrow.image}
                title={borrow.book_title}
              />
            </div>
          ))
          : <>
              <h5 className='empty-text'></h5>
            </>
      }
      </div>
      <br />
      <h3>Watch List</h3>
      <div className='booklist'>
        { userState.watch_list.length
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
      <br />
      <Form>
        <InputGroup as={Row} className='input-class' id='tags-input-form'>
          <Form.Label id='tags-text'>
            <h5>Preference Tag List</h5>
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
      </Form>

    </div>
  )
}

export default UserStatusPage
