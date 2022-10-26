import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import ChattingButton from '../../components/ChattingButton/ChattingButton'
import LogoButton from '../../components/LogoButton/LogoButton'
import RegisterButton from '../../components/RegisterButton/RegisterButton'
import { AppDispatch } from '../../store'
import { fetchLend, selectLend, updateLend } from '../../store/slices/lend/lend'

const BookEditPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const lendState = useSelector(selectLend)

  useEffect(() => {
    dispatch(fetchLend(Number(id)))
  }, [id, dispatch])

  const [cost, setCost] = useState<number>(lendState.selectedLend?.cost ?? 0)
  const [question, setQuestion] = useState('')
  const [questions, setQuestions] = useState<string[]>(lendState.selectedLend?.questions ?? [])
  const [info, setInfo] = useState(lendState.selectedLend?.additional ?? '')

  const clickAddQuestionHandler = () => {
    const new_questions: string[] = [...questions, question]
    setQuestions(new_questions)
    setQuestion('')
  }
  const clickDeleteQuestionHandler = (index: number) => {
    const new_questions = questions.filter((_question, idx) => idx !== index)
    setQuestions(new_questions)
  }

  const clickConfirmEditHanler = async () => {
    if (lendState.selectedLend != null) {
      const lend_data = {
        id: lendState.selectedLend.id,
        book: lendState.selectedLend.book,
        book_info: lendState.selectedLend.book_info,
        owner: lendState.selectedLend.owner,
        questions,
        cost,
        additional: info
      }
      await dispatch(updateLend(lend_data))
      navigate(`/book/${lendState.selectedLend.id}`)
    }
  }

  return (
    <>
      <LogoButton />
      <RegisterButton />
      <ChattingButton />
      <br/>
      <h1>BookEditPage</h1>
      <br/>

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
        <input type="text" value={question} onChange={event => setQuestion(event.target.value)}/>
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

      <button type="button" onClick={async () => await clickConfirmEditHanler()}>Edit</button>
    </>
  )
}

export default BookEditPage
