import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router'

interface IProps {
  idx: number
  image: string
  title: string
};

const RecommendEntity = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <Card
      style={ { width: '18rem' } }
      className='book-list-entity'
      onClick={() => navigate(`/search?title=${props.title}`)}
      >
      <Card.Img variant='top' src={props.image} className='book-entity-image'/>
      <Card.Body>
        <Card.Title>{props.idx}</Card.Title>
        <Card.Text>{props.title}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default RecommendEntity
