import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { fetchLend, selectLend, updateLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'

const BookEditPage = () => {
  const id = useParams().id as string
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const lendState = useSelector(selectLend)
  const userState = useSelector(selectUser)

  useEffect(() => {
    (async () => {
      if (!userState.currentUser) {
        navigate('/login')
        return
      }

      const response = await dispatch(fetchLend(Number(id)))

      if (response.type === `${fetchLend.typePrefix}/fulfilled`) {
        if (response.payload.owner !== userState.currentUser.id) {
          alert('You can\'t edit other\'s book!')
          navigate('/main')
        }
      } else {
        const surfix = id ? `/${id}` : ''
        navigate(`/book${surfix}`)
      }
    })()
  }, [id, dispatch])

  const [cost, setCost] = useState<number>(lendState.selectedLend?.cost ?? 0)
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState<string[]>(lendState.selectedLend?.questions ?? [])
  const [info, setInfo] = useState(lendState.selectedLend?.additional ?? '')

  const clickAddQuestionHandler = () => {
    const newQuestions: string[] = [...questions, question]
    setQuestions(newQuestions)
    setQuestion('')
  }
  const clickDeleteQuestionHandler = (index: number) => {
    const newQuestions = questions.filter((_question, idx) => idx !== index)
    setQuestions(newQuestions)
  }

  const clickConfirmEditHanler = async () => {
    if (lendState.selectedLend != null) {
      const lendData = {
        id: lendState.selectedLend.id,
        book: lendState.selectedLend.book,
        book_info: lendState.selectedLend.book_info,
        owner: lendState.selectedLend.owner,
        owner_username: lendState.selectedLend.owner_username,
        questions,
        cost,
        additional: info
      }
      await dispatch(updateLend(lendData))
      navigate(`/book/${lendState.selectedLend.id}`)
    }
  }

  return (
    <>
      <NavBar />
      <h1>BookEditPage</h1>
      <br />

      <p>Can only edit lend info.</p>

      <div>title : {lendState.selectedLend?.book_info.title}</div>
      <div>author : {lendState.selectedLend?.book_info.author}</div>
      <div>brief summary : {lendState.selectedLend?.book_info.brief}</div>
      <div>tags : {lendState.selectedLend?.book_info.tags}</div>

      <label>
        borrowing cost
        <input
          type="number"
          min="0"
          step="100"
          value={cost}
          onChange={event => setCost(Number(event.target.value))}
        />
      </label>
      <br />
      <label>
        additional info (optional)
        <input type="text" value={info} onChange={event => setInfo(event.target.value)} />
      </label>
      <br />

      <label>
        questions
        <input type="text" value={question} onChange={event => setQuestion(event.target.value)} />
        <button
          type="button"
          onClick={() => clickAddQuestionHandler()}
          disabled={!question}
        >add</button>
      </label>
      {questions.map((question, index) => (
        <div key={index}>
          {question}
          <button type="button" onClick={() => clickDeleteQuestionHandler(index)}>x</button>
        </div>
      ))}
      <br />

      <button type="button" onClick={() => clickConfirmEditHanler()}>Edit</button>
    </>
  )
}

export default BookEditPage
