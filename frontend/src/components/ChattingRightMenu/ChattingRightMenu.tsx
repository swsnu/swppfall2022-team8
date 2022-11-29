import { Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { RoomType } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'
import './ChattingRightMenu.css'

export interface IProps {
  room: RoomType
  borrowable: boolean
  borrowed: boolean
  clickConfirmLendingHandler: () => Promise<void>
  clickConfirmReturnHandler: () => Promise<void>
}

const ChattingRightMenu = (props: IProps) => {
  const userState = useSelector(selectUser)

  const userID = userState.currentUser?.id
  const isUserLender = props.room.lender === userID

  return (
    <div id='chatting-right-menu'>

      {props.room.questions.map((question, idx) => (
        <div key={`question_and_answer_${idx + 1}`} className='question-list'>
          <br />
          <h5><b>Question {idx + 1}</b></h5>
          <h5>{question}</h5>
          <h5><b>Answer to question {idx + 1}</b></h5>
          <h5>{props.room.answers[idx] ?? ''}</h5>
        </div>
      ))}
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
