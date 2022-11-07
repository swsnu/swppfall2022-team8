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
    > <div className='image-grid'>
        <div className='image-small'>
          image
        </div>
      </div>
      <h2>{props.title}</h2>
      <h3>{props.available ? '  Available!' : null}</h3>
    </div>
  )
}

export default BookListEntity
