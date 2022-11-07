import { useNavigate } from 'react-router'
import './BookListEntity.css'

interface IProps {
  id: number
  title: string
  available?: boolean
};

const BookListEntity = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <div
      className="book-list-entity"
      onClick={() => navigate(`/book/${props.id}`)}
    >
      <p>
        {props.title}
        {props.available ? '  Available!' : null}
      </p>
    </div>
  )
}

export default BookListEntity
