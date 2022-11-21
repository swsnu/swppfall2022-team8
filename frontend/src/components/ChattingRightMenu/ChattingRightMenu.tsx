import { useSelector } from 'react-redux'
import { RoomType } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'

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
    <>
      {(() => {
        if (isUserLender) {
          if (props.borrowable) {
            return (
              <button
                type="button"
                onClick={() => props.clickConfirmLendingHandler()}
              >Confirm lending</button>
            )
          } else if (props.borrowed) {
            return (
              <button
                type="button"
                onClick={() => props.clickConfirmReturnHandler()}
              >Confirm return</button>
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

      {props.room.questions.map((question, idx) => (
        <div key={`question_and_answer_${idx + 1}`}>
          <br />
          <h5>Question {idx + 1}. {question}</h5>
          <h5>Answer to question {idx + 1}: {props.room.answers[idx] ?? ''}</h5>
        </div>
      ))}
    </>
  )
}

export default ChattingRightMenu
