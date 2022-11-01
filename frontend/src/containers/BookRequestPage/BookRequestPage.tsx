import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'

import NavBar from '../../components/NavBar/NavBar'
import { AppDispatch } from '../../store'
import { fetchLend, selectLend } from '../../store/slices/lend/lend'
import { selectUser } from '../../store/slices/user/user'

const BookRequestPage = () => {
  const [answers, setAnswers] = useState<string[]>([])

  const id = useParams().id as string
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
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
        if (response.payload.owner === userState.currentUser.id) {
          alert('You can\'t borrow your book!')
          navigate('/main')
        }
      } else {
        const surfix = id ? `/${id}` : ''
        navigate(`/book${surfix}`)
      }
    })()
  }, [id, dispatch])

  const clickSendButtonHandler = () => {
    if (lendState.selectedLend == null) {
      return
    }

    const { questions } = lendState.selectedLend
    if (questions.length !== answers.length || answers.some(val => !val)) {
      alert('You should fill in all answers.')
      return
    }

    // TODO: send answers to chatting room

    navigate('/chat')
  }

  const changeAnswerHandler = (idx: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[idx] = value
    setAnswers([...newAnswers])
  }

  return (
    <>
      <NavBar />
      <h1>MainPage</h1>
      <br />

      <h3>Book Name:&nbsp;{(lendState.selectedLend != null) ? lendState.selectedLend.book_info.title : ''}</h3>

      {(lendState.selectedLend != null)
        ? lendState.selectedLend.questions.map((question, idx) => (
          <div key={`question_${idx}`}>
            <h3>Question: {question}</h3>
            <h3>Answer:</h3>
            <input
              value={answers[idx] ?? ''}
              onChange={event => changeAnswerHandler(idx, event.target.value)}></input>
          </div>
        ))
        : null}

      <br />
      <button onClick={() => clickSendButtonHandler()}>send to lender</button>
    </>
  )
}

export default BookRequestPage
