import { SetStateAction, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router"
import { AppDispatch } from "../../store";
import { selectBook } from "../../store/slices/book/book";
import { createLend, selectLend } from "../../store/slices/lend/lend";

const BookRegisterPage = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const bookState = useSelector(selectBook);
  const lendState = useSelector(selectLend);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cost, setCost] = useState(0);
  const [info, setInfo] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);


  const onChangeTitleHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setTitle(event.currentTarget.value);
  }
  const onChangeAuthorHandler = (event: { currentTarget: { value: SetStateAction<string>; }; }) =>{
    setAuthor(event.currentTarget.value);
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

  const onConfirmHanler = async ()=>{
    if(tags.length === 0){
      alert("Should have at least one tag!")
    }
    else{
      // backend 위해 일단 비워둠
      const book_data = {
        title: title,
        author: author,
        tags: tags,
        brief: info,
      }

      await dispatch(creaetBook(book_data))

      const lend_data = {
        book: bookState.selectedBook!.id,
        book_info: book_data,
        owner: 1,///////////////////
        questions: questions,
        cost: cost,
        additional: 1,////////////////////////
      }
      await dispatch(createLend(lend_data))

      navigate(`book/${lendState.selectedLend!.id}`)
    }
  }

  return (
    <div className="BookRegisterPage">
      <h1>BookRegisterPage</h1>

      {/* image 일단 생략 */}

      <br />

      <label>title<input type="text" value={title} onChange={onChangeTitleHandler} /></label>
      <br />
      <label>author<input type="text" value={author} onChange={onChangeAuthorHandler} /></label>
      <br />
      <label>additional info<input type="text" value={info} onChange={onChangeInfoHandler} /></label>
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
      <br />

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

export default BookRegisterPage

function creaetBook(book_data: { title: string; author: string; tags: string[]; brief: string; }): any {
  throw new Error("Function not implemented.");
}
