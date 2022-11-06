import { useSelector } from 'react-redux'
import { ChatType, SelectedChatGroup } from '../../containers/ChattingPage/ChattingPage'
import { selectRoom } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'

interface IProps {
  group: SelectedChatGroup
  chatIdx: number
  chatList: ChatType[]
  chatInput: string
  changeChatInput: (str: string) => void
  clickSendChatHandler: () => void
}

const ChattingRoom = (props: IProps) => {
  const userState = useSelector(selectUser)
  const roomState = useSelector(selectRoom)

  const userID = userState.currentUser?.id

  return (
    <>
      {(() => {
        if (props.group === 'lend') {
          return <p>Chatting with {roomState.rooms_lend[props.chatIdx].borrower_username}</p>
        } else {
          return <p>Chatting with {roomState.rooms_borrow[props.chatIdx].lender_username}</p>
        }
      })()}
      <div id="chat-box">
        {props.chatList.map(chat => (
          <div
            key={`chat_${chat.id}`}
            className={`chat-message-${(chat.author === userID) ? 'me' : 'other'}`}
          >
            <p>{chat.content}</p>
          </div>
        ))}
      </div>
      <br />
      <input
        id="chat-input"
        type="text"
        value={props.chatInput}
        onChange={event => props.changeChatInput(event.target.value)}
        onKeyDown={event => { if (event.key === 'Enter') props.clickSendChatHandler() }}
      />
      <button
        type="button"
        onClick={() => props.clickSendChatHandler()}
      >Send chat</button>
    </>
  )
}

export default ChattingRoom
