import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router"

import ChattingButton from "../../components/ChattingButton/ChattingButton";
import LogoButton from "../../components/LogoButton/LogoButton";
import RegisterButton from "../../components/RegisterButton/RegisterButton";
import { AppDispatch } from "../../store";
import { BookType, createBook } from "../../store/slices/book/book";
import { createLend, selectLend } from "../../store/slices/lend/lend";

const BookRegisterPage = () => {
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

  const dispatch = useDispatch<AppDispatch>();
  const lendState = useSelector(selectLend);

  const clickAddTagHandler = () => {
    const new_tags : string[] = [...tags, tag];
    setTags(new_tags);
    setTag("");
  };

  const clickAddQuestionHandler = () => {
    const new_questions : string[] = [...questions, question];
    setQuestions(new_questions);
    setQuestion("");
  };

  const clickDeleteTagHandler = (index: number) => {
    const new_tags = tags.filter((tag, idx) => idx !== index);
    setTags(new_tags);
  };
  
  const clickDeleteQuestionHandler = (index: number) => {
    const new_questions = questions.filter((_question, idx) => idx !== index);
    setQuestions(new_questions);
  };

  const clickConfirmRegisterHanler = async () => {
    const validationCheckList = [title, author, brief, tags.length];
    const validationMessages = ["title", "author", "brief summary", "at least one tag"];

    if(validationCheckList.some(val => !val)) {
      const messageBuffer = ["Should fill in :"];
      validationCheckList.forEach((val, idx) => {
        if(!val) {
          messageBuffer.push(validationMessages[idx]);
        }
      });
      alert(messageBuffer.join('\n'));
      return;
    }

    const bookData = {
      title: title,
      author: author,
      tags: tags,
      brief: brief,
    };

    const responseBook = await dispatch(createBook(bookData));

    if (responseBook.type === `${createBook.typePrefix}/fulfilled`) {
      const { id } = responseBook.payload as BookType
      const lendData = {
        book: id,
        book_info: bookData,
        owner: 1, // TODO: implement User
        questions: questions,
        cost: cost,
        additional: info,
      };

      const responseLend = await dispatch(createLend(lendData));

      if (responseLend.type === `${createLend.typePrefix}/fulfilled`) {
        setSubmitted(true);
      }
      else {
        alert("Error on Register a book (lend)");
      }
    }
    else {
      alert("Error on Register a book (book)");
    }
  }

  if (submitted) {
    return <Navigate to={`/book${lendState.selectedLend ? `/${lendState.selectedLend.id}` : ""}`} />;
  } 
  else {
    return (
      <>
        <LogoButton />
        <RegisterButton />
        <ChattingButton />
        <br/>
        <h1>BookRegisterPage</h1>
        <br/>

        {/* TODO: add image upload field */}
        
        <label>
          title
          <input type="text" value={title} onChange={event => setTitle(event.target.value)} />
        </label>
        <br />
        <label>
          author
          <input type="text" value={author} onChange={event => setAuthor(event.target.value)} />
        </label>
        <br />
        <label>
          Brief summary
          <input type="text" value={brief} onChange={event => setBrief(event.target.value)} />
        </label>
        <br />

        <label>
          tags
          <input type="text" value={tag} onChange={event => setTag(event.target.value)}/>
          <button 
            type="button"
            onClick={() => clickAddTagHandler()} 
            disabled={!tag}
          >add</button>
        </label>
        {tags.map((tag, index) => (
          <div key={index}>
            {tag}
            <button type="button" onClick={() => clickDeleteTagHandler(index)}>x</button>
          </div>
        ))}

        <br />
        <br />
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
          questions (optional)
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

        <button type="button" onClick={() => clickConfirmRegisterHanler()}>Register</button>
      </>
    );
  }
}

export default BookRegisterPage;