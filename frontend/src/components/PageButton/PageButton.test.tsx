import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import PageButton from './PageButton'

describe('<PageButton />', () => {
  it('should handle small case', async () => {
    // given
    const mockClickHandler = jest.fn()
    render(<PageButton currPage={1} numPage={5} handleClick={mockClickHandler}/>)

    // when
    const page2 = screen.getByText('2')
    fireEvent.click(page2)

    // then
    await waitFor(() => expect(mockClickHandler).toHaveBeenCalledWith(2))
  })
  it('should handle large case, small start', async () => {
    // given
    const mockClickHandler = jest.fn()
    render(<PageButton currPage={1} numPage={90} handleClick={mockClickHandler}/>)

    // when
    const nextPage = screen.getByText('Next')
    fireEvent.click(nextPage)

    // then
    await waitFor(() => expect(mockClickHandler).toHaveBeenCalledWith(2))

    // when
    const lastPage = screen.getByText('Last')
    fireEvent.click(lastPage)

    // then
    await waitFor(() => expect(mockClickHandler).toHaveBeenCalledWith(90))
  })
  it('should handle large case, large start', async () => {
    // given
    const mockClickHandler = jest.fn()
    render(<PageButton currPage={90} numPage={90} handleClick={mockClickHandler}/>)

    // when
    const prevPage = screen.getByText('Previous')
    fireEvent.click(prevPage)

    // then
    await waitFor(() => expect(mockClickHandler).toHaveBeenCalledWith(89))

    // when
    const firstPage = screen.getByText('First')
    fireEvent.click(firstPage)

    // then
    await waitFor(() => expect(mockClickHandler).toHaveBeenCalledWith(1))
  })
  it('should handle large case, medium start', async () => {
    // given
    const mockClickHandler = jest.fn()
    render(<PageButton currPage={45} numPage={90} handleClick={mockClickHandler}/>)

    // then
    screen.getByText('First')
    screen.getByText('Last')
  })
})
