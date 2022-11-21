import { Card } from 'react-bootstrap'
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
      <Card style={ { width: '18rem' } }>
        { /* 이미지 들어오면 합칠예정 */ }
        <Card.Img variant='top' src='holder.js/100px180'/>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>
            {props.available}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default BookListEntity
