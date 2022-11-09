import { useSelector } from 'react-redux'
import { SelectedChatGroup } from '../../containers/ChattingPage/ChattingPage'
import { selectRoom } from '../../store/slices/room/room'

export interface IProps {
  group: SelectedChatGroup
  clickRoomHandler: (idx: number, group: SelectedChatGroup) => Promise<void>
}

const ChattingRoomList = (props: IProps) => {
  const roomState = useSelector(selectRoom)

  const rooms = {
    lend: roomState.rooms_lend,
    borrow: roomState.rooms_borrow
  }

  return (
    <>
      {rooms[props.group].map((room, idx) => {
        const otherUsername = {
          lend: room.borrower_username,
          borrow: room.lender_username
        }
        return (
          <div key={`room_${room.id}`}>
            <button
              type="button"
              onClick={() => props.clickRoomHandler(idx, props.group)}
            >chat with {otherUsername[props.group]}</button>
          </div>
        )
      })}
    </>
  )
}

export default ChattingRoomList
