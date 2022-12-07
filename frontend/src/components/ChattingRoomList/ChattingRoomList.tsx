import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchNextUserRooms, RoomType, selectRoom } from '../../store/slices/room/room'
import { selectUser } from '../../store/slices/user/user'
import './ChattingRoomList.css'

export interface IProps {
  enterRoom: (room: RoomType) => void
}

const ChattingRoomList = (props: IProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const roomState = useSelector(selectRoom)
  const userState = useSelector(selectUser)

  const clickLoadRoomHandler = () => {
    dispatch(fetchNextUserRooms())
  }

  return (
    <div id='chatting-room-list'>
      {roomState.rooms.map(room => {
        const isUserLender = room.lender === userState.currentUser?.id
        const othersPosition = isUserLender
          ? 'Borrower'
          : 'Lender'
        const othersUsername = isUserLender
          ? room.borrower_username
          : room.lender_username
        return (
          <div
            key={`room_${room.id}`}
            className='chatting-room'
            onClick={() => props.enterRoom(room)}
          >
            <h3 id='chat-with-text'>[{othersPosition}] {othersUsername}</h3>
          </div>
        )
      })}
      <Button
        variant='primary-secondary'
        type="button"
        disabled={!roomState.next}
        onClick={() => clickLoadRoomHandler()}
      >more..</Button>
    </div>
  )
}

export default ChattingRoomList
