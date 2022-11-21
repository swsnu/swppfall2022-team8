import { useNavigate } from 'react-router'

interface IProps {
  idx: number
  image: string
  title: string
};

const RecommendEntity = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/search?title=${props.title}`)} >
      <img alt='Image Not Found' width={'100px'} src={props.image} />
      <p>
        {props.idx}
        {'. '}
        {props.title}
      </p>
    </div>
  )
}

export default RecommendEntity
