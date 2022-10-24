import { SetStateAction, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router"
import { AppDispatch } from "../../store";
import { fetchLend, selectLend, updateLend } from "../../store/slices/lend/lend";

const BookEditPage = () => {
  //useParams, useEffect로 현재 book정보 fetch받아서 초기값 설정해야함
  const {id} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const lendState = useSelector(selectLend);

  useEffect(() => {
    dispatch(fetchLend(Number(id)))
  },[]);
  
  const [cost, setCost] = useState(lendState.selectedLend!.cost);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>(lendState.selectedLend!.questions);

  const onChangeCostHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setCost(Number(event.currentTarget.value));
  }
  const onChangeQuestionHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setQuestion(event.currentTarget.value);
  }

  const addQuestionHandler = ()=>{
    const new_questions : string[] = [...questions, question]
    setQuestions(new_questions)
    setQuestion("")
  }
  const deleteQuestionHandler = (index:number)=>{
    const new_questions = questions.filter((tag, idx)=>idx!==index)
    setQuestions(new_questions)
  }

  const onConfirmHanler = async ()=>{
    const lend_data = {
      id: lendState.selectedLend!.id,
      book: lendState.selectedLend!.book,
      book_info: lendState.selectedLend!.book_info,
      owner: lendState.selectedLend!.owner,
      questions: questions,
      cost: cost,
      additional: lendState.selectedLend!.additional,
    }
    await dispatch(updateLend(lend_data))
    navigate(`book/${lendState.selectedLend!.id}`)
  }

  return (
    <div className="BookEditPage">
      <h1>BookEditPage</h1>

      <p>Can only edit lend info.</p>

      <div>title : {lendState.selectedLend!.book_info.title}</div>
      <div>author : {lendState.selectedLend!.book_info.author}</div>
      <div>brief : {lendState.selectedLend!.book_info.brief}</div>
      <div>tags : {lendState.selectedLend!.book_info.tags}</div>

      <label>borrowing cost<input type="number" min="0" step="100" value={cost} onChange={onChangeCostHandler} /></label>
      <br />

      <label>questions
      <input type="text" value={question} onChange={onChangeQuestionHandler}/>
      <button onClick={addQuestionHandler} disabled={question===""}>add</button>
      </label>
      {/* list questions */}
      {questions.map((question, index)=>{
        return (<div key={index}>{question} <button onClick={()=>deleteQuestionHandler(index)}>x</button></div>)
      })}
      <br />

      <button onClick={onConfirmHanler}>Register!</button>
    </div>
  );
}

export default BookEditPage