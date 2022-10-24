import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { AppDispatch } from "../../store";
import { fetchLend, selectLend } from "../../store/slices/lend/lend";

const BookRequestPage = () => {
  const [answers, setAnswers] = useState<string[]>([]);

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const lendState = useSelector(selectLend);

  useEffect(() => {
    dispatch(fetchLend(Number(id)));
  }, [id, dispatch]);

  const sendButtonHandler = () => {
    // TODO: send answers to chatting room
    navigate("/chat");
  };

  const answerChangeHandler = (idx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[idx] = value;
    setAnswers(newAnswers);
  };

  return (
    <>
      <h3>Book Name:&nbsp;{lendState.selectedLend ? lendState.selectedLend.book_info.title : ""}</h3> 

      {lendState.selectedLend ? lendState.selectedLend.questions.map((q, i) => (
        <div key={`question_${i}`}>
          <h3>Question: {q}</h3>
          <h3>Answer:</h3>
          <input
            value={answers[i] ?? ""}
            onChange={event => answerChangeHandler(i, event.target.value)}></input>
        </div>
      )) : null}

      <br/>
      <button onClick={() => sendButtonHandler()}>send to lender</button>
    </>
  );
}

export default BookRequestPage
