import { screen, fireEvent, waitFor } from '@testing-library/react'
import { RootState } from '../../store'
import { renderWithProviders, rootInitialState } from '../../test-utils/mock'
import ChattingRightMenu from './ChattingRightMenu'

const preloadedState: RootState = rootInitialState

const mockClickConfirmLendingHandler = jest.fn()
const mockClickConfirmReturnHandler = jest.fn()

describe('<ChattingRightMenu />', () => {
  it('should navigate when clicked (group=lend borrowable=true, borrowd=false)', async () => {
    // given
    renderWithProviders(
      <ChattingRightMenu group='lend' borrowable={true} borrowed={false} clickConfirmLendingHandler={mockClickConfirmLendingHandler} clickConfirmReturnHandler={mockClickConfirmReturnHandler} />,
      { preloadedState }
    )
    const button = await screen.findByText('Confirm lending')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockClickConfirmLendingHandler).toHaveBeenCalled())
  })
  it('should navigate when clicked (group=lend borrowable=false, borrowd=true)', async () => {
    // given
    renderWithProviders(
      <ChattingRightMenu group='lend' borrowable={false} borrowed={true} clickConfirmLendingHandler={mockClickConfirmLendingHandler} clickConfirmReturnHandler={mockClickConfirmReturnHandler} />,
      { preloadedState }
    )
    const button = await screen.findByText('Confirm return')

    // when
    fireEvent.click(button)

    // then
    await waitFor(() => expect(mockClickConfirmReturnHandler).toHaveBeenCalled())
  })
  it('should render (group=lend borrowable=false, borrowd=false)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu group='lend' borrowable={false} borrowed={false} clickConfirmLendingHandler={mockClickConfirmLendingHandler} clickConfirmReturnHandler={mockClickConfirmReturnHandler} />,
      { preloadedState }
    )

    // when
    const info = container.getElementsByTagName('p')

    // then
    expect(info.item(0)?.innerHTML).toEqual('You\'ve already lent your book to someone!')
  })
  it('should render (group=borrow borrowable=true, borrowd=false)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu group='borrow' borrowable={true} borrowed={false} clickConfirmLendingHandler={mockClickConfirmLendingHandler} clickConfirmReturnHandler={mockClickConfirmReturnHandler} />,
      { preloadedState }
    )

    // when
    const info = container.getElementsByTagName('p')

    // then
    expect(info.item(0)?.innerHTML).toEqual('You can borrow this book!')
  })
  it('should render (group=borrow borrowable=false, borrowd=true)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu group='borrow' borrowable={false} borrowed={true} clickConfirmLendingHandler={mockClickConfirmLendingHandler} clickConfirmReturnHandler={mockClickConfirmReturnHandler} />,
      { preloadedState }
    )

    // when
    const info = container.getElementsByTagName('p')

    // then
    expect(info.item(0)?.innerHTML).toEqual('You are borrowing this book now!')
  })
  it('should render (group=borrow borrowable=false, borrowd=false)', async () => {
    // given
    const { container } = renderWithProviders(
      <ChattingRightMenu group='borrow' borrowable={false} borrowed={false} clickConfirmLendingHandler={mockClickConfirmLendingHandler} clickConfirmReturnHandler={mockClickConfirmReturnHandler} />,
      { preloadedState }
    )

    // when
    const info = container.getElementsByTagName('p')

    // then
    expect(info.item(0)?.innerHTML).toEqual('Someone has already borrowed this book...')
  })
})
