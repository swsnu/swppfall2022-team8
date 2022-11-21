import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import './BookListEntity.css'

interface IProps {
  id: number
  image: string
  title: string
  available?: boolean
};

const BookListEntity = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <Card style={ { width: '18rem' } } onClick={() => navigate(`/book/${props.id}`)} className='book-list-entity' >
      <Card.Img variant='top' src={props.image} className='book-entity-image'/>
      <Card.Body>
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          {props.available}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default BookListEntity
