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
    if (chatInput) {
      const success = props.sendMessage(chatInput, 'chat')
      if (success) {
        setChatInput('')
      }
    }
  }

  return (
    <>
      <div id='chatting-room'>
        <h2 id='other-users-name'>{othersUsername}</h2>
        <div id="chat-box">
          <button
            type="button"
            disabled={!props.chatCursor}
            onClick={() => clickLoadChatHandler()}
          >&uarr;</button>
          {chatList.map(chat => (
            <div
              key={`chat_${chat.id}`}
              className={`chat-message-${(chat.author === userID) ? 'me' : 'other'} ${chat.rank}`}
            >
              <p className={`chat-text-${(chat.author === userID) ? 'me' : 'other'}`}>{chat.content}</p>
            </div>
          ))}
        </div>
        <div>
          <InputGroup className='mb-3' id='chat-input'>
            <Form.Control
              id='chat-input'
              type='text'
              value={chatInput}
              onChange={event => setChatInput(event.target.value)}
              onKeyDown={event => { if (event.key === 'Enter') clickSendChatHandler() }}
            />
            <Button id='send-button' onClick={() => clickSendChatHandler()}>
              <FontAwesomeIcon id='paper-plane' icon={faPaperPlane}/>
            </Button>
          </InputGroup>
        </div>
      </div>
    </>
  )
}

export default ChattingRoom
