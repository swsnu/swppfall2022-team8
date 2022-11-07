import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChattingRightMenu from '../../components/ChattingRigntMenu/ChattingRightMenu'
import ChattingRoom from '../../components/ChattingRoom/ChattingRoom'
import ChattingRoomList from '../../components/ChattingRoomList/ChattingRoomList'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { BorrowType, createBorrow, toggleBorrowStatus } from '../../store/slices/borrow/borrow'
import { fetchLend, LendType } from '../../store/slices/lend/lend'
import { fetchUserRooms, selectRoom } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'

export type SelectedChatGroup = 'lend' | 'borrow'
export type ChatGroup = '' | 'lend' | 'borrow'

export interface ChatType {
  id: number
  author: number
  author_username: string
  content: string
  timestamp: string
}

const ChattingPage = () => {
  const [chatInput, setChatInput] = useState<string>('')
  const [chatIdx, setChatIdx] = useState<number>(-1)
  const [group, setGroup] = useState<ChatGroup>('')
  const [connectedRoom, setConnectedRoom] = useState<number>(-1)
  const [borrowable, setBorrowable] = useState<boolean>(false)
  const [borrowed, setBorrowed] = useState<boolean>(false)
  const [chatList, setChatList] = useState<ChatType[]>([])
  const chatSocket = useRef<WebSocket | null>(null)

  const dispatch = useDispatch<AppDispatch>()
  const roomState = useSelector(selectRoom)
  const userState = useSelector(selectUser)

  useEffect(() => {
    dispatch(fetchUserRooms())
    return () => {
      if (chatSocket.current) {
        chatSocket.current.close(1000)
      }
    }
  }, [dispatch])

  // this code makes chatting scroll down when new chatting is added
  useEffect(() => {
    const chatBox = document.querySelector('#chat-box')
    if (chatBox) {
      chatBox.scrollTop = chatBox.scrollHeight
    }
  }, [chatList])

  const createAndSetupSocket = (roomID: number) => {
    const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomID}/`)

    chatSocket.current = newSocket

    newSocket.addEventListener('open', function (_event) {
      this.send(JSON.stringify({ command: 'list' }))
    })

    newSocket.addEventListener('message', function (event) {
      const data = JSON.parse(event.data)
      if (data.command === 'list') {
        const messages = data.messages as ChatType[]
        setChatList(oldList => [...oldList, ...messages])
      } else if (data.command === 'create') {
        const message = data.message as ChatType
        setChatList(oldList => [...oldList, message])
      }
    })

    newSocket.addEventListener('close', function (event) {
      if (event.code !== 1000) {
        console.error('Chat socket closed unexpectedly')
      }
    })
  }

  const clickRoomHandler = async (idx: number, selectedGroup: 'lend' | 'borrow') => {
    const rooms = selectedGroup === 'lend'
      ? roomState.rooms_lend
      : roomState.rooms_borrow
    const room = rooms[idx]

    if (room.id === connectedRoom) {
      return
    }

    setChatList(_oldList => [])

    const response = await dispatch(fetchLend(room.lend_id))

    if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
      const data = response.payload as LendType
      const borrowStatus = data.status as BorrowType | null
      setBorrowable(!borrowStatus)
      setBorrowed(Boolean(borrowStatus && borrowStatus.borrower === room.borrower))
      setChatIdx(idx)
    } else {
      alert('Error on fetch lending information')
      return
    }

    if (chatSocket.current) {
      chatSocket.current.close(1000)
      chatSocket.current = null
      setConnectedRoom(-1)
    }

    setConnectedRoom(room.id)

    createAndSetupSocket(room.id)
  }

  const clickSendChatHandler = () => {
    if (!chatSocket.current) {
      alert('connection is closed')
      return
    }

    if (chatInput) {
      chatSocket.current.send(JSON.stringify({
        message: chatInput,
        user_id: userState.currentUser?.id ?? NaN,
        command: 'create'
      }))
      setChatInput('')
    }
  }

  const clickConfirmLendingHandler = async () => {
    const data = {
      borrower: roomState.rooms_lend[chatIdx].borrower,
      lend_id: roomState.rooms_lend[chatIdx].lend_id
    }

    const response = await dispatch(createBorrow(data))

    if (response.type === `${createBorrow.typePrefix}/fulfilled`) {
      // TODO: send approval message to borrower
      alert('Successfully lent')
      setBorrowable(false)
      setBorrowed(true)
    } else {
      alert('Error on create borrow')
    }
  }

  const clickConfirmReturnHandler = async () => {
    const response = await dispatch(fetchLend(roomState.rooms_lend[chatIdx].lend_id))

    if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
      const data = response.payload as LendType
      if (!data.status) {
        alert('Unable to load lending status')
        return
      }
      const borrowStatus = data.status as BorrowType
      const toggleResponse = await dispatch(toggleBorrowStatus(borrowStatus.id))

      if (toggleResponse.type === `${toggleBorrowStatus.typePrefix}/fulfilled`) {
        // TODO: send returning message to borrower
        alert('Successfully return')
        setBorrowable(true)
        setBorrowed(false)
      } else {
        alert('Error on toggle borrow status')
      }
    } else {
      alert('Error on fetch lending information')
    }
  }

  return (
    <>
      <NavBar />
      <h1>ChattingPage</h1>
      <br />
      <hr />

      {/* Select buttons (lend group or borrow group) */}
      <button
        type="button"
        onClick={() => {
          setGroup('lend')
          setChatIdx(-1)
        }}
      >lend rooms</button>
      <button
        type="button"
        onClick={() => {
          setGroup('borrow')
          setChatIdx(-1)
        }}
      >borrow rooms</button>
      <br />
      <hr />

      {/* ChattingRoomList component */}
      {(group)
        ? <ChattingRoomList
            group={group}
            clickRoomHandler={clickRoomHandler}
          />
        : null}
      <br />
      <hr />

      {/* ChattingRoom component */}
      {(group && chatIdx >= 0)
        ? <ChattingRoom
            group={group}
            chatIdx={chatIdx}
            chatList={chatList}
            chatInput={chatInput}
            changeChatInput={setChatInput}
            clickSendChatHandler={clickSendChatHandler}
          />
        : <p>Select any chatroom and enjoy chatting!</p>
      }
      <br />
      <hr />

      {/* ChattingRightMenu component */}
      {(group && chatIdx >= 0)
        ? <ChattingRightMenu
            group={group}
            borrowable={borrowable}
            borrowed={borrowed}
            clickConfirmLendingHandler={clickConfirmLendingHandler}
            clickConfirmReturnHandler={clickConfirmReturnHandler}
          />
        : null }
      <br />
      <hr />
    </>
  )
}

export default ChattingPage
