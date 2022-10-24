import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router"
import { AppDispatch } from "../../store";
import { createBook, selectBook } from "../../store/slices/book/book";
import { createLend, selectLend } from "../../store/slices/lend/lend";

const BookRegisterPage = () => {

  const dispatch = useDispatch<AppDispatch>();
  const bookState = useSelector(selectBook);
  const lendState = useSelector(selectLend);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [cost, setCost] = useState(0);
  const [info, setInfo] = useState("");
  const [brief, setBrief] = useState("");
  const [tag, setTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);


  const addTagHandler = () => {
    const new_tags : string[] = [...tags, tag];
    setTags(new_tags);
    setTag("");
  };

  const addQuestionHandler = () => {
    const new_questions : string[] = [...questions, question];
    setQuestions(new_questions);
    setQuestion("");
  };

  const deleteTagHandler = (index: number) => {
    const new_tags = tags.filter((tag, idx) => idx !== index);
    setTags(new_tags);
  };
  
  const deleteQuestionHandler = (index: number) => {
    const new_questions = questions.filter((tag, idx) => idx !== index);
    setQuestions(new_questions);
  };

  const onConfirmHanler = async () => {
    if(!title || !author || !brief || tags.length === 0) {
      let msg = "Should fill in :\n";
      if(!title) msg += "\ntitle";
      if(!author) msg += "\nauthor";
      if(!brief) msg += "\nbrief summary";
      if(tags.length === 0) msg += "\nat least one tag";
      alert(msg);
    }
    else{
      const book_data = {
        title: title,
        author: author,
        tags: tags,
        brief: brief,
      };

      const response_book = await dispatch(createBook(book_data));

      if (response_book.type === `${createBook.typePrefix}/fulfilled`) {
        const lend_data = {
          book: bookState.selectedBook?.id ?? NaN,
          book_info: book_data,
          owner: 1, // TODO: implement User
          questions: questions,
          cost: cost,
          additional: info,
        };

        const response_lend = await dispatch(createLend(lend_data));
        if (response_lend.type === `${createLend.typePrefix}/fulfilled`) {
          setSubmitted(true);
        }
      }

    }
  }

  if (submitted) {
    return <Navigate to={`/book/${lendState.selectedLend?.id}`} />;
  } else {
    return (
      <div className="BookRegisterPage">
        <h1>BookRegisterPage</h1>

        {/* TODO: add image to backend */}

        <br />

        <label>title<input type="text" value={title} onChange={event => setTitle(event.target.value)} /></label>
        <br />
        <label>author<input type="text" value={author} onChange={event => setAuthor(event.target.value)} /></label>
        <br />
        <label>Brief summary<input type="text" value={brief} onChange={event => setBrief(event.target.value)} /></label>
        <br />

        <label>tags
        <input type="text" value={tag} onChange={event => setTag(event.target.value)}/>
        <button onClick={() => addTagHandler()} disabled={tag===""}>add</button>
        </label>
        {tags.map((tag, index)=>{
          return (<div key={index}>{tag} <button onClick={() => deleteTagHandler(index)}>x</button></div>)
        })}
        <br />
        <br />

        <label>borrowing cost<input type="number" min="0" step="100" value={cost} onChange={event => setCost(Number(event.target.value))} /></label>
        <br />
        <label>additional info (optional)<input type="text" value={info} onChange={event => setInfo(event.target.value)} /></label>
        <br />
        
        <label>questions (optional)
        <input type="text" value={question} onChange={event => setQuestion(event.target.value)}/>
        <button onClick={addQuestionHandler} disabled={question===""}>add</button>
        </label>
        {questions.map((question, index)=>{
          return (<div key={index}>{question} <button onClick={()=>deleteQuestionHandler(index)}>x</button></div>)
        })}
        <br />

        <button onClick={() => onConfirmHanler()}>Register</button>
      </div>
    );
  }
}

export default BookRegisterPage;