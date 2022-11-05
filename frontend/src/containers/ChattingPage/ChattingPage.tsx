import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { BorrowType, createBorrow, toggleBorrowStatus } from '../../store/slices/borrow/borrow'
import { fetchLend, LendType } from '../../store/slices/lend/lend'
import { fetchUserRooms, selectRoom } from '../../store/slices/room/room'

type ChatGroup = '' | 'lend' | 'borrow'

const ChattingPage = () => {
  const [chatInput, setChatInput] = useState<string>('')
  const [chatLog/*, setChatLog */] = useState<string[]>([])
  const [chatIdx, setChatIdx] = useState<number>(-1)
  const [group, setGroup] = useState<ChatGroup>('')
  const [borrowable, setBorrowable] = useState<boolean>(false)
  const [borrowed, setBorrowed] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const roomState = useSelector(selectRoom)

  useEffect(() => {
    dispatch(fetchUserRooms())
  }, [dispatch])

  // TODO: get chat log by WebSocket

  const clickRoomHandler = async (idx: number, selectedGroup: 'lend' | 'borrow') => {
    // TODO: enter chat room using WebSocket
    const rooms = selectedGroup === 'lend'
      ? roomState.rooms_lend
      : roomState.rooms_borrow
    const response = await dispatch(fetchLend(rooms[idx].lend_id))

    if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
      const data = response.payload as LendType
      const borrowStatus = data.status as BorrowType | null
      setBorrowable(!borrowStatus)
      setBorrowed(Boolean(borrowStatus && borrowStatus.borrower === rooms[idx].borrower))
      setChatIdx(idx)
    } else {
      alert('Error on fetch lending information')
    }
  }

  const clickSendChatHandler = () => {
    // TODO: send chatInput by WebSocket
    setChatInput('')
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
      {(() => {
        if (group === 'lend') {
          return (
            <>
              {roomState.rooms_lend.map((room, idx) => (
                <div
                  key={`room_lend_${idx}_to_${room.borrower}`}
                  onClick={() => clickRoomHandler(idx, 'lend')}
                >
                  <p>chat with {room.borrower_username}</p>
                </div>
              ))}
            </>
          )
        } else if (group === 'borrow') {
          return (
            <>
              {roomState.rooms_borrow.map((room, idx) => (
                <div
                  key={`room_borrow_${idx}_from_${room.lender}`}
                  onClick={() => clickRoomHandler(idx, 'borrow')}
                >
                  <p>chat with {room.lender_username}</p>
                </div>
              ))}
            </>
          )
        }
        return null // group === ''
      })()}
      <br />
      <hr />
      {(() => {
        if (!group || chatIdx < 0) {
          return <p>Select any chatroom and enjoy chatting!</p>
        }
        return (
          <>
            {(() => {
              if (group === 'lend') {
                return <p>Chatting with {roomState.rooms_lend[chatIdx].borrower_username}</p>
              } else {
                return <p>Chatting with {roomState.rooms_borrow[chatIdx].lender_username}</p>
              }
            })()}
            <textarea
              defaultValue={chatLog.join('\n')}
            ></textarea>
            <br />
            <label htmlFor="chat-input">chat&gt;</label>
            <input
              id="chat-input"
              type="text"
              value={chatInput}
              onChange={event => setChatInput(event.target.value)}
            />
            <button type="button" onClick={() => clickSendChatHandler()}>Send chat</button>
            <br />
            <hr />
            {(() => {
              if (group === 'lend') {
                if (borrowable) {
                  return (
                    <button
                      type="button"
                      onClick={() => clickConfirmLendingHandler()}
                    >Confirm lending</button>
                  )
                } else if (borrowed) {
                  return (
                    <button
                      type="button"
                      onClick={() => clickConfirmReturnHandler()}
                    >Confirm return</button>
                  )
                } else {
                  return <p>You&apos;ve already lent your book to someone!</p>
                }
              } else {
                if (borrowable) {
                  return <p>You can borrow this book!</p>
                } else if (borrowed) {
                  return <p>You are borrowing this book now!</p>
                } else {
                  return <p>Someone has already borrowed this book...</p>
                }
              }
            })()}
          </>
        )
      })()}
      <br />
      <hr />
    </>
  )
}

export default ChattingPage
