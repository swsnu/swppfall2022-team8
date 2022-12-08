import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import AlertModal from './AlertModal'

const mockHide = jest.fn()
const mockHandler = jest.fn()

const mockProps = {
  header: 'MODAL_TEST_HEADER',
  body: 'MODAL_TEST_BODY',
  show: true,
  hide: mockHide,
  handler: mockHandler
}

describe('<AlertModal />', () => {
  it('should handle confirm case', async () => {
    // given
    render(<AlertModal {...mockProps}/>)

    // when
    const confirmButton = await screen.findByText('Confirm')
    fireEvent.click(confirmButton)

    // then
    await waitFor(() => expect(mockHide).toHaveBeenCalled())
    await waitFor(() => expect(mockHandler).toHaveBeenCalled())
  })
  it('should handle alert case', async () => {
    // given
    render(<AlertModal {...{ ...mockProps, handler: undefined } }/>)

    // when
    const closeButton = await screen.findByText('Close')
    fireEvent.click(closeButton)

    // then
    await waitFor(() => expect(mockHide).toHaveBeenCalled())
  })
})
