import { useState } from 'react'
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
      <button onClick={onClickHandler}>
        {userState.recommend_list.length
          ? 'Refresh '
          : ''
        }
        Recommend!
      </button>
      <br />
      <br />
      {loading && <p>Loading...</p>}
      {userState.recommend_list.map((recommend, idx) => (
        <div key={`recommendlist_${idx}`}>
          <RecommendEntity
            idx={idx + 1}
            image={recommend.image}
            title={recommend.title}
          />
        </div>
      ))}
    </>
  )
}

export default Recommend
