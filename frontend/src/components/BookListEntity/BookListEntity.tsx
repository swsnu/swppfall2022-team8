import { useNavigate } from 'react-router'
import './BookListEntity.css'

interface IProps {
  id: number
  title: string
};

const BookListEntity = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <div
      className="book-list-entity"
      onClick={() => navigate(`/book/${props.id}`)}
    >
      <p>{props.title}</p>
    </div>
  )
}

export default BookListEntity
