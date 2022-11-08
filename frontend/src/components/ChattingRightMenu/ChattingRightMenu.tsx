import { SelectedChatGroup } from '../../containers/ChattingPage/ChattingPage'

export interface IProps {
  group: SelectedChatGroup
  borrowable: boolean
  borrowed: boolean
  clickConfirmLendingHandler: () => Promise<void>
  clickConfirmReturnHandler: () => Promise<void>
}

const ChattingRightMenu = (props: IProps) => {
  if (props.group === 'lend') {
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
}

export default ChattingRightMenu
