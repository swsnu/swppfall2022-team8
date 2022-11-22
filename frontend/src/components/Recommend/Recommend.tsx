import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchRecommend, selectUser } from '../../store/slices/user/user'
import RecommendEntity from '../RecommendEntity/RecommendEntity'

const Recommend = () => {
  const dispatch = useDispatch<AppDispatch>()
  const userState = useSelector(selectUser)

  useEffect(() => {
    (async () => {
      await dispatch(fetchRecommend())
    })()
  }, [dispatch])

  const onClickHandler = async () => {
    await dispatch(fetchRecommend())
  }

  if (userState.recommend.is_outdated) {
    return (
      <>
        <button onClick={onClickHandler}>
          Refresh!
        </button>
        <p>Calculating in progress with changed tags... Please refresh after a while.</p>
        {userState.recommend.recommend_list.map((recommend, idx) => (
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
  } else if (!userState.recommend.recommend_list) {
    return (
      <>
        <p>Please add your preference tag to use recommend system!</p>
      </>
    )
  } else {
    return (
      <>
        {userState.recommend.recommend_list.map((recommend, idx) => (
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
}

export default Recommend
