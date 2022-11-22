import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchRecommend, selectUser } from '../../store/slices/user/user'
import RecommendEntity from '../RecommendEntity/RecommendEntity'

const Recommend = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const dispatch = useDispatch<AppDispatch>()
  const userState = useSelector(selectUser)

  const onClickHandler = async () => {
    setLoading(true)
    await dispatch(fetchRecommend())
    setLoading(false)
  }

  return (
    <>
      <br/>
      <Button onClick={onClickHandler}>
        {userState.recommend_list.length
          ? 'Refresh '
          : ''
        }
        Recommend!
      </Button>
      <br />
      <br />
      {loading && <p>Loading...</p>}
      <div className='booklist'>
        {userState.recommend_list.map((recommend, idx) => (
          <div key={`recommendlist_${idx}`}>
            <RecommendEntity
              idx={idx + 1}
              image={recommend.image}
              title={recommend.title}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default Recommend
