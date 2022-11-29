import Pagination from 'react-bootstrap/Pagination'

export interface IProps {
  currPage: number
  numPage: number
  handleClick: (page: number) => void
}

const PageButton = (props: IProps) => {
  let minPage = props.currPage - 4
  let maxPage = props.currPage + 4

  if (minPage < 1 && maxPage > props.numPage) {
    minPage = 1
    maxPage = props.numPage
  } else if (minPage < 1) {
    maxPage = Math.min(maxPage - minPage + 1, props.numPage)
    minPage = 1
  } else if (maxPage > props.numPage) {
    minPage = Math.max(props.numPage + minPage - maxPage, 1)
    maxPage = props.numPage
  }

  const items = []
  for (let i = minPage; i <= maxPage; i++) {
    items.push(
      <Pagination.Item
        key={`page_${i}`}
        active={i === props.currPage}
        onClick={() => props.handleClick(i)}
      >
        {i}
      </Pagination.Item>
    )
  }

  return (
    <Pagination>
      {minPage !== 1
        ? <>
            <Pagination.First onClick={() => props.handleClick(1)}/>
            <Pagination.Prev onClick={() => props.handleClick(props.currPage - 1)}/>
          </>
        : null
      }
      {items}
      {maxPage !== props.numPage
        ? <>
            <Pagination.Next onClick={() => props.handleClick(props.currPage + 1)}/>
            <Pagination.Last onClick={() => props.handleClick(props.numPage)}/>
          </>
        : null
      }
    </Pagination>
  )
}

export default PageButton
