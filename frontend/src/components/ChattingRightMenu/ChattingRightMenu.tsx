import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchLend, selectLend } from '../../store/slices/lend/lend'
import { RoomType } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'
import BookListEntity from '../BookListEntity/BookListEntity'
import './ChattingRightMenu.css'

export interface IProps {
  room: RoomType
  borrowable: boolean
  borrowed: boolean
  clickConfirmLendingHandler: () => Promise<void>
  clickConfirmReturnHandler: () => Promise<void>
}

const ChattingRightMenu = (props: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const userState = useSelector(selectUser)
  const lendState = useSelector(selectLend)

  const userID = userState.currentUser?.id
  const isUserLender = props.room.lender === userID

  useEffect(() => {
    dispatch(fetchLend(props.room.lend_id))
  })

  return (
    <div id='chatting-right-menu'>
      {lendState.selectedLend
        ? <BookListEntity
          id={lendState.selectedLend.id}
          image={lendState.selectedLend.book_info.image}
          title={lendState.selectedLend.book_info.title}
          owner={lendState.selectedLend.owner_username}
          available={lendState.selectedLend.status === null}
        />
        : null
      }
      <div className='book-detail-info'>
        {props.room.questions.map((question, idx) => (
          <div key={`question_and_answer_${idx + 1}`} className='question-list'>
            {idx ? <br /> : null}
            <h5><b>Q{idx + 1}.</b></h5>
            <h5>{question}</h5>
            <h5><b>A{idx + 1}.</b></h5>
            <h5>{props.room.answers[idx] ?? ''}</h5>
          </div>
        ))}
      </div>
      <div id='chatting-right-button'>
        {(() => {
          if (isUserLender) {
            if (props.borrowable) {
              return (
                <Button
                  variant='outline-primary'
                  type="button"
                  onClick={() => props.clickConfirmLendingHandler()}
                >Confirm lending</Button>
              )
            } else if (props.borrowed) {
              return (
                <Button
                  variant='outline-primary'
                  type="button"
                  onClick={() => props.clickConfirmReturnHandler()}
                >Confirm return</Button>
              )
            } else {
              return <p>You&apos;ve already lent your book to someone!</p>
            }
          } else {
            if (props.borrowable) {
              return <p>You can borrow this book!</p>
            } else if (props.borrowed) {
              return <p>You are borrowing this book now!</p>
            } else {
              return <p>Someone has already borrowed this book...</p>
            }
          }
        })()}
      </div>
    </div>
  )
}

export default ChattingRightMenu
