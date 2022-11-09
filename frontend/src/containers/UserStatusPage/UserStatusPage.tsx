import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { AppDispatch } from '../../store'
import { fetchTags, fetchWatch, selectUser, updateTag } from '../../store/slices/user/user'
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

  useEffect(() => {
    (async () => {
      if (!userState.currentUser) {
        navigate('/login')
      } else {
        await dispatch(fetchUserLends())
        await dispatch(fetchUserBorrows())
        const response = await dispatch(fetchTags())
        if (response.type === `${fetchTags.typePrefix}/fulfilled`) {
          setTags(response.payload)
        }
        await dispatch(fetchWatch())
      }
    })()
  }, [navigate, dispatch])

  const clickAddTagHandler = () => {
    const newTags: string[] = [...tags, tag]
    setTags(newTags)
    dispatch(updateTag({ tag })) // Todo : add alert if 404 here
    setTag('')
  }

  const clickDeleteTagHandler = (index: number) => {
    const newTags = tags.filter((tag, idx) => idx !== index)
    dispatch(updateTag({ tag: tags[index] }))
    setTags(newTags)
  }

  return (
    <>
      <NavBar />
      <h1>User Info</h1>
      <br />
      <p>Lend List</p>
      {lendState.userLends.map((lend, idx) => (
        <div key={`mylend_${idx}`}>
          <BookListEntity
            id={lend.id}
            title={lend.book_info.title}
          />
        </div>
      ))}
      <br />
      <p>Borrow List</p>
      {borrowState.userBorrows.filter((borrow, idx) => borrow.active).map((borrow, idx) => (
        <div key={`myborrow_${idx}`}>
          <BookListEntity
            id={borrow.lend_id}
            title={`lend_id: ${borrow.lend_id}`}
          // TODO: add book info to borrow slice
          />
        </div>
      ))}
      <br />
      <p>Watch List</p>
      {/* TODO: implement Watch List */}
      {userState.watch_list.map((watch, idx) => (
        <div key={`mywatch_${idx}`}>
          <BookListEntity
            id={watch.id}
            title={watch.book_info.title}
            available={watch.status === null}
          />
        </div>
      ))}
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

    </>
  )
}

export default UserStatusPage
