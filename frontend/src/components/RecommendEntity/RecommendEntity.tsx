import { useNavigate } from 'react-router'

interface IProps {
  idx: number
  title: string
};

const RecommendEntity = (props: IProps) => {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(`/search?title=${props.title}`)} >
      <p>
        {props.idx}
        {'. '}
        {props.title}
      </p>
    </div>
  )
}

export default RecommendEntity
