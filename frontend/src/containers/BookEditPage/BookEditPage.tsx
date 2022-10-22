import { SetStateAction, useRef, useState } from "react";
import { useNavigate } from "react-router"

const BookEditPage = () => {
  //useParams, useEffect로 현재 book정보 fetch받아서 초기값 설정해야함
  const navigate = useNavigate()
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(0);
  const [info, setInfo] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);


  const onChangeTitleHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setTitle(event.currentTarget.value);
  }
  const onChangeCostHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setCost(Number(event.currentTarget.value));
  }
  const onChangeInfoHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setInfo(event.currentTarget.value);
  }
  const onChangeTagHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setTag(event.currentTarget.value);
  }
  const onChangeQuestionHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setQuestion(event.currentTarget.value);
  }

  const addTagHandler = ()=>{
    const new_tags : string[] = [...tags, tag]
    setTags(new_tags)
    setTag("")
  }
  const addQuestionHandler = ()=>{
    const new_questions : string[] = [...questions, question]
    setQuestions(new_questions)
    setQuestion("")
  }

  const deleteTagHandler = (index:number)=>{
    const new_tags = tags.filter((tag, idx)=>idx!==index)
    setTags(new_tags)
  }
  const deleteQuestionHandler = (index:number)=>{
    const new_questions = questions.filter((tag, idx)=>idx!==index)
    setQuestions(new_questions)
  }

  const onConfirmHanler = ()=>{
    if(tags.length === 0){
      alert("Should have at least one tag!")
    }
    else{
      // backend 위해 일단 비워둠
    }
  }

  return (
    <div className="BookEditPage">
      <h1>BookEditPage</h1>

      {/* image 일단 생략 */}

      <br />

      <label>title<input type="text" value={title} onChange={onChangeTitleHandler} required /></label>
      <br />
      <label>borrowing cost<input type="number" min="0" step="100" value={cost} onChange={onChangeCostHandler} required /></label>
      <br />
      <label>additional info<input type="text" value={info} onChange={onChangeInfoHandler} required /></label>
      <br />
      
      <label>tags
      <input type="text" value={tag} onChange={onChangeTagHandler}/>
      <button onClick={addTagHandler} disabled={tag===""}>add</button>
      </label>
      {/* list tags */}
      {tags.map((tag, index)=>{
        return (<div key={index}>{tag} <button onClick={()=>deleteTagHandler(index)}>x</button></div>)
      })}

      <br />

      <label>questions
      <input type="text" value={question} onChange={onChangeQuestionHandler}/>
      <button onClick={addQuestionHandler} disabled={question===""}>add</button>
      </label>
      {/* list questions */}
      {questions.map((question, index)=>{
        return (<div key={index}>{question} <button onClick={()=>deleteQuestionHandler(index)}>x</button></div>)
      })}

      <button onClick={onConfirmHanler}>Register!</button>
    </div>
  );
}

export default BookEditPage