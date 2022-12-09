import { useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { fetchRecommend, selectUser } from '../../store/slices/user/user'
import useInterval from '../../utils/useInterval'
import RecommendEntity from '../RecommendEntity/RecommendEntity'

const Recommend = () => {
  const dispatch = useDispatch<AppDispatch>()
  const userState = useSelector(selectUser)

  useEffect(() => {
    dispatch(fetchRecommend())
  }, [dispatch])

  useInterval(() => {
    if (userState.recommend.is_outdated) {
      dispatch(fetchRecommend())
    }
  }, 500)

  return (
    <>
      {userState.recommend.is_outdated
        ? <>
            <p>Calculating in progress with changed tags...</p>
            <Spinner animation="border" variant="primary" />
          </>
        : !userState.recommend.recommend_list.length
            ? <p>Please add your preference tag to use recommend system!</p>
            : null}
      <div className='booklist'>
        {userState.recommend.recommend_list.map((recommend, idx: number) => (
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
