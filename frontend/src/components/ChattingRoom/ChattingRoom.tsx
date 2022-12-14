import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { ChatRank, ChatType } from '../../containers/ChattingPage/ChattingPage'
import { RoomType } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'
import './ChattingRoom.css'

export interface IProps {
  room: RoomType
  chatCursor: string | null
  oldChatList: ChatType[]
  newChatList: ChatType[]
  loadMessage: () => void
  sendMessage: (message: string, rank: ChatRank) => boolean
}

const ChattingRoom = (props: IProps) => {
  const [chatInput, setChatInput] = useState<string>('')
  const prevScrollHeight = useRef<number>(0)
  const userState = useSelector(selectUser)

  const userID = userState.currentUser?.id
  const othersUsername = userID === props.room.lender
    ? props.room.borrower_username
    : props.room.lender_username

  const chatList = [...props.oldChatList, ...props.newChatList]
  const disableChat = !chatInput

  // this code scrolls down the chat room when a new chat is added
  useEffect(() => {
    const chatBox = document.querySelector('#chat-box') as Element
    chatBox.scrollTop = chatBox.scrollHeight
  }, [props.newChatList])

  // this code maintains the scroll of the chat room when the previous chat was loaded
  useEffect(() => {
    const chatBox = document.querySelector('#chat-box') as Element
    chatBox.scrollTop = chatBox.scrollHeight - prevScrollHeight.current
  }, [props.oldChatList])

  const clickLoadChatHandler = () => {
    const chatBox = document.querySelector('#chat-box') as Element
    prevScrollHeight.current = chatBox.scrollHeight
    props.loadMessage()
  }

  const clickSendChatHandler = () => {
    const message = chatInput.slice()
    setChatInput('')
    props.sendMessage(message, 'chat')
  }

  return (
    <>
      <div id='chatting-room'>
        <h2 id='other-users-name'>{othersUsername}</h2>
        <div id="chat-box">
          <Button
            variant='outline-secondary'
            type="button"
            disabled={!props.chatCursor}
            onClick={() => clickLoadChatHandler()}
          >more..</Button>
          {chatList.map(chat => {
            const date = new Date(chat.timestamp)
            return (
              <div
                key={`chat_${chat.id}`}
              >
                <div
                  className={`chat-message-${
                    (chat.rank === 'info')
                      ? 'info'
                      : (chat.author === userID) ? 'me' : 'other'
                    }`
                  }
                >
                  <p className={`chat-text-${(chat.rank === 'info') ? 'info' : (chat.author === userID) ? 'me' : 'other'}`}>{chat.content}</p>
                  <h5 className={`chat-time-${(chat.rank === 'info') ? 'info' : (chat.author === userID) ? 'me' : 'other'}`}><> {date.getMonth()} / {date.getDate()}&nbsp; {date.getHours()} : {date.getMinutes()}</></h5>
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <InputGroup className='mb-3' id='chat-input-group'>
            <Form.Control
              id='chat-input'
              type='text'
              autoComplete='off'
              value={chatInput}
              onChange={event => setChatInput(event.target.value)}
              onKeyPress={event => { if (event.key === 'Enter' && !disableChat) { event.preventDefault(); clickSendChatHandler() } }}
            />
            <Button id='send-button' disabled={disableChat} onClick={() => clickSendChatHandler()}>
              <FontAwesomeIcon id='paper-plane' icon={faPaperPlane}/>
            </Button>
          </InputGroup>
        </div>
      </div>
    </>
  )
}

export default ChattingRoom
