import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "../../store"
import { fetchRecommend, selectUser } from "../../store/slices/user/user"
import RecommendEntity from "../RecommendEntity/RecommendEntity"

const Recommend = () => {
    const dispatch = useDispatch<AppDispatch>()
    const userState = useSelector(selectUser)

    const [fetched, setFetched] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const onClickHandler = async () => {
        setLoading(true)
        const response = await dispatch(fetchRecommend())

        if (response.type === `${fetchRecommend.typePrefix}/fulfilled`) {
            setFetched(true)
        }
        setLoading(false)
    }

    if (!userState.recommend_list.length) {
        return (
            <>
                <button onClick={onClickHandler}>Recommend!</button>
                <br />
                <br />
                {loading &&
                    <p>Loading...</p>
                }
            </>
        )
    }
    else {
        return (
            <>
                <button onClick={onClickHandler}>Refresh Recommend!</button>
                <br />
                <br />
                {loading &&
                    <p>Loading...</p>
                }
                {userState.recommend_list.map((recommend, idx) => (
                    <div key={`recommendlist_${idx}`}>
                        <RecommendEntity
                            idx={idx + 1}
                            title={recommend.title}
                        />
                    </div>
                ))}
            </>
        )
    }


    if (!fetched) {
        return (
            <>
                <button onClick={onClickHandler}>Recommend!</button>
            </>
        )
    }
    else {
        return (
            <>
                {userState.recommend_list.map((recommend, idx) => (
                    <div key={`recommendlist_${idx}`}>
                        <RecommendEntity
                            idx={idx}
                            title={recommend.title}
                        />
                    </div>
                ))}
            </>
        )
    }
}

export default Recommend