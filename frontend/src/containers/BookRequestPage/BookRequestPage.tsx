import { useState } from "react";
import { useNavigate } from "react-router";
import { isTaggedTemplateExpression } from "typescript";

const questionsList = [
  "Question1",
  "Qusetion2",
]

const BookRequestPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Array<string>>([...Array(questionsList.length)].map(() => ""));
  const sendButtonHandler = () => {
    navigate("/chat");
  }

  const answerChangeHandler = (id: number, value: string) => {
    const cpy = [...answers];
    cpy[id] = value;
    setAnswers(cpy);
  }

  return (
    <>
      <h1>Book Request Page</h1>
      <h3>Name</h3>
      example name 

      {questionsList.map((q, i) => {
        return(
          <div key={`question_${i}`}>
            <h3>{q}</h3>
            <h3>Answer:</h3>
            <input
              value={answers[i]}
              onChange={(event) => answerChangeHandler(i, event.target.value)}></input>
          </div>
        )
      })}

      <p></p>
      <button onClick={() => sendButtonHandler()}>send to lender</button>
    </>
  );
}

export default BookRequestPage
