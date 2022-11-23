import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ChattingRightMenu from '../../components/ChattingRightMenu/ChattingRightMenu'
import ChattingRoom from '../../components/ChattingRoom/ChattingRoom'
import ChattingRoomList from '../../components/ChattingRoomList/ChattingRoomList'
import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { BorrowType, createBorrow, toggleBorrowStatus } from '../../store/slices/borrow/borrow'
import { fetchLend, LendType } from '../../store/slices/lend/lend'
import { fetchUserRooms, RoomType, selectRoom } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'

import './ChattingPage.css'

export type ChatRank = 'chat' | 'info'

export interface ChatType {
  id: number
  author: number
  author_username: string
  content: string
  timestamp: string
  rank: ChatRank
}

const ChattingPage = () => {
  const [currentRoom, setCurrentRoom] = useState<RoomType | null>(null)
  const [oldChatList, setOldChatList] = useState<ChatType[]>([])
  const [newChatList, setNewChatList] = useState<ChatType[]>([])
  const [borrowable, setBorrowable] = useState<boolean>(false)
  const [borrowed, setBorrowed] = useState<boolean>(false)
  const chatSocket = useRef<WebSocket | null>(null)
  const chatCursor = useRef<string | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const roomState = useSelector(selectRoom)
  const userState = useSelector(selectUser)

  useEffect(() => {
    if (roomState.selectedRoom) {
      enterRoom(roomState.selectedRoom)
    }
    dispatch(fetchUserRooms())
    return () => {
      if (chatSocket.current && chatSocket.current.readyState !== WebSocket.CLOSED) {
        chatSocket.current.close(1000)
        chatSocket.current = null
      }
    }
  }, [dispatch])

  /*
   * Functions handling WebSocket
   */
  const enterRoom = (room: RoomType) => {
    if (room.id === currentRoom?.id) {
      return
    }

    setOldChatList(_prev => [])
    setNewChatList(_prev => [])

    createRoomConnection(room)

    setCurrentRoom(room)
    refreshBorrowStatus(room)
  }

  const loadMessage = () => {
    if (!chatSocket.current || chatSocket.current.readyState === WebSocket.CLOSED) {
      alert('connection is closed')
      return
    }

    chatSocket.current.send(JSON.stringify({ command: 'list', cursor: chatCursor.current }))
  }

  const sendMessage = (message: string, rank: ChatRank) => {
    if (!chatSocket.current || chatSocket.current.readyState === WebSocket.CLOSED) {
      alert('connection is closed')
      return false
    }

    chatSocket.current.send(JSON.stringify({
      message,
      rank,
      user_id: userState.currentUser?.id ?? null,
      command: 'create'
    }))

    return true
  }

  /*
   * Detailed specification about WebSocket Connection
   */
  const createRoomConnection = (room: RoomType) => {
    if (chatSocket.current && chatSocket.current.readyState !== WebSocket.CLOSED) {
      chatSocket.current.close(1000)
      chatSocket.current = null
    }

    const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${room.id}/`)

    chatSocket.current = newSocket

    newSocket.addEventListener('open', function (_event) {
      this.send(JSON.stringify({ command: 'list', cursor: null }))
    })

    newSocket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data)
      if (data.command === 'list') {
        const messages = data.messages as ChatType[]
        chatCursor.current = data.next ?? null
        setOldChatList(prev => [...messages, ...prev])
      } else if (data.command === 'create') {
        const message = data.message as ChatType
        setNewChatList(prev => [...prev, message])
        if (message.rank === 'info') {
          refreshBorrowStatus(room)
        }
      }
    })

    newSocket.addEventListener('close', function (event) {
      if (event.code !== 1000) {
        console.error('Chat socket closed unexpectedly')
      }
    })
  }

  const refreshBorrowStatus = async (room: RoomType) => {
    const response = await dispatch(fetchLend(room.lend_id))

    if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
      const data = response.payload as LendType
      const borrowStatus = data.status as BorrowType | null
      setBorrowable(!borrowStatus)
      setBorrowed(Boolean(borrowStatus && borrowStatus.borrower === room.borrower))
    } else {
      alert('Error on fetch lending information')
    }
  }

  /*
   * Click event handlers
   */
  const clickConfirmLendingHandler = async () => {
    const confirmLendingMessage = 'You have successfully borrowed this book!'

    if (!currentRoom || !globalThis.confirm('Are you sure you want to confirm lending?')) {
      return
    }

    const data = {
      borrower: currentRoom.borrower,
      lend_id: currentRoom.lend_id
    }

    const response = await dispatch(createBorrow(data))

    if (response.type === `${createBorrow.typePrefix}/fulfilled`) {
      sendMessage(confirmLendingMessage, 'info')
      setBorrowable(false)
      setBorrowed(true)
    } else {
      alert('Error on create borrow')
    }
  }

  const clickConfirmReturnHandler = async () => {
    const confirmReturnMessage = 'You have successfully returned this book!'

    if (!currentRoom || !globalThis.confirm('Are you sure you want to confirm return?')) {
      return
    }

    const response = await dispatch(fetchLend(currentRoom.lend_id))

    if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
      const data = response.payload as LendType
      if (!data.status) {
        alert('Unable to load lending status')
        return
      }
      const borrowStatus = data.status as BorrowType
      const toggleResponse = await dispatch(toggleBorrowStatus(borrowStatus.id))

      if (toggleResponse.type === `${toggleBorrowStatus.typePrefix}/fulfilled`) {
        sendMessage(confirmReturnMessage, 'info')
        setBorrowable(true)
        setBorrowed(false)
      } else {
        alert('Error on toggle borrow status')
      }
    } else {
      alert('Error on fetch lending information')
    }
  }

  /*
   * HTML structure
   */
  return (
    <div className='page'>
      <NavBar />
      <h1>ChattingPage</h1>
      <br />
      <hr />

      {/* ChattingRoomList component */}
      <ChattingRoomList
        enterRoom={enterRoom}
      />
      <br />
      <hr />

      {/* ChattingRoom component */}
      {(currentRoom)
        ? <ChattingRoom
            room={currentRoom}
            chatCursor={chatCursor.current}
            oldChatList={oldChatList}
            newChatList={newChatList}
            loadMessage={loadMessage}
            sendMessage={sendMessage}
          />
        : <p>Select any chatroom and enjoy chatting!</p>
      }
      <br />
      <hr />

      {/* ChattingRightMenu component */}
      {(currentRoom)
        ? <ChattingRightMenu
            room={currentRoom}
            borrowable={borrowable}
            borrowed={borrowed}
            clickConfirmLendingHandler={clickConfirmLendingHandler}
            clickConfirmReturnHandler={clickConfirmReturnHandler}
          />
        : null
      }
      <br />
      <hr />
    </div>
  )
}

export default ChattingPage
